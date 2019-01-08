<template>
    <div class="container">

        <div class="editor-wrapper">
            <ace v-model="editorContent"
                 v-show="editorType === 'text'"
                 :dark-theme="$fsedit.theme === 'dark'"
                 :filename="filename"
                 :editable="editable"
                 :class="{'read-only': !editable}"
                 @input="onEditorInput"></ace>

            <div v-if="editorType === 'image'" class="image-preview">
                <div class="img-background-pattern">
                    <img :src="fileUrl" :alt="file.name" draggable="false"
                         @dragstart="() => false">
                </div>
            </div>

            <audio v-if="editorType === 'audio'"
                   controls
                   :src="fileUrl"
                   :title="file.name"
            >
                <a :href="fileUrl" target="_blank"><i class="fas fa-download"></i> Download</a>
            </audio>

            <div v-if="editorType === 'unknown'" class="unknown-preview">
                <div>
                    This file type is not supported by <span class="logo">fsEdit|</span>
                    but you can download it
                </div>
                <a :href="fileUrl" target="_blank"><i class="fas fa-download"></i> Download</a>
            </div>

        </div>

        <div class="background-logo">fsEdit|</div>

        <welcome-screen ref="welcomeScreen" v-if="showWelcomeScreen"></welcome-screen>

        <footer :class="{highlight: editable}">
            <div>
                <span v-if="file">
                    <span v-if="editable">
                        <i v-if="lastEdit > lastSave" class="fas fa-pen" title="Unsaved"></i>
                        <i v-else class="fas fa-save" title="Saved"></i>
                    </span>
                    {{ filename }}
                </span>
                <span class="footer-right">
                    <i v-if="editable" class="fas fa-lock-open" title="Editable"></i>
                    <i v-else class="fas fa-lock" title="Read-only"></i>
                    {{ $route.params.workspace }}
                </span>
            </div>
        </footer>
    </div>
</template>

<script>
    import Ace from './Ace'
    import WelcomeScreen from './WelcomeScreen'
    import debounce from 'es6-promise-debounce'

    export default {
        name: 'Editor',
        props: {
            file: Object,
            content: String,
            autoSave: Boolean,
            editable: Boolean,
            lastSave: Number
        },
        data() {
            return {
                editorContent: '',
                editorType: 'text',
                filename: '',
                showWelcomeScreen: true,
                windowWidth: 0,
                lastEdit: 0
            }
        },
        components: {
            Ace,
            WelcomeScreen
        },
        watch: {
            windowWidth(width) {
                if (width < 600) {
                    this.showWelcomeScreen = false;
                }
            },
            file(f) {
                this.showWelcomeScreen = false;
                this.filename = f ? f.name : '';
                this.lastEdit = 0;
                this.editorType = 'text';
                let ext = this.filename.toLowerCase().split('.').pop();

                console.log(this.file);

                if (!this.file || !this.file.mime) {
                    return;
                }

                if (this.file.mime.startsWith('image/')) {
                    this.editorType = 'image';
                    return;
                }

                if (this.file.mime.startsWith('text/')) {
                    this.editorType = 'text';
                    return;
                }

                if (['mp3', 'ogg'].indexOf(ext) > -1) {
                    this.editorType = 'audio';
                    return;
                }

                if (this.file) {
                    this.editorType = 'unknown';
                }
            },
            content(c) {
                this.editorContent = c || '';
            }
        },
        created() {
            window.addEventListener('resize', this.handleWindowResize);
            this.handleWindowResize();
        },
        destroyed() {
            window.removeEventListener('resize', this.handleWindowResize)
        },
        methods: {
            onEditorInput() {
                this.showWelcomeScreen = false;
                if (this.autoSave) {
                    this.lastEdit = Date.now();
                    let file = this.file;
                    let content = this.editorContent;

                    this.debounced().then(() => {
                        this.$emit('inactive', {file, content});
                    });
                }
            },
            handleWindowResize() {
                this.windowWidth = window.innerWidth;
            },
            debounced: debounce(() => {
                return Promise.resolve(null);
            }, 2000)
        },
        computed: {
            fileUrl() {
                if (!this.file || !this.file.file) {
                    return '';
                }
                return 'https://api.fsedit.cf/file/' + this.file.file;
            }
        }
    }
</script>

<style>
    .read-only .ace_editor .ace_cursor {
        visibility: hidden !important;
    }
</style>

<style scoped lang="less">
    @import "../theme/global";

    .container {
        width: 100%;
        height: calc(100vh - @nav-height - @foot-height - 1px);
        position: relative;
        display: inline-block;
    }

    .editor-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .image-preview {
        overflow-y: auto;
        height: 100%;
        width: 100%;

        & img {
            .user-select(none);
            -webkit-user-drag: none;
            max-width: 100%;
            display: block;
        }
    }

    .img-background-pattern {
        display: inline-block;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAJklEQVQYV2NsaGj4z8DAwFBfXw+iGBgxBP7//w9W0djYCFGBLgAAlZkS+9GbY7EAAAAASUVORK5CYII=) repeat fixed;
        image-rendering: pixelated;
    }

    audio {
        padding-top: 32px;
        margin: auto;
        display: block;
    }

    .unknown-preview {
        padding-top: 32px;
        text-align: center;
        & a {
            .user-select(none);
            -webkit-user-drag: none;
            display: inline-block;
            font-size: 42px;
            padding-top: 32px;
        }
    }

    .background-logo {
        position: fixed;
        bottom: @nav-height + 8px;
        right: 32px;

        .logo-font(4vw);

        z-index: 99;
        cursor: default;
        user-select: none;
        pointer-events: none;

        .theme({ color: fade(@color, 10%); })
    }

    footer {
        width: 100%;
        height: @foot-height;
        line-height: @foot-height;
        text-align: left;
        font-size: 14px;
        overflow-y: hidden;
        white-space: nowrap;

        .theme({ color: darken(@color, 10%); background-color: @background-color; });

        & > div {
            padding-right: 8px;
            padding-left: 8px;
        }

        &.highlight {
            .theme({ color: @color-invert; background-color: @primary-color; });
        }

        & .footer-right {
            float: right;

            @media (max-width: 420px) {
                display: none;
            }
        }

        @media (max-width: 720px) {
            position: fixed;
            bottom: 0;
            right: 0;
            z-index: 10;
        }
    }
</style>