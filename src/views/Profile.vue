<template>
    <div class="content">

        <h1>Workspaces</h1>

        <div v-if="workspaces.length">
            <ul>
                <li v-for="ws in workspaces">
                    <workspace-preview :ws="ws"></workspace-preview>
                </li>
            </ul>

            <a v-if="page > 0" href="#" @click.prevent="page--">Previous page</a>
            <a v-if="this.workspaces.length === 3" href="#" class="next-page" @click.prevent="page++">Next page</a>
        </div>
        <span v-else>No workspaces found</span>

    </div>
</template>

<script>

    import Vue from 'vue';
    import WorkspacePreview from '../components/WorkspacePreview'

    export default {
        name: 'profile',
        data() {
            return {
                workspaces: [],
                page: 0
            }
        },
        methods: {
            loadWorkspaces() {
                this.$api.get('/workspaces/list', {
                    params: {
                        page: this.page
                    }
                }).then(rs => {
                    this.workspaces = rs.data;
                    window.scrollTo(0, 0);
                });
            }
        },
        components: {
            WorkspacePreview
        },
        beforeRouteEnter(to, from, next) {
            if (!Vue.prototype.$fsedit.token) {
                return next({name: 'login'});
            }
            return next();
        },
        mounted() {
            this.loadWorkspaces();
        },
        watch: {
            page() {
                this.loadWorkspaces();
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
        padding: 0 16px 32px;
        .theme({ background-color: @background-color; });
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 8px;

    }

    a.next-page {
        float: right;
    }
</style>
