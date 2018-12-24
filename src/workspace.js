import Vue from 'vue'
import LRUCache from 'lru-cache'

export default class Workspace {
    /**
     *
     * @param {string} [hash]
     */
    constructor(hash) {
        this.hash = hash;
        this.items = [];
        this.fileCache = new LRUCache({
            max: 20,
            maxAge: 10 * 60 * 1000 //10 minutes
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
                'Cache-Control': 'no-cache'
            }
        }).then(rs => {
            this.fileCache.set(item.file, rs.data);
            return rs.data;
        });
    }

    /**
     *
     * @returns {Promise<Workspace>}
     */
    create() {
        return Vue.prototype.$api({
            url: '/workspaces/create',
            method: 'post'
        }).then(rs => {
            this.hash = rs.data.hash;
            return this;
        });
    }

    /**
     *
     * @returns {boolean}
     */
    hasItems() {
        return this.items && this.items.length;
    }

    /**
     *
     * @returns {Promise<Workspace>}
     */
    loadStructure() {
        return Vue.prototype.$api.get('/workspace/' + this.hash + '/structure').then(rs => {
            //console.log(rs.data.children);
            this.items = rs.data;
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
            params: {'folder': folder ? 'true' : 'false', name, parent, workspace: this.hash}
        }).then(rs => rs.data);
        //todo add item to this.items or refreshWorkspace?
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
     * @param {Object} file
     * @param {string} content
     * @returns {Promise}
     */
    saveFileContent(file, content) {
        return Vue.prototype.$api({
            url: '/files/edit',
            method: 'put',
            params: {workspace: this.hash, file: file.id},
            headers: {'Content-Type': 'text/plain'},
            data: content
        }).then(() => {
            this.fileCache.set(file.file, content);
        });
    }
}