<template>

    <a :href="url"
       target="_blank"
       :disabled="!item || !item.file"
       draggable="false"
       @dragstart="e => {e.preventDefault()}"
       @click="e => {if (!item || !item.file) e.preventDefault()}">

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