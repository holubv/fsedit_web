<template>
    <div>
        <!--<button class="btn" v-for="theme in themes" v-on:click="changeTheme(theme)">{{ $t('themes.' + theme) }}</button>-->
        <!--{{ $t('themes.' + theme) }}-->
        <a href="#" v-on:click.prevent="toggleTheme"><i class="fas fa-palette"></i> {{ $t('theme') }}</a>
    </div>
</template>

<script>
    export default {
        name: 'ThemeSelector',
        data() {
            return {
                themes: ['light', 'dark'],
                isLight: false
            }
        },
        methods: {
            changeTheme(t) {
                this.$fsedit.theme = t;
            },
            toggleTheme() {
                this.isLight = !this.isLight;
                this.changeTheme(this.isLight ? 'light' : 'dark')
            }
        },
        // computed: {
        //     theme() {
        //         return this.$fsedit.theme;
        //     }
        // }
    }
</script>

<style scoped lang="less">

</style>