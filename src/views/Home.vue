<template>
    <div class="home editor-wrapper">
        <editor-drop-zone @file-upload-done="onFileUploadDone"
                          @undefined-workspace-hash="onUndefinedWorkspace"
                          :workspaceHash="wsHash">

            <file-tree v-show="showFileTree"
                       class="file-tree"
                       :files="treeItems"
                       @file-open="onFileOpen"
                       @add-folder="onAddItem(true)"
                       @add-file="onAddItem(false)"
                       @move-item="onItemMove"
                       :active-file-id="activeFile ? activeFile.id : 0"
            ></file-tree>

            <editor v-bind:class="{'file-tree-visible': showFileTree}"
                    :content="editorContent"
                    :file="activeFile"
                    :auto-save="autoSave"
                    :editable="editable"
                    @inactive="onEditorInactive"
            ></editor>

        </editor-drop-zone>
    </div>
</template>

<script>

    import Editor from '../components/Editor';
    import FileTree from '../components/FileTree';
    import EditorDropZone from '../components/EditorDropZone';
    import Workspace from '../workspace';

    export default {
        name: 'home',
        data() {
            return {
                /** @var {?Workspace} workspace */
                workspace: null,
                /** @var {?string} editorContent */
                editorContent: null,
                /** @var {?Object} activeFile */
                activeFile: null,
                /** @var {boolean} autoSave */
                autoSave: true,
            }
        },
        computed: {
            showFileTree() {
                //show file tree only if there are more files
                //in workspace or the only item is a folder
                if (!this.workspace || !this.workspace.hasItems()) {
                    return false;
                }
                let items = this.workspace.items;
                return !(items.length === 1 && items[0].file);
            },
            wsHash() {
                if (!this.workspace) {
                    return null;
                }
                return this.workspace.hash;
            },
            treeItems() {
                if (!this.workspace) {
                    return [];
                }
                return this.workspace.items;
            },
            editable() {
                if (!this.workspace) {
                    return true;
                }
                return this.workspace.canEdit();
            }
        },
        beforeRouteEnter(to, from, next) {
            next(_this => {
                _this.processRoute.apply(_this);
            });
        },
        methods: {
            clearWorkspace() {
                this.autoSave = false;
                this.editorContent = '';
                this.workspace = null;
                this.activeFile = null;
                this.$nextTick(() => {
                    this.autoSave = true;
                })
            },
            /**
             *
             * @returns {Promise}
             */
            refreshWorkspace() {
                return this.loadWorkspace(this.workspace.hash, true);
            },
            /**
             *
             * @param {string} wsHash
             * @param {boolean} [force]
             * @returns {Promise}
             */
            loadWorkspace(wsHash, force) {
                if (!this.workspace || this.workspace.hash !== wsHash) {
                    this.workspace = new Workspace(wsHash);
                } else if (this.workspace.hash === wsHash && !force) {
                    return Promise.resolve(false);
                }

                //todo loading icon / spinner
                return this.workspace.loadStructure().then(ws => {
                    if (ws.items.length === 1) {
                        let node = ws.items[0];
                        if (node.file) {
                            this.openFile(node);
                        }
                    }
                });
            },
            /**
             *
             * @param {Object} file
             * @returns {Promise}
             */
            openFile(file) {
                //todo loading icon / spinner
                this.autoSave = false;
                return this.workspace.loadFileContent(file).then(content => {
                    this.editorContent = content;
                    this.activeFile = file;

                    let path = '';
                    if (this.showFileTree) {
                        path = `/${file.path.join('/')}`;
                    }
                    this.$router.push({path: `/${this.workspace.hash}${path}`});
                    this.$nextTick(() => {
                        this.autoSave = true;
                    });
                });
            },
            /**
             *
             * @returns {Promise<Workspace>}
             */
            createWorkspace() {
                return new Workspace().create().then(ws => {
                    this.workspace = ws;
                    this.$router.push({path: `/${this.workspace.hash}`});
                    return this.workspace;
                });
            },
            /**
             *
             * @param {string} name
             * @param {boolean} [folder]
             * @param {boolean} [noRefresh]
             * @returns {Promise<Object>}
             */
            addItem(name, folder, noRefresh) {
                let promise = this.workspace.addItem(name, !!folder, this.activeFile);
                if (!noRefresh) {
                    return promise.then(file => {
                        return this.refreshWorkspace().then(() => file);
                    });
                }
                return promise;
            },
            /**
             *
             * @returns {Promise<Workspace>}
             */
            getWorkspace() {
                if (this.workspace) {
                    return Promise.resolve(this.workspace);
                }
                return this.createWorkspace();
            },

            processRoute() {
                if (this.$route.params.workspace) {
                    this.loadWorkspace(this.$route.params.workspace).then(() => {
                        let filename = this.$route.params.filename;
                        if (filename) {
                            let file = this.workspace.findFile(filename);
                            if (file) {
                                return this.openFile(file);
                            }
                            return Promise.resolve(false);
                        }
                    }).catch(() => {
                        console.log('reset route');
                        this.$router.replace({name: 'index'});
                        //todo show error dialog
                    });
                }
            },
            onItemMove({item, parent}) {
                this.workspace.moveItem(item, parent)
                    .then(() => this.refreshWorkspace())
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            },
            onFileUploadDone() {
                this.refreshWorkspace().catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            onAddItem(folder) {
                let name = window.prompt('Enter folder/file name:') || 'unnamed.txt';
                this.addItem(name, folder).catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            onUndefinedWorkspace() {
                this.createWorkspace().catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            onFileOpen(file) {
                this.openFile(file).catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            onEditorInactive({file, content}) {
                this.getWorkspace()
                    .then(workspace => {
                        if (file) {
                            return Promise.resolve({workspace, f: file});
                        } else {
                            return this.addItem('unnamed.txt', false, true).then(f => ({workspace, f}));
                        }
                    })
                    .then(({workspace, f}) => workspace.saveFileContent(f, content))
                    .then(() => {
                        if (!file) {
                            return this.refreshWorkspace();
                        }
                        //todo change file saved indicator
                    })
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            },
        },
        watch: {
            '$route': function (route) {
                if (route.name === 'index') {
                    this.clearWorkspace();
                }
            }
        },
        components: {
            EditorDropZone,
            Editor,
            FileTree,
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    .file-tree {
        width: calc(20% - 1px);
        display: inline-block;
        height: calc(100vh - @nav-height - 1px);
        vertical-align: top;
        overflow: auto;
        border-right: 1px solid;
        .theme({ background-color: @content-background-color; border-color: darken(@background-color, 20%); });
    }

    .file-tree-visible {
        width: 80%;
    }

    .editor-wrapper {
        position: relative;
    }

    .tree-item {
        cursor: pointer;
    }
</style>
