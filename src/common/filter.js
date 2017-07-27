/**
 * Created by teddyzhu on 2017/5/8.
 */
import Vue from 'vue';
import util from './commom.js';
Vue.filter('dateTime', function (value) {
    return util.fmt('yyyy-MM-dd hh:mm:ss', value);
});