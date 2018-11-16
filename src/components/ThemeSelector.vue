<template>
    <div>
        <button v-for="theme in themes" v-on:click="changeTheme(theme)">{{ $t('themes.' + theme) }}</button>
    </div>
</template>

<script>
    export default {
        name: 'ThemeSelector',
        created() {
            let t = window.localStorage.getItem('theme');
            this.$fsedit.theme = t ? t : 'light';
        },
        data() {
            return {
                themes: ['light', 'dark']
            }
        },
        methods: {
            changeTheme(t) {
                this.$fsedit.theme = t;
            }
        },
        watch: {
            '$fsedit.theme': function(t) {
                window.document.body.className = 'theme-' + t;
                window.localStorage.setItem('theme', t);
            }
        }
    }
</script>

<style scoped lang="less">

</style>