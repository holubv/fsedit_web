<template>
    <div class="home editor-wrapper">
        <editor-drop-zone @file-upload-done="refreshWorkspace">

            <file-tree v-show="showFileTree" class="file-tree" :files="files" @file-open="openFile"></file-tree>

            <editor v-bind:class="{'file-tree-visible': showFileTree}" :data="editorData"></editor>
        </editor-drop-zone>
    </div>
</template>

<script>

    import Editor from '../components/Editor';
    import FileTree from '../components/FileTree';
    import EditorDropZone from '../components/EditorDropZone';


    export default {
        name: 'home',
        data() {
            return {
                files: [],
                workspace: '',
                editorData: {
                    content: '',
                    name: ''
                }
            }
        },
        computed: {
            showFileTree() {
                return this.files && this.files.length > 1;
            }
        },
        beforeRouteEnter(to, from, next) {
            next(_this => {
                _this.processRoute.apply(_this);
            });
        },
        methods: {
            refreshWorkspace() {
                this.loadWorkspace(this.workspace, true);
            },
            loadWorkspace(workspace, force) {
                if (this.workspace === workspace && !force) {
                    return Promise.resolve(false);
                }
                this.workspace = workspace;
                //todo loading icon / spinner
                return this.$api.get('/workspace/' + workspace + '/structure')
                    .then(rs => {
                        //console.log(rs.data.children);
                        this.files = rs.data;
                        if (this.files.length === 1) {
                            this.openFile(this.files[0]);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            },
            openFile(file) {
                //todo loading icon / spinner
                //todo file cache
                console.log(file.name);
                this.$api.get('/file/' + file.file)
                    .then(rs => {

                        this.editorData = {
                            content: rs.data,
                            name: file.name
                        };

                        let path = '';
                        if (this.showFileTree) {
                            path = `/${file.path.join('/')}`;
                        }
                        this.$router.push({ path: `/${this.workspace}${path}` })
                    })
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            },
            processRoute() {
                if (this.$route.params.workspace) {
                    let promise = this.loadWorkspace(this.$route.params.workspace);
                    let filename = this.$route.params.filename;
                    if (filename) {
                        let _this = this;
                        promise.then(() => {
                            let file = _this.findFileInWorkspace(filename);
                            if (file) {
                                _this.openFile(file);
                            }
                        });
                    }
                }
            },
            findFileInWorkspace(path) {
                let parts = path.split('/');
                let filename = parts.pop();
                let arr = this.files;

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
        },
        watch: {
            // '$route': () => {
            //     //this.processRoute();
            // }
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
