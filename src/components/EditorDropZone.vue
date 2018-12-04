<template>
    <div @dragover.prevent=""
         @dragenter="dragOver">

        <slot><!-- slot content --></slot>

        <div class="drop-background" v-if="showDropInput"></div>

        <input class="drop-input"
               v-bind:class="{hidden: !showDropInput}"
               @drop="drop"
               @dragleave="dragLeave"
               type="file"
               multiple
               webkitdirectory
               mozdirectory>
    </div>
</template>

<script>
    export default {
        name: 'EditorDropZone',
        data() {
            return {
                showDropInput: false
            }
        },
        watch: {
            showDropInput(val) {
                this.$emit('visibility', val);
            }
        },
        methods: {
            dragOver() {
                this.showDropInput = true;
            },
            dragLeave() {
                this.showDropInput = false;
            },
            handleWebkitEntry(entry, parent) {
                let _this = this;
                if (entry.isDirectory) {
                    let children = [];
                    let reader = entry.createReader();
                    reader.readEntries(function (entries) {
                        entries.forEach(function (ent) {
                            _this.handleWebkitEntry(ent, children)
                        });
                    });
                    parent.push({
                        name: entry.name,
                        type: 'directory',
                        isFile: false,
                        isDir: true,
                        children: children
                    });
                } else if (entry.isFile) {
                    parent.push({
                        name: entry.name,
                        type: 'file',
                        isFile: true,
                        isDir: false,
                        entry: entry
                    })
                }
            },
            drop(e) {

                let files = [];

                for (let file of e.dataTransfer.items) {
                    let entry = file.webkitGetAsEntry();
                    this.handleWebkitEntry(entry, files);
                }

                console.log(files);

                this.showDropInput = false;

                this.$emit('drop', files);

                // if (e.dataTransfer.items) {
                //     e.dataTransfer.items.clear();
                // } else {
                //     e.dataTransfer.clearData();
                // }
            }
        }
    }
</script>

<style scoped lang="less">

    .drop-input {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 9999;
    }

    .drop-background {
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
    }

    .hidden {
        display: none;
    }

    .drop-zone {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

</style>