<template>
    <div>
        <i class="fas fa-globe"></i>
        <select v-model="$i18n.locale" title="Locale selector">
            <option v-for="(obj, lang) in $i18n.messages" :value="lang">{{ obj.lang }}</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: 'LocaleSelector',
        watch: {
            '$i18n.locale': function (locale) {
                window.document.documentElement.setAttribute('lang', locale);
                window.localStorage.setItem('lang', locale);
            }
        }
    }
</script>

<style lang="less" scoped>

    @import "../theme/global";

    div {
        .theme({ color: @primary-color; });
    }

    select {
        .theme({ background-color: @background-color; color: @primary-color; });
        border: 0;
        font-size: 16px;
    }

</style>