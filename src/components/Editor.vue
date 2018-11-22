<template>
    <div class="container">
        <ace v-model="editorContent" :dark-theme="$fsedit.theme === 'dark'" lang="php"></ace>

        <div class="logo">fsEdit|</div>
        <footer>
            <span>test</span>
        </footer>
    </div>
</template>

<script>
    import Ace from './Ace'

    export default {
        name: 'Editor',
        data() {
            return {
                editorContent: ''
            }
        },
        components: {
            Ace
        },
        watch: {
            // '$fsedit.theme': function(t) {
            //     this.changeTheme(t === 'dark');
            // }
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    .container {
        width: 100%;
        height: calc(100vh - @nav-height - @foot-height - 1px);
    }

    .logo {
        position: fixed;
        bottom: @nav-height + 8px;
        right: 32px;

        .logo-font(4vw);

        z-index: 999;
        cursor: default;
        user-select: none;
        pointer-events: none;

        .theme({
            color: fade(@color, 10%);
        })
    }

    footer {
        width: 100%;
        height: @foot-height;
        line-height: @foot-height;
        text-align: right;
        font-size: 14px;
        .theme({
            color: darken(@color, 10%);
            background-color: @background-color;
        })
    }
</style>