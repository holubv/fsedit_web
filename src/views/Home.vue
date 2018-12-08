<template>
    <div class="home editor-wrapper">
        <editor-drop-zone>

            <file-tree class="file-tree"></file-tree>

            <editor v-bind:class="{'file-tree-visible': showFileTree}"></editor>
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

            }
        },
        computed: {
            showFileTree() {
                //return this.fileTree && this.fileTree.length > 0
                return true;
            }
        },
        methods: {
            test() {
                window.console.log(this.$i18n)
            },
            onFileDrop(files) {

            },


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
