<template>
    <div class="profile">
        <h1>Profile</h1>
        {{ $fsedit.user.email }}
        <!-- todo list user workspaces -->
        <span>todo list user workspaces</span>
    </div>
</template>

<script>

    import Vue from 'vue';

    export default {
        name: 'profile',
        data() {
            return {}
        },
        methods: {},
        components: {},
        beforeRouteEnter (to, from, next) {
            if (!Vue.prototype.$fsedit.token) {
                return next({ name: 'login' });
            }
            return next();
        },
    }
</script>

<style scoped lang="less">
    @import "../theme/global";


</style>
