<template>
    <div id="app">
        <nav-bar></nav-bar>
        <div class="page-container">

            <router-view></router-view>

        </div>
    </div>
</template>

<script>
    import NavBar from '@/components/NavBar.vue'

    export default {
        components: {
            NavBar
        }
    }
</script>

<style lang="less">
    @import "theme/global";

    body {
        .font();
        margin: 0;
        overflow: hidden;

        &.theme-dark {
            background-color: @dark-background-color;
        }
        &.theme-light {
            background-color: @light-background-color;
        }
    }

    #app {
        .theme({
            color: @color;
        });
    }

    .btn {
        .font();
        text-decoration: none;
        text-shadow: none;
        cursor: pointer;

        padding: 4px 14px;
        margin: 4px 0;

        border: 1px solid;
        border-radius: 4px;

        .theme-dark({
            color: @color;
            background-color: darken(@color, 50%);
            border-color: darken(@background-color, 25%);
        });
        .theme-light({
            color: @color;
            background-color: white;
            border-color: darken(white, 25%);
        });

        box-shadow: none;

        outline: none;
        -webkit-appearance: none;

        text-align: center;
        vertical-align: middle;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        white-space: nowrap;

        .user-select(none);

        &.primary {
            .theme({
                color: @color-invert;
                background-color: @primary-color;
                border-color: darken(@primary-color, 10%);
            });
        }

        &:focus {
            .theme({
                box-shadow: 0 0 0 3px lighten(@primary-color, 20%);
            });
        }
    }

    a {
        .theme({
            color: @primary-color;
        })
    }

</style>
