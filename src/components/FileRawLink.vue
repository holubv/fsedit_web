<template>

    <a :href="url"
       target="_blank"
       :class="{disabled: !item || !item.file}"
       draggable="false"
       @dragstart="e => {e.preventDefault()}"
       @click="onLinkClick">

        <slot></slot>

    </a>

</template>

<script>
    export default {
        name: 'FileRawLink',
        props: {
            item: {
                type: Object,
                default: null
            },
            download: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            onLinkClick(e) {
                if (!this.item || !this.item.file) {
                    e.preventDefault();
                    return;
                }

                if (this.download) {
                    this.$fsedit.analytics.logEvent('e-file-download');
                } else {
                    this.$fsedit.analytics.logEvent('e-file-source');
                }
            }
        },
        computed: {
            url() {
                if (this.item && this.item.file) {
                    let url = 'https://api.fsedit.cf/file/' + this.item.file;
                    if (this.download) {
                        return url + '?download=true';
                    }
                    return url;
                }
                return '#';
            }
        }
    }
</script>