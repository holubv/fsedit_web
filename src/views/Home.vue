<template>
    <div class="home">
        <!--<button v-on:click="dark = !dark">Theme</button>-->
        <editor></editor>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Editor from '@/components/Editor.vue'

    export default {
        name: 'home',
        data() {
            return {
            }
        },
        methods: {
            test() {
                window.console.log(this.$i18n)
            }
        },
        components: {
            Editor
        }
    }
</script>
