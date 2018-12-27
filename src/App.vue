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
        .theme({ color: @color; });
    }

    .input, .input-state input {
        .font();
        text-decoration: none;
        text-shadow: none;

        padding: 4px 14px;
        margin: 4px 0;

        border: 1px solid;
        border-radius: 4px;

        color: #000;

        .theme-dark({ border-color: darken(@background-color, 25%); });
        .theme-light({ border-color: darken(white, 25%); });

        box-shadow: none;

        outline: none;
        -webkit-appearance: none;

        &:focus {
            .theme({ box-shadow: 0 0 0 3px lighten(@primary-color, 20%); });
        }
    }

    .input-state {
        position: relative;

        & input {
            width: calc(100% - 44px);
            padding-right: 28px;
            display: block;
        }

        &::after {
            .icon-font(18px);
            position: absolute;
            right: 8px;
            top: 0;
            line-height: 32px;
        }

        &.success {
            @color: lighten(green, 20%);
            & input {
                //color: #018a00;
                &:focus {
                    box-shadow: 0 0 0 3px @color !important;
                }
            }
            &::after {
                color: @color;
                content: '\f00c';
            }
        }

        &.error {
            & input {
                //color: red;
                &:focus {
                    box-shadow: 0 0 0 3px lighten(red, 20%) !important;
                }
            }
            &::after {
                color: red;
                content: '\f00d';
            }
        }
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
