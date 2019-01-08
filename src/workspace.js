import Vue from 'vue'
import LRUCache from 'lru-cache'

export default class Workspace {
    /**
     *
     * @param {string} hash
     */
    constructor(hash) {
        /** @var {string} */
        this.hash = hash;
        /** @var {?string} */
        this.editToken = null;
        /** @var {Object[]} */
        this.items = [];
        /** @var {boolean} */
        this.isOwner = true;
        /** @var {LRUCache} */
        this.fileCache = new LRUCache({
            max: 20,
            maxAge: 10 * 60 * 1000 //10 minutes
        });
    }

    /**
     *
     * @returns {Promise<Workspace>}
     */
    static create() {
        return Vue.prototype.$api({
            url: '/workspaces/create',
            method: 'post'
        }).then(rs => {
            let workspace = new Workspace(rs.data.hash);
            workspace.editToken = rs.data.editToken;
            return workspace;
        });
    }

    /**
     *
     * @param {Object} item
     * @param {boolean} [ignoreCache]
     * @returns {Promise}
     */
    loadFileContent(item, ignoreCache) {
        if (!ignoreCache && this.fileCache.has(item.file)) {
            return Promise.resolve(this.fileCache.get(item.file));
        }
        return Vue.prototype.$api({
            url: '/file/' + item.file,
            transformResponse: [data => data],
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'text/plain'
            },
            validateStatus: function (status) {
                return status === 200 || status === 406;
            },
        }).then(rs => {
            item.mime = rs.headers['content-type'];
            let content = rs.data;
            this.fileCache.set(item.file, content);
            return content;
        });
    }

    /**
     *
     * @returns {boolean}
     */
    hasItems() {
        return !!(this.items && this.items.length);
    }

    /**
     *
     * @returns {Promise<Workspace>}
     */
    loadStructure() {
        return Vue.prototype.$api.get('/workspace/' + this.hash).then(rs => {
            //console.log(rs.data.children);
            this.isOwner = !!rs.data.owner;
            this.items = rs.data.structure;
            return this;
        });
    }

    /**
     *
     * @param {string} name - item name
     * @param {boolean} [folder] - is folder or file
     * @param {number|Object} [parent] - parent id or item to get parent id from
     * @returns {Promise}
     */
    addItem(name, folder, parent) {
        if (!parent) {
            parent = 0;
        }
        if (typeof parent === 'object') {
            parent = parent.parent_id;
        }
        if (!parent) {
            parent = 0;
        }
        return Vue.prototype.$api({
            url: '/files/create',
            method: 'put',
            params: {'folder': folder ? 'true' : 'false', name, parent, workspace: this.hash, edit: this.editToken}
        }).then(rs => rs.data);
        //todo add item to this.items or refreshWorkspace?
    }

    /**
     *
     * @param {Object} item
     * @param {Object} [parent]
     * @returns {Promise}
     */
    moveItem(item, parent) {
        return Vue.prototype.$api({
            url: '/files/move',
            method: 'put',
            params: {id: item.id, parent: parent ? parent.id : 0, workspace: this.hash, edit: this.editToken}
        });
    }

    /**
     *
     * @param {Object} item
     * @returns {Promise}
     */
    removeItem(item) {
        return Vue.prototype.$api({
            url: '/files/delete',
            method: 'post',
            params: {id: item.id, workspace: this.hash, edit: this.editToken}
        }).then(() => {
            if (item.file) {
                this.fileCache.del(item.file);
            }
        });
    }

    /**
     *
     * @param {Object} item
     * @param {string} name
     * @returns {Promise}
     */
    renameItem(item, name) {
        return Vue.prototype.$api({
            url: '/files/rename',
            method: 'put',
            params: {id: item.id, name, workspace: this.hash, edit: this.editToken}
        });
    }

    /**
     *
     * @param {string} path
     * @returns {Object|null}
     */
    findFile(path) {
        let parts = path.split('/');
        let filename = parts.pop();
        let arr = this.items;

        for (let part of parts) {
            let found = null;
            for (let node of arr) {
                if (node.name === part) {
                    found = node;
                    break;
                }
            }
            if (!found || !found.children) {
                return null;
            }
            arr = found.children;
        }
        for (let file of arr) {
            if (file.name === filename) {
                return file;
            }
        }

        return null;
    }

    /**
     *
     * @param {number} id
     * @param {Object} [__items]
     * @returns {Object|null}
     */
    getItemById(id, __items) {
        if (__items === undefined) {
            __items = this.items;
        }
        for (let item of __items) {
            if (item.id === id) {
                return item;
            }
            if (item.children) {
                let childFound = this.getItemById(id, item.children);
                if (childFound) {
                    return childFound;
                }
            }
        }
        return null;
    }

    /**
     *
     * @param {Object} file
     * @param {string} content
     * @returns {Promise}
     */
    saveFileContent(file, content) {
        return Vue.prototype.$api({
            url: '/files/edit',
            method: 'put',
            params: {workspace: this.hash, file: file.id, edit: this.editToken},
            headers: {'Content-Type': 'text/plain'},
            data: content
        }).then(() => {
            this.fileCache.set(file.file, content);
        });
    }

    /**
     *
     * @returns {boolean}
     */
    canEdit() {
        //todo check timestamp
        return this.isOwner || !!this.editToken;
    }
}