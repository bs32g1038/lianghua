import Vue from 'vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import App from './App';
import newChart from './components/chart/index.vue';

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', redirect: '/lianghua' },
        { path: '/lianghua', component: newChart },
    ],
});

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
