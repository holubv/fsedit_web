<template>
    <div>

        <draggable-tree :data="data" draggable="true" droppable="true" @change="onTreeChange">
            <div slot-scope="{data, store, vm}">
                <template v-if="!data.isDragPlaceHolder">
                    <b v-if="data.children && data.children.length"
                       @click="store.toggleOpen(data)">{{data.open ? '-' : '+'}}</b>
                    <span class="tree-item">{{data.text}}</span>
                </template>
            </div>
        </draggable-tree>

        <button @click.prevent="addFolder">Add Folder</button>
        <button @click.prevent="addFile">Add File</button>

    </div>
</template>

<script>

    import {DraggableTree} from 'vue-draggable-nested-tree';

    export default {
        name: 'FileTree',
        props: {
            files: Array
        },
        data() {
            return {
                data: [
                    {
                        text: 'folder 1', children: [
                            {text: 'file 4', droppable: false},
                            {text: 'file 5', droppable: false},
                        ]
                    },
                ]
            }
        },
        watch: {
            files(arr) {
                this.data = arr;
            }
        },
        methods: {
            // compareFiles(a, b) {
            //     if (a.isDir && b.isDir || a.isFile && b.isFile) {
            //         return a.name.localeCompare(b.name);
            //     }
            //     if (a.isDir && b.isFile) {
            //         return -1;
            //     }
            //     return 1;
            // }
            addFolder() {
                this.data.push({
                    text: 'new folder'
                });
            },
            addFile() {
                this.data.push({
                    text: 'new file',
                    droppable: false
                });
            },
            onTreeChange(node, targetTree) {
                console.log(node);
                console.log(node.parent);
            },
        },
        components: {
            DraggableTree
        }
    }
</script>

<style lang="less">
    .he-tree {
        border: 1px solid #ccc;
        padding-bottom: 120px;
    }

    .tree-node {
    }

    .tree-node-inner {
        padding: 5px;
        border: 1px solid #ccc;
        cursor: pointer;
    }

    .tree-node-inner-back {
        margin: 0 !important;
    }

    .draggable-placeholder {
    }

    .draggable-placeholder-inner {
        border: 1px dashed #0088F8;
        box-sizing: border-box;
        background: rgba(0, 136, 249, 0.09);
        color: #0088f9;
        text-align: center;
        padding: 0;
        display: flex;
        align-items: center;
    }
</style>

<style scoped lang="less">
    @import "../theme/global";

    ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
    }

    ul.root > li {
        padding-left: 8px;
    }


</style>