<template>
    <div>
        <ace v-model="editorContent" :dark-theme="$fsedit.theme === 'dark'"></ace>
    </div>
</template>

<script>
    import Ace from './Ace'

    export default {
        name: 'Editor',
        data() {
            return {
                editorContent: ''
            }
        },
        components: {
            Ace
        },
        watch: {
            // '$fsedit.theme': function(t) {
            //     this.changeTheme(t === 'dark');
            // }
        }
    }
</script>

<style scoped>

</style>