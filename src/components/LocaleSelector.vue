<template>
    <div>
        <select v-model="$i18n.locale" title="Locale selector">
            <option v-for="(_, lang) in $i18n.messages" :value="lang">{{ lang }}</option>
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

<style scoped>

</style>