import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

Vue.config.productionTip = false;

Vue.prototype.$fsedit = new Vue({
    //reactive container
    data: {
        theme: null,
        apiUrl: 'http://localhost',
        token: null,
        pro: false
    },
    computed: {
        logged() {
            return !!this.token;
        }
    },
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
