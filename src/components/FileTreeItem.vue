<template>
    <!--<ul>-->
    <!--<li v-for="entry in items" v-bind:class="{file: entry.type === 'file', folder: entry.type === 'directory'}">-->
    <!--<a href="#">{{ entry.name }}</a>-->
    <!--<file-tree-item v-if="entry.type === 'directory'" :items="entry.children"></file-tree-item>-->
    <!--</li>-->
    <!--</ul>-->
    <li>
        <div @click="toggle">
            <a href="#"><span v-if="entry.isDir">[{{ open ? '-' : '+' }}]</span> {{ entry.name }}</a>

        </div>
        <ul v-show="open" v-if="entry.isDir">
            <file-tree-item
                    class="item"
                    v-for="(child, index) in entry.children"
                    :key="index"
                    :entry="child">
            </file-tree-item>
        </ul>
    </li>
</template>

<script>
    export default {
        name: 'FileTreeItem',
        props: {
            entry: Object
        },
        data() {
            return {
                open: true
            }
        },
        methods: {
            toggle() {
                this.open = !this.open;
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";

    ul {
        list-style-type: none;
        padding-left: 0;
        margin: 0;
    }

    ul.root > li {
        padding-left: 8px;
    }

    a {
        text-decoration: none;
        width: 100%;
        display: block;
        white-space: nowrap;
    }

    li {
        & li {
            padding-left: 24px;
        }

        &.file:hover {
            .theme({ background-color: fade(@primary-color, 10); });
        }

        &.active {
            .theme({ background-color: @primary-color !important; });

            & a {
                .theme({ color: @color-invert; });
                .user-select(none);
            }
        }

        &.folder {
            cursor: default;
        }

        &.file {
            cursor: pointer;
        }
    }

</style>