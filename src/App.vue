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
        },
        watch: {
            '$fsedit.theme': function(theme) {
                window.document.body.className = 'theme-' + theme;
                window.localStorage.setItem('theme', theme);

                let el = window.document.getElementById('meta-theme');
                let color = el.getAttribute('data-theme-' + theme);
                el.setAttribute('content', color);
            },
            '$fsedit.token': function(token) {
                if (token) {
                    window.localStorage.setItem('token', token);
                    this.$api.defaults.headers['X-Api-Token'] = token;
                } else {
                    window.localStorage.removeItem('token');
                    delete this.$api.defaults.headers['X-Api-Token'];
                }
            },
            '$fsedit.user': function(user) {
                window.localStorage.setItem('user', JSON.stringify(user));
            }
        },
        created() {
            let theme = window.localStorage.getItem('theme');
            this.$fsedit.theme = theme ? theme : 'dark';

            let token = window.localStorage.getItem('token');
            if (token) {
                this.$fsedit.token = token;
                this.$fsedit.user = JSON.parse(window.localStorage.getItem('user'));
            }
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
            width: 18px;
            text-align: center;
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

        &.warn {
            & input {
                &:focus {
                    box-shadow: 0 0 0 3px lighten(orange, 20%) !important;
                }
            }
            &::after {
                color: orange;
                content: '\f12a';
            }
        }
    }

    .box {
        margin: 0 16px;
        padding: 16px;

        border: 1px solid;
        border-radius: 4px;
        font-weight: bold;

        .theme({
            border-color: @color;
            background-color: @background-color;
        });

        &.error {
            border-color: lighten(red, 20%)!important;
            box-shadow: 0 0 0 3px lighten(red, 20%);
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
        -webkit-user-drag: none;

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

        &[disabled], &.disabled {
            cursor: not-allowed;
            .theme({
                color: @color;
                background-color: @background-color;
                border-color: @background-color;
            });

            &:focus {
                box-shadow: none!important;
            }
        }
    }

    .logo {
        display: inline-block;
        .logo-font();

        & * {
            .theme-color();
            text-decoration: none;
        }

        &::after {
            content: "BETA";

            font-size: 12px;
            font-family: monospace;

            margin-left: 2px;
            padding-left: 4px;
            padding-right: 4px;

            border-radius: 4px;
            vertical-align: top;

            .theme({
                color: @color-invert;
                background-color: @primary-color;
            });
        }

        &.no-after::after {
            content: none;
        }
    }

    a {
        text-decoration: none;
        .theme({
            color: @primary-color;
        })
    }

</style>
