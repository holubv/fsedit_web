<template>
    <div class="container">

        <ace v-model="editorContent"
             :dark-theme="$fsedit.theme === 'dark'"
             :filename="filename"
             :editable="editable"
             :class="{'read-only': !editable}"
             @input="onEditorInput"></ace>

        <div class="logo">fsEdit|</div>

        <welcome-screen ref="welcomeScreen" v-if="showWelcomeScreen"></welcome-screen>

        <footer>
            <span style="float: left;">{{ filename }}</span> <!-- todo add proper css class -->
            <span>{{ $route.params.workspace }}</span>
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
        },
        data() {
            return {
                editorContent: '',
                filename: '',
                showWelcomeScreen: true,
                windowWidth: 0
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
                this.filename = f ? f.name : '';
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
        }
    }
</script>

<style>
    .ace_editor.read-only .ace_cursor {
        visibility: hidden!important;
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

    .logo {
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
        text-align: right;
        font-size: 14px;
        .theme({ color: darken(@color, 10%); background-color: @background-color; })
    }
</style>