import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            //component: Login
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            //component: Profile
            component: () => import(/* webpackChunkName: "profile" */ './views/Profile.vue')
        },
        {
            path: '/:workspace/:filename*',
            name: 'show',
            component: Home
        },
    ]
})
