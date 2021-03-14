import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Axios from 'axios'
import Analytics from "./analytics";

Vue.config.productionTip = false;

let apiUrl = 'https://api.fsedit.cf';
let token = window.localStorage.getItem('token') || null;
let tokenCreated = parseInt(window.localStorage.getItem('token-created') || '0');
if (tokenCreated + 1814400000 < Date.now()) {
    console.warn('expired token detected, please log in');
    token = null;
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('token-created');
}

let analytics = new Analytics();
analytics.init();
analytics.logPageView();

Vue.prototype.$fsedit = new Vue({
    //reactive container
    data: {
        theme: null,
        apiUrl: apiUrl,
        token: null,
        user: {},
        analytics: analytics
    },
    computed: {
        logged() {
            return !!this.token;
        }
    },
});
Vue.prototype.$api = Axios.create({
    baseURL: apiUrl,
    timeout: 6000,
});

if (token) {
    Vue.prototype.$api.defaults.headers['X-Api-Token'] = token
}

Vue.directive('focus', {
    inserted: function (el) {
        el.focus();
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');