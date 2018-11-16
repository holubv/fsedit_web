<template>
    <nav>
        <ul>
            <li>{{ $t('login') }}</li>
        </ul>
        <locale-selector></locale-selector>
        <theme-selector></theme-selector>
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
        .theme({ background-color: @background-color; color: @color; });
        //.theme();
        height: 32px;
        //color: @color;

        & * {
            display: inline-block;
        }
    }

    ul {
        margin: 0;
    }
</style>