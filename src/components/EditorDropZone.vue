<template>
    <div @dragenter="() => this.showDropInput = true">

        <slot><!-- slot content --></slot>

        <div id="drop-empty"></div>

        <div class="drop-background" v-if="showDropInput">
            <div class="drop-info">
                <div>
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div>{{ $t('drop.dropHere') }}</div>
            </div>
        </div>

        <div class="progress-panel">
            {{ filesInQueue }}
        </div>

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
                filesInQueue: 0,
                dropZoneOptions: {
                    url: 'https://api.fsedit.cf/files/upload',
                    method: 'post',
                    createImageThumbnails: false,
                    clickable: false,
                    previewsContainer: '#drop-empty',
                    previewTemplate: this.dropZoneTemplate(),
                    headers: {
                        Accept: 'application/json',
                        'X-Api-Token': this.$fsedit.token
                    },
                    autoProcessQueue: false,
                    maxFiles: 100,
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
                this.filesInQueue++;
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
                this.filesInQueue = 0;
                this.showDropInput = false;
                this.$emit('file-upload-done');
            },
            onDragEnd() {
                // if (!this.$refs.dropZone.getQueuedFiles().length) {
                //     this.showDropInput = false;
                // }
                this.showDropInput = false;
            },
            dropZoneTemplate: function () {
                return '<div></div>';
            },
        }
    }
</script>

<style scoped lang="less">

    @import "../theme/global";

    .progress-panel {
        position: absolute;
        top: 0;
        right: 0;
        width: 120px;
        height: 120px;
        background-color: red;
        z-index: 2;
    }

    #drop-empty {
        display: none;
    }

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

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .drop-info {

        & i {
            font-size: 72px;
            margin-bottom: 18px;
        }

        font-size: 32px;
        text-align: center;
    }

    .dropzone-previews {
        width: 80%;
        max-width: 512px;
        background-color: black;
        height: 200px;

        padding: 12px 24px;
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