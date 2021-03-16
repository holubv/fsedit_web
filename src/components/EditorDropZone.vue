<template>
    <div @dragenter="() => this.showDropInput = true">

        <slot><!-- slot content --></slot>

        <div class="drop-background" v-if="showDropInput">
            <!--<div id="dropzone-previews" class="dropzone-previews"></div>-->
            <div class="drop-info">
                <div>
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <div>{{ $t('drop.dropHere') }}</div>
            </div>
        </div>

        <div>

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
                dropZoneOptions: {
                    url: 'https://api.fsedit.cf/files/upload',
                    method: 'post',
                    createImageThumbnails: false,
                    clickable: false,
                    //previewsContainer: '#dropzone-previews',
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
            // dropZoneTemplate: function () {
            //     return '';
            // },
            dropZoneTemplate: function () {
                return `<div class="dz-preview dz-file-preview">
                <div class="dz-image">
                    <div data-dz-thumbnail-bg></div>
                </div>

                <div class="dz-details">
                    <div class="name-wrapper">
                        <div class="dz-filename"><span data-dz-name></span></div>
                    </div>
                    <div class="status-wrapper">
                        <div class="dz-size"><span data-dz-size></span></div>
                        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                        <div class="icon-wrapper">
                            <div class="dz-success-mark"><i class="fas fa-check"></i></div>
                            <div class="dz-error-mark"><i class="fas fa-times"></i></div>
                        </div>
                    </div>
                </div>

                <div class="dz-error-message"><span data-dz-errormessage></span></div>
            </div>`
            },
        }
    }
</script>

<style lang="less">

    .dz-preview {

        padding-top: 12px;
        padding-bottom: 12px;

        & .dz-image {
            display: none;
        }

        & .dz-details > div,
        & .status-wrapper > div {
            display: inline-block;
            vertical-align: middle;
        }

        & .icon-wrapper {
            width: 16px;
            text-align: center;
        }

        & .dz-filename {
            margin-right: 22px;
        }

        & .status-wrapper {
            float: right;
        }

        & .dz-progress {
            display: inline-block;
            width: 60px;
            height: 22px;
            vertical-align: middle;
            border-radius: 3px;
            overflow: hidden;
            background-color: orange;
            margin-right: 12px;
            margin-left: 12px;

            & span {
                height: 100%;
                background-color: yellow;
                display: inline-block;
            }
        }

        & .dz-filename {
            display: inline-block;
            margin-right: 22px;
            vertical-align: middle;
        }

        @media(max-width: 512px) {
            & .dz-details {
                & .name-wrapper, & .status-wrapper {
                    width: 100%;
                    display: block;
                }

                & .status-wrapper {
                    text-align: right;
                }
            }
        }

        & .dz-error-mark, & .dz-success-mark {
            display: none;
        }

        &.dz-error .dz-error-mark {
            display: inline-block;
        }

        &.dz-success .dz-success-mark {
            display: inline-block;
        }
    }

</style>

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