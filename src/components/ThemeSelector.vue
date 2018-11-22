<template>
    <div>
        <!--<button class="btn" v-for="theme in themes" v-on:click="changeTheme(theme)">{{ $t('themes.' + theme) }}</button>-->
        <a href="#" v-on:click.prevent="toggleTheme">Theme</a>
    </div>
</template>

<script>
    export default {
        name: 'ThemeSelector',
        created() {
            let t = window.localStorage.getItem('theme');
            this.$fsedit.theme = t ? t : 'dark';
        },
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
        watch: {
            '$fsedit.theme': function(t) {
                window.document.body.className = 'theme-' + t;
                window.localStorage.setItem('theme', t);

                let el = window.document.getElementById('meta-theme');
                let color = el.getAttribute('data-theme-' + t);
                el.setAttribute('content', color);
            }
        }
    }
</script>

<style scoped lang="less">

</style>