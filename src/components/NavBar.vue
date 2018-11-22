<template>
    <nav>
        <div class="logo">fsEdit|</div>
        <ul class="menu">
            <li><theme-selector></theme-selector></li>
            <li><a href="#">{{ $t('settings') }}</a></li>
            <li><a href="#">{{ $t('login') }}</a></li>
        </ul>
        <!--<locale-selector></locale-selector>-->
    </nav>
</template>

<script>
    import LocaleSelector from '@/components/LocaleSelector'
    import ThemeSelector from '@/components/ThemeSelector'

    export default {
        name: 'NavBar',
        components: {
            LocaleSelector,
            ThemeSelector
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    nav {
        .theme({ background-color: @background-color; color: @color; border-bottom-color: darken(@background-color, 20%);});
        height: @nav-height;
        border-bottom: 1px solid;
        padding-right: 32px;
        padding-left: 32px;

        & * {
            display: inline-block;
            line-height: @nav-height;
        }
    }

    .logo {
        display: inline-block;
        .logo-font();
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