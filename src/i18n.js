import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './lang/en.json'
import cs from './lang/cs.json'

Vue.use(VueI18n);

let lang = window.localStorage.getItem('lang');
if (!lang) {
    lang = 'en';
}

if (!['en', 'cs'].includes(lang)) {
    lang = 'en';
}

export default new VueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages: {
        en: en,
        cs: cs,
    }
});