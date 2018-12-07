<template>
    <div @dragover.prevent=""
         @dragenter="dragOver">

        <slot><!-- slot content --></slot>

        <div class="drop-background" v-if="showDropInput"></div>

        <!--<form ref="dropForm"
              method="post"
              action="https://api.fsedit.cf/upload"

        >-->
            <input class="drop-input"
                   ref="dropInput"
                   v-bind:class="{hidden: !showDropInput}"
                   @drop="drop"
                   @dragleave="dragLeave"
                   type="file"
                   multiple

                 >
        <!--</form>-->
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
            handleWebkitEntry(entry, parent, formData) {
                let _this = this;
                if (entry.isDirectory) {
                    let children = [];
                    let reader = entry.createReader();
                    reader.readEntries(function (entries) {
                        entries.forEach(function (ent) {
                            _this.handleWebkitEntry(ent, children, formData)
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
                    });
                    // entry.file(file => {
                    //     formData.append(Math.random().toString(36).substring(2), file);
                    // });
                    formData.append('file[]', entry, entry.name);
                    // entry.file(function(file) {
                    //     let xhr = new XMLHttpRequest();
                    //     xhr.open('post', 'https://api.fsedit.cf/upload', true);
                    //     xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    //     xhr.setRequestHeader('X-File-Name', file.name);
                    //     xhr.setRequestHeader('X-File-Size', file.size);
                    //     xhr.setRequestHeader('X-File-Type', file.type);
                    //     xhr.send(file);
                    // });
                }
            },
            drop(e) {

                let data = new FormData();

                let files = [];

                for (let file of e.dataTransfer.items) {
                    let entry = file.webkitGetAsEntry();
                    this.handleWebkitEntry(entry, files, data);
                    // data.append('file[]', file.getAsFile(), file.name);
                }

                console.log(e.dataTransfer.files);

                console.log(files);

                //console.log(this.$refs.dropInput.files[0]);
                this.showDropInput = false;
                this.$emit('drop', files);

                //this.$refs.dropForm.submit();


                console.log(data);

                // for (let file of e.dataTransfer.files) {
                //     console.log(file);
                //     data.append(Math.random().toString(36).substring(2), file);
                // }


                let req = new XMLHttpRequest();
                req.open('POST', 'https://api.fsedit.cf/upload');
                req.send(data);


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