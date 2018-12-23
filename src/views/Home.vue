<template>
    <div class="home editor-wrapper">
        <editor-drop-zone @file-upload-done="refreshWorkspace"
                          @undefined-workspace-hash="createWorkspace"
                          :workspaceHash="wsHash">

            <file-tree v-show="showFileTree"
                       class="file-tree"
                       :files="treeItems"
                       @file-open="openFile"
                       @add-folder="addNode(true)"
                       @add-file="addNode(false)"
                       :active-file-id="activeFile ? activeFile.id : 0"
            ></file-tree>

            <editor v-bind:class="{'file-tree-visible': showFileTree}" :data="editorData"></editor>
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
                //files: [],
                //wsHash: '',
                workspace: null,
                editorData: {
                    content: '',
                    name: ''
                },
                activeFile: null
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
            }
        },
        beforeRouteEnter(to, from, next) {
            next(_this => {
                _this.processRoute.apply(_this);
            });
        },
        methods: {
            clearWorkspace() {
                this.workspace = null;
                this.editorData = {
                    content: '',
                    name: ''
                };
                this.activeFile = null;
            },
            refreshWorkspace() {
                return this.loadWorkspace(this.workspace.hash, true);
            },
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
                }).catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            openFile(file) {
                //todo loading icon / spinner
                //todo file cache
                console.log(file.name);
                this.$api({
                    url: '/file/' + file.file,
                    transformResponse: [data => data]
                })
                    .then(rs => {

                        this.editorData = {
                            content: rs.data,
                            name: file.name
                        };
                        this.activeFile = file;

                        let path = '';
                        if (this.showFileTree) {
                            path = `/${file.path.join('/')}`;
                        }
                        this.$router.push({path: `/${this.workspace.hash}${path}`})
                    })
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            },
            createWorkspace() {
                return new Workspace().create().then(ws => {
                    this.workspace = ws;
                    this.$router.push({path: `/${this.workspace.hash}`});
                }).catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            addNode(isFolder) {
                let name = window.prompt('Folder/file name') || 'unnamed';
                return this.workspace.addItem(name, isFolder, this.activeFile).then(rs => {
                    this.refreshWorkspace();
                }).catch(err => {
                    console.error(err);
                    //todo show error dialog
                });
            },
            processRoute() {
                if (this.$route.params.workspace) {
                    let promise = this.loadWorkspace(this.$route.params.workspace);
                    let filename = this.$route.params.filename;
                    if (filename) {
                        promise.then(() => {
                            let file = this.workspace.findFile(filename);
                            if (file) {
                                this.openFile(file);
                            }
                        });
                    }
                }
            },
        },
        watch: {
            '$route': function (route) {
                console.log(route);
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
