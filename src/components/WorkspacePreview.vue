<template>

    <div>
        <div class="ws-link">
            <router-link :to="{ name: 'show', params: {workspace: ws.hash}}">{{ ws.hash }}</router-link>
        </div>

        <ul class="file-preview-list">
            <li v-for="(file,i) in ws.files" v-if="i < 2">
                <pre v-if="preview[file]">{{ preview[file] }}</pre>
                <img v-else-if="preview[file] === false" :src="'https://api.fsedit.cf/file/' + file" :alt="file">
                <div v-else class="info">Preview not available</div>
            </li>
            <li v-if="ws.count > 2">
                <div class="info">+{{ ws.count - 2 }} more file{{ ws.count - 2 > 1 ? 's' : '' }}</div>
            </li>
        </ul>
    </div>

</template>

<script>
    export default {
        name: 'WorkspacePreview',
        props: {
            ws: Object
        },
        data() {
            return {
                preview: {},
            }
        },
        methods: {
            loadFilePreview() {
                let files = this.ws.files;
                files.length = Math.min(files.length, 2);

                for (let file of files) {
                    if (this.preview[file] !== undefined) {
                        continue;
                    }
                    this.$api({
                        url: '/file/' + file,
                        transformResponse: [data => data],
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Accept': 'text/plain'
                        }
                    }).then(rs => {
                        this.preview[file] = rs.data;
                    }).catch(err => {
                        if (err.response.status === 406) {
                            this.preview[file] = false;
                        }
                    }).then(() => {
                        this.$forceUpdate();
                    });
                }
            }
        },
        mounted() {
            this.loadFilePreview();
        },
        watch: {
            ws() {
                this.loadFilePreview();
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    @preview-box-height: 250px;

    .ws-link {
        margin-bottom: 10px;
        font-size: 18px;
        border-radius: 4px;
        padding: 6px 12px;

        .theme({ background-color: @primary-color; });

        & a {
            display: block;
            .theme({ color: @color-invert; });
        }
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        display: inline-block;
        width: calc(33% - 12px);
        margin: 2px 2px;
        vertical-align: middle;

        @media (max-width: 720px) {
            display: block;
            width: unset;
        }

        border: 1px solid;
        border-radius: 4px;
        height: @preview-box-height;
        padding: 2px 4px;

        .theme({ background-color: @content-background-color; border-color: @primary-color; });
    }

    pre {
        overflow-x: auto;
        overflow-y: auto;
        margin: 0;
        height: @preview-box-height;
        font-size: 12px;

        @media (max-width: 720px) {
            overflow-y: hidden;
        }
    }

    img {
        max-width: 100%;
        max-height: 100%;
    }

    .file-preview-list {
        & .info {
            text-align: center;
            line-height: @preview-box-height;
        }
    }

</style>