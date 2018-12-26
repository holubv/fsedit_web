<template>
    <div class="home editor-wrapper">
        <!--<button v-for="type in ['none', 'min', 'small', 'normal', 'max', 'full']" @click="forceSideView = type">{{ type }}</button>-->
        <editor-drop-zone @file-upload-done="onFileUploadDone"
                          @undefined-workspace-hash="onUndefinedWorkspace"
                          :workspaceHash="wsHash">

            <split-panel :side="sideView" @switch="onSidePanelSwitch">

                <template slot="side-head">
                    <div v-if="editable" :class="['side-panel', 'size-' + sideView]">
                        <button class="btn primary"
                                @click.prevent="onAddItem(false)"
                                title="Add file">
                            <i class="fas fa-plus"></i>
                            <span v-if="sideView !== 'small'">Add file</span>
                        </button>
                        <button class="btn"
                                @click.prevent="onAddItem(true)"
                                title="Add folder">
                            <i class="fas fa-folder-plus"></i>
                            <span v-if="sideView !== 'small'">Add folder</span>
                        </button>
                    </div>
                </template>

                <template slot="side">
                    <file-tree class="file-tree"
                               :files="treeItems"
                               :editable="editable"
                               @open-file="onFileOpen"
                               @move-item="onItemMove"
                               :active-file-id="activeFile ? activeFile.id : 0"
                    ></file-tree>
                </template>

                <template slot="side-foot">
                    <div :class="['side-panel', 'size-' + sideView]">
                        <!--<button class="btn">
                            <i class="fas fa-print"></i>
                            <span v-if="sideView !== 'min'">Print</span>
                        </button>-->
                    </div>
                </template>

                <editor :content="editorContent"
                        :file="activeFile"
                        :auto-save="autoSave"
                        :editable="editable"
                        @inactive="onEditorInactive"
                ></editor>

            </split-panel>

        </editor-drop-zone>
    </div>
</template>

<script>

    import Editor from '../components/Editor';
    import SplitPanel from '../components/SplitPanel';
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
                /** @var {?string} forceSideView */
                forceSideView: null,
                /** @var {?boolean} sideViewToggle */
                sideViewToggle: null
            }
        },
        computed: {
            mobile() {
                return window.innerWidth < 720;
            },
            hasFileTree() {
                //show file tree only if there are more files
                //in workspace or the only item is a folder
                if (!this.workspace || !this.workspace.hasItems()) {
                    return false;
                }
                let items = this.workspace.items;
                return !(items.length === 1 && items[0].file);
            },
            sideView() {
                if (this.forceSideView) {
                    return this.forceSideView;
                }
                if (!this.hasFileTree && !this.editable) {
                    return 'none';
                }
                let min = this.mobile ? 'min' : 'small';
                let max = this.mobile ? 'max' : 'normal';
                if (this.sideViewToggle !== null) {
                    return this.sideViewToggle ? max : min;
                }
                return this.hasFileTree ? max : min;
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
                if (!file.file) {
                    return Promise.resolve(false);
                }
                //todo loading icon / spinner
                this.autoSave = false;
                return this.workspace.loadFileContent(file).then(content => {
                    this.editorContent = content;
                    this.activeFile = file;
                    this.updateRoute();
                    if (this.mobile) {
                        this.sideViewToggle = false;
                    }
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
                return Workspace.create().then(ws => {
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
                        return this.refreshWorkspace().then(() => this.workspace.getItemById(file.id));
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
            /**
             *
             * @param {boolean} [replace]
             */
            updateRoute(replace) {
                let path = '';
                if (this.hasFileTree && this.activeFile.path) {
                    path = `/${this.activeFile.path.join('/')}`;
                }
                let route = {path: `/${this.workspace.hash}${path}`};
                if (replace) {
                    this.$router.replace(route);
                } else {
                    this.$router.push(route);
                }
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
                    .then(() => {
                        if (this.activeFile && this.activeFile.id === item.id) {
                            this.activeFile = this.workspace.getItemById(item.id);
                            this.updateRoute(true);
                        }
                    })
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
                let name = window.prompt('Enter folder/file name with extension:');
                if (!name) {
                    return;
                }
                this.getWorkspace()
                    .then(() => this.addItem(name, folder))
                    .then(f => this.openFile(f))
                    .catch(err => {
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
            onSidePanelSwitch() {
                if (this.sideViewToggle !== null) {
                    this.sideViewToggle = !this.sideViewToggle;
                    return;
                }
                let map = {
                    min: true,
                    small: true,
                    normal: false,
                    max: false
                };
                this.sideViewToggle = map[this.sideView];
            }
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
            SplitPanel
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    .far, .fas {
        width: 16px;
        margin-right: 6px;
    }

    .editor-wrapper {
        position: relative;
    }

    .side-panel {
        & button {
            margin-right: 5px;
            margin-left: 5px;
            display: block;
            width: calc(100% - 10px);
        }
        &.size-small button {
            & .far, & .fas {
                margin: 0;
            }
        }
    }
</style>
