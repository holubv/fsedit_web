<template>
    <div class="container">
        <div class="logo"><router-link :to="{ name: 'index'}">fsEdit|</router-link></div>
        <nav class="menu-toggle">
            <a href="#" @click.prevent="expandMenu = !expandMenu"><i class="fas fa-bars"></i> Menu</a>
        </nav>
        <nav class="menu dynamic" :class="{'expand': expandMenu}">
            <ul>
                <li>
                    <theme-selector></theme-selector>
                </li>
                <li>
                    <locale-selector></locale-selector>
                </li>
                <!--<li><a href="#">{{ $t('settings') }}</a></li>-->
                <li v-if="!$fsedit.logged">
                    <router-link :to="{ name: 'login', query: {ws: $route.params.workspace}}">{{ $t('login') }}</router-link>
                </li>
                <li v-else>
                    <router-link :to="{ name: 'profile'}">
                        <i class="fas fa-user"></i> {{ username }}
                    </router-link>
                </li>
                <li v-if="$fsedit.logged">
                    <a href="#" @click.prevent="$fsedit.token = null; $fsedit.user = {}">
                        <i class="fas fa-sign-out-alt"></i> {{ $t('logout') }}
                    </a>
                </li>
            </ul>
        </nav>

        <div v-if="expandMenu" class="menu-hider" @click="expandMenu = false"></div>
    </div>
</template>

<script>
    import LocaleSelector from '@/components/LocaleSelector'
    import ThemeSelector from '@/components/ThemeSelector'

    export default {
        name: 'NavBar',
        components: {
            LocaleSelector,
            ThemeSelector
        },
        data() {
            return {
                expandMenu: false
            }
        },
        computed: {
            username() {
                let email = this.$fsedit.user.email;
                if (!email) {
                    return '';
                }
                return email.substring(0, email.indexOf('@'));
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    @menu-breakpoint: 600px;

    i.fas {
        width: @nav-icon-width;
    }

    .container {
        .theme({ background-color: @background-color; color: @color; border-bottom-color: darken(@background-color, 20%); });
        height: @nav-height;
        border-bottom: 1px solid;
        padding-right: 32px;
        padding-left: 32px;

        & * {
            display: inline-block;
            line-height: @nav-height;
        }


    }

    .menu-toggle {
        float: right;
        display: none;

        @media (max-width: @menu-breakpoint) {
            display: block;
        }
    }

    .menu {
        float: right;

        & li {
            margin-left: 16px;
        }

        @media (max-width: @menu-breakpoint) {

            &.dynamic {
                display: none;
                position: absolute;
                z-index: 6;

                top: @nav-height;
                right: 0;

                padding-right: 32px;

                border: 1px solid;
                .theme({ background-color: @background-color; color: @color; border-color: darken(@background-color, 20%); });

                &.expand {
                    display: block;
                }

                & li {
                    display: block;
                    margin-left: 32px;
                }
            }

        }
    }

    .menu-hider {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 5;
    }

    ul {
        margin: 0;
        padding: 0;
    }
</style>