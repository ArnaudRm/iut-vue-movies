import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import App from './app';
import router from './router/index';
import store from './store';


Vue.config.productionTip = false;
Vue.use(Vuetify);

Vue.component('app', App);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
});
