/**
 * Created by teddyzhu on 2017/6/9.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import user from './user';
import order from './order';
import base from './base';
import captcha from './captcha';
Vue.use(Vuex);
let store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        order,
        base,
        captcha
    }
});

export default store;