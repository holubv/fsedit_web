<template>
    <div class="wrapper">
        <!--<ul class="root">-->

            <!--<file-tree-item :items="files"></file-tree-item>-->
            <!--&lt;!&ndash;<li v-for="entry in files">&ndash;&gt;-->

            <!--&lt;!&ndash;</li>&ndash;&gt;-->

            <!--&lt;!&ndash;<li class="file" v-for="n in 10"><a href="#">File</a></li>&ndash;&gt;-->
            <!--&lt;!&ndash;<li class="file active"><a href="#">File</a></li>&ndash;&gt;-->
            <!--&lt;!&ndash;<li>&ndash;&gt;-->
                <!--&lt;!&ndash;<a href="#">Folder</a>&ndash;&gt;-->
                <!--&lt;!&ndash;<ul>&ndash;&gt;-->
                    <!--&lt;!&ndash;<li class="file" v-for="n in 10"><a href="#">File</a></li>&ndash;&gt;-->
                <!--&lt;!&ndash;</ul>&ndash;&gt;-->
            <!--&lt;!&ndash;</li>&ndash;&gt;-->
        <!--</ul>-->

        <!--<file-tree-item class="root" :items="files"></file-tree-item>-->

        <ul class="root">
            <file-tree-item
                    class="item"
                    v-for="(entry, index) in entries"
                    :key="index"
                    :entry="entry">
            </file-tree-item>
        </ul>

    </div>
</template>

<script>

    import FileTreeItem from './FileTreeItem'

    export default {
        name: 'FileTree',
        props: {
            files: Array
        },
        data() {
            return {
                entries: []
            }
        },
        watch: {
            files(arr) {
                arr = arr.sort(this.compareFiles);
                this.entries = arr;
            }
        },
        methods: {
            compareFiles(a, b) {
                if (a.isDir && b.isDir || a.isFile && b.isFile) {
                    return a.name.localeCompare(b.name);
                }
                if (a.isDir && b.isFile) {
                    return -1;
                }
                return 1;
            }
        },
        components: {
            FileTreeItem
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    .wrapper {
        width: calc(20% - 1px);
        display: inline-block;
        height: calc(100vh - @nav-height - 1px);
        vertical-align: top;
        overflow: auto;
        border-right: 1px solid;
        .theme({
            background-color: @background-color;
            border-color: darken(@background-color, 20%);
        });
    }

    ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
    }

    ul.root > li {
        padding-left: 8px;
    }


</style>