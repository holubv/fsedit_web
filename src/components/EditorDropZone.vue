<template>
    <div @dragenter="dragOver">

        <slot><!-- slot content --></slot>

        <div class="drop-background" v-if="showDropInput"></div>

        <!--<input class="drop-input"
               v-bind:class="{hidden: !showDropInput}"
               @drop="drop"
               @dragleave="dragLeave"
               type="file"
               multiple
               webkitdirectory
               mozdirectory>-->

        <vue2-drop-zone class="drop-zone"
                        v-show="showDropInput"
                        id="drop-zone"
                        :options="dropZoneOptions"
                        :includeStyling="false"
                        @vdropzone-file-added="onFileAdded"
                        @vdropzone-sending="onFileSending"
        ></vue2-drop-zone>

    </div>
</template>

<script>

    import Vue2DropZone from 'vue2-dropzone';
    //import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    export default {
        name: 'EditorDropZone',
        data() {
            return {
                showDropInput: false,
                dropZoneOptions: {
                    url: 'https://api.fsedit.cf/upload',
                    method: 'post',
                    createImageThumbnails: false,
                    clickable: false,
                    previewTemplate: this.dropZoneTemplate(),
                    //todo maxFiles: 200
                    //thumbnailWidth: 150,
                    //maxFilesize: 0.5,
                    //headers: { "My-Awesome-Header": "header value" }
                }
            }
        },
        watch: {
            showDropInput(val) {
                this.$emit('visibility', val);
            }
        },
        components: {
            Vue2DropZone
        },
        methods: {
            dragOver() {
                this.showDropInput = true;
            },
            dragLeave() {
                this.showDropInput = false;
            },
            drop(e) {
                //
                // console.log(files);
                //
                // this.showDropInput = false;
                //
                // this.$emit('drop', files);
            },
            onFileAdded(file) {
                //console.log(file);
            },
            onFileSending(file, xhr, form) {
                console.log(file);
                let name = file.name;
                if (file.fullPath) {
                    name = file.fullPath;
                }
                form.append('name', name);
            },
            dropZoneTemplate: function () {
                return `<div class="dz-preview dz-file-preview">
                <div class="dz-image">
                    <div data-dz-thumbnail-bg></div>
                </div>
                <div class="dz-details">
                    <div class="dz-size"><span data-dz-size></span></div>
                    <div class="dz-filename"><span data-dz-name></span></div>
                </div>
                <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                <div class="dz-error-message"><span data-dz-errormessage></span></div>
                <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                <div class="dz-error-mark"><i class="fa fa-close"></i></div>
            </div>`
            },
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
        z-index: 9999;
    }

</style>