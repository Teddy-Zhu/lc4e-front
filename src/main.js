import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import store from './store';
import 'iview/dist/styles/iview.css';


import VueI18n from 'vue-i18n';
import Locales from './locale';
// import zhLocale from 'iview/src/locale/lang/zh-CN';
// import enLocale from 'iview/src/locale/lang/en-US';
Vue.config.devtools = true;

Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(iView);

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

Vue.config.lang = lang;

// 多语言配置
const locales = Locales;
// const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
// const mergeEN = Object.assign(enLocale, locales['en-US']);
Vue.locale('zh-CN', locales['zh-CN']);
Vue.locale('en-US', locales['en-US']);

//util
Vue.prototype.$util = Util;
// 路由配置
const RouterConfig = {
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => ( savedPosition || {x: 0, y: 0}),
    routes: Routers
};
const router = new VueRouter(RouterConfig);
//
// router.beforeEach((to, from, next) => {
//     iView.LoadingBar.start();
//     next();
// });
//
// router.afterEach(() => {
//     iView.LoadingBar.finish();
// });

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});