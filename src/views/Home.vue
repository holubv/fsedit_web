<template>
    <div class="home editor-wrapper">
        <editor-drop-zone>

            <file-tree class="file-tree" :files="files" @file-open="loadFile"></file-tree>

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
                editorData: {
                    content: '',
                    name: ''
                }
            }
        },
        computed: {
            showFileTree() {
                //return this.fileTree && this.fileTree.length > 0
                return true;
            }
        },
        created() {
            if (this.$route.params.workspace) {
                this.loadWorkspace(this.$route.params.workspace);
            }
        },
        methods: {
            loadWorkspace(workspace) {
                //todo loading icon / spinner
                this.$api.get('/workspace/' + workspace + '/structure')
                    .then(rs => {
                        //console.log(rs.data.children);
                        this.files = rs.data;
                    })
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            },
            loadFile(file) {
                //todo loading icon / spinner
                //todo file cache
                console.log(file.name);
                this.$api.get('/file/' + file.file)
                    .then(rs => {
                        //console.log(rs.data.children);
                        this.editorData = {
                            content: rs.data,
                            name: file.name
                        };
                    })
                    .catch(err => {
                        console.error(err);
                        //todo show error dialog
                    });
            }
        },
        watch: {
            '$route': () => {
                let workspace = this.$route.params.workspace;
                if (!workspace) {
                    return;
                }
                this.loadWorkspace(workspace);
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
