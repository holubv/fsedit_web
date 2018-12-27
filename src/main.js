import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Axios from 'axios'

Vue.config.productionTip = false;

let apiUrl = 'https://api.fsedit.cf';

Vue.prototype.$fsedit = new Vue({
    //reactive container
    data: {
        theme: null,
        apiUrl: apiUrl,
        token: null,
        user: {}
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
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
