<template>
    <div>

        <div v-if="editable" class="add-panel">
            <button class="btn btn-add-folder" @click.prevent="addFolder">
                <i class="fas fa-folder-plus"></i>Add folder
            </button>
            <button class="btn btn-add-file" @click.prevent="addFile">
                <i class="fas fa-file-medical"></i>Add file
            </button>
        </div>

        <draggable-tree :data="data"
                        draggable="true"
                        droppable="true"
                        @change="onTreeChange"
                        :ondragstart="onDragStart">

            <div slot-scope="{data, store, vm}">
                <template v-if="!data.isDragPlaceHolder">
                    <div class="tree-entry"
                         v-bind:class="{active: activeFileId === data.id}"
                         tabindex="-1"
                         @keyup.delete.prevent="requestDelete(data)">

                        <div v-if="data.file" @click="requestFileOpen(data)">
                            <!-- File -->
                            <i class="far fa-file"></i>
                            <span class="tree-item file-name">{{ data.name }}</span>
                        </div>
                        <div v-else @click="store.toggleOpen(data)">
                            <!-- Folder -->

                            <i v-if="data.open" class="far fa-folder-open"></i>
                            <i v-else class="far fa-folder"></i>

                            <span class="tree-item folder-name">{{ data.name }}</span>
                        </div>
                    </div>
                </template>
            </div>
        </draggable-tree>

    </div>
</template>

<script>

    import {DraggableTree} from 'vue-draggable-nested-tree';

    export default {
        name: 'FileTree',
        props: {
            files: Array,
            activeFileId: 0,
            editable: true
        },
        data() {
            return {
                data: []
            }
        },
        watch: {
            files(arr) {
                this.data = arr;
            }
        },
        methods: {
            requestDelete(data) {
                if (this.editable) {
                    this.$emit('delete-file', data);
                }
            },
            requestFileOpen(data) {
                if (data.id === this.activeFileId) {
                    return;
                }
                this.$emit('open-file', data);
            },
            addFolder() {
                if (this.editable) {
                    this.$emit('add-folder');
                }
            },
            addFile() {
                if (this.editable) {
                    this.$emit('add-file');
                }
            },
            onTreeChange(node) {
                let parent = null;
                if (node.parent.id && node.parent.name) {
                    parent = node.parent;
                }
                this.$emit('move-item', {
                    item: node,
                    parent
                });
            },
            onDragStart() {
                return this.editable; //prevent drag when not editable
            },
        },
        components: {
            DraggableTree
        }
    }
</script>

<style lang="less">
    .he-tree {
        padding-bottom: 120px;
        display: inline-block;
        width: 100%;
    }

    .tree-node {
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

    .folder-switch {
        width: 16px;
        text-align: center;
        display: inline-block;
    }

    .far, .fas {
        width: 16px;
        margin-right: 6px;
    }

    .active {
        //background-color: red;
        .theme({ background-color: @primary-color; color: @color-invert; });
        font-weight: bold;
    }

    .add-panel button {
        margin-right: 5px;
        margin-left: 5px;
        display: inline-block;
    }

    .tree-entry {
        padding: 4px 0 4px 4px;
        cursor: pointer;
        white-space: nowrap;
    }

</style>