<template>

    <div>
        <div><router-link :to="{ name: 'show', params: {workspace: wsHash}}">{{ wsHash }}</router-link></div>
    </div>

</template>

<script>
    export default {
        name: 'WorkspacePreview',
        props: {
            wsHash: String
        }
    }
</script>

<style scoped lang="less">
    @import "../theme/global";


</style>