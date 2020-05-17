<template>
    <div class="container">
        <div class="logo"><router-link :to="{ name: 'index'}">fsEdit|</router-link></div>
        <nav class="menu">
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
                    <a href="#" @click.prevent="$fsedit.token = null; $fsedit.user = {}">Logout</a> <!-- todo way to logout -->
                </li>
            </ul>
        </nav>
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

        overflow-y: hidden; /* todo fix nav on mobile devices */
    }

    .menu {
        float: right;

        & li {
            margin-left: 16px;
        }
    }

    ul {
        margin: 0;
    }
</style>