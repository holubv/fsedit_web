<template>
    <div @dragenter="() => this.showDropInput = true">

        <slot><!-- slot content --></slot>

        <div class="drop-background" v-if="showDropInput"></div>

        <vue2-drop-zone class="drop-zone"
                        v-show="showDropInput"
                        id="drop-zone"
                        :options="dropZoneOptions"
                        :includeStyling="false"
                        ref="dropZone"
                        @vdropzone-file-added="onFileAdded"
                        @vdropzone-sending="onFileSending"
                        @vdropzone-queue-complete="onFileSendComplete"
                        @vdropzone-drag-end="onDragEnd"
                        @vdropzone-drag-leave="onDragEnd"
        ></vue2-drop-zone>

    </div>
</template>

<script>

    import Vue2DropZone from 'vue2-dropzone';
    //import 'vue2-dropzone/dist/vue2Dropzone.min.css'

    export default {
        name: 'EditorDropZone',
        props: {
            workspaceHash: String,
            editToken: String
        },
        data() {
            return {
                showDropInput: false,
                dropZoneOptions: {
                    url: 'https://api.fsedit.cf/files/upload',
                    method: 'post',
                    createImageThumbnails: false,
                    clickable: false,
                    previewTemplate: this.dropZoneTemplate(),
                    headers: {
                        Accept: 'application/json',
                        'X-Api-Token': this.$fsedit.token
                    },
                    autoProcessQueue: false,
                    maxFiles: 50,
                    //thumbnailWidth: 150,
                    maxFilesize: 1, //todo higher size limit
                    //headers: { "My-Awesome-Header": "header value" }
                },
                wsRequested: false
            }
        },
        watch: {
            showDropInput(val) {
                this.$emit('visibility', val);
            },
            workspaceHash(val) {
                this.wsRequested = false;
                if (val) {
                    this.$nextTick(() => {
                        this.$refs.dropZone.processQueue();
                    });
                }
            }
        },
        components: {
            Vue2DropZone
        },
        methods: {
            onFileAdded(file) {
                if (this.workspaceHash) {
                    this.$nextTick(() => {
                        this.$refs.dropZone.processQueue();
                    });
                    return;
                }
                if (this.wsRequested) {
                    return;
                }
                this.wsRequested = true;
                this.$emit('undefined-workspace-hash');
            },
            onFileSending(file, xhr, form) {
                console.log(file);
                let name = file.name;
                if (file.fullPath) {
                    name = file.fullPath;
                }
                form.append('name', name);
                form.append('workspace', this.workspaceHash);
                if (this.editToken) {
                    form.append('edit', this.editToken);
                }
            },
            onFileSendComplete() {
                this.showDropInput = false;
                this.$emit('file-upload-done');
            },
            onDragEnd() {
                if (!this.$refs.dropZone.getQueuedFiles().length) {
                    this.showDropInput = false;
                }
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