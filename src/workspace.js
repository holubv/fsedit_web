import Vue from 'vue'

export default class Workspace {
    /**
     *
     * @param {string} hash
     */
    constructor(hash) {
        this.hash = hash;
        this.items = [];
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
        });
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
}