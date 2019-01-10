<template>
    <div class="content">
        <div class="box error">
            This page is under development
        </div>

        <h1>Profile</h1>
        {{ $fsedit.user.email }}
        <!-- todo list user workspaces -->
        <h1>Workspaces</h1>

        <ul>
            <li v-for="ws in workspaces">
                <div><router-link :to="{ name: 'show', params: {workspace: ws.hash}}">{{ ws.hash }}</router-link></div>
                <div>{{ ws.files  }}</div>
            </li>
        </ul>

    </div>
</template>

<script>

    import Vue from 'vue';

    export default {
        name: 'profile',
        data() {
            return {
                workspaces: []
            }
        },
        methods: {},
        components: {},
        beforeRouteEnter (to, from, next) {
            if (!Vue.prototype.$fsedit.token) {
                return next({ name: 'login' });
            }
            return next();
        },
        mounted() {
            this.$api.get('/workspaces/list').then(rs => {
                this.workspaces = rs.data;
            });
        },
        filters: {
            substr(val, start, len) {
                if (!val) {
                    return '';
                }
                return val.substr(start, len);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    .box {
        margin-left: auto;
        margin-right: auto;
        width: 320px;
        text-align: center;
    }

    .content {
        padding: 32px 16px;
        .theme({
            background-color: @content-background-color;
        });
    }

    li {
        margin-bottom: 8px;
    }
</style>
