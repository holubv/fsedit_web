<template>
    <div class="home editor-wrapper">
        <file-tree v-if="showFileTree" :files="fileTree"></file-tree>

        <editor v-bind:class="{'file-tree-visible': showFileTree}"
                @fileDrop="onFileDrop"></editor>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Editor from '@/components/Editor'
    import FileTree from '@/components/FileTree'

    export default {
        name: 'home',
        data() {
            return {
                fileTree: []
            }
        },
        computed: {
            showFileTree() {
                return this.fileTree && this.fileTree.length > 0
            }
        },
        methods: {
            test() {
                window.console.log(this.$i18n)
            },
            onFileDrop(files) {
                this.fileTree = files;
            }
        },
        components: {
            Editor,
            FileTree
        }
    }
</script>

<style scoped lang="less">
    .file-tree-visible {
        width: 80%;
    }
</style>
