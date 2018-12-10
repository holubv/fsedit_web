<template>
    <div class="container">

        <ace v-model="editorContent"
             :dark-theme="$fsedit.theme === 'dark'"
             :filename="filename"
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

    export default {
        name: 'Editor',
        props: {
            data: Object
        },
        data() {
            return {
                editorContent: '',
                filename: '',
                dropZoneOptions: {
                    url: this.$fsedit.apiUrl,
                    clickable: false
                },
                dropInputHidden: true,
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
            data(data) {
                this.editorContent = data.content;
                this.filename = data.name;
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
            },
            handleWindowResize() {
                this.windowWidth = window.innerWidth;
            }
        }
    }
</script>

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