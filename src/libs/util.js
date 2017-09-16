import axios from 'axios';
import env from '../config/env';
import Vue from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'
let util = {};

const ajaxUrl = env === 'development' ?
    'https://api.silentgo.com' :
    env === 'production' ?
        'https://api.silentgo.com' :
        'https://api.silentgo.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    // transformRequest: [function (data) {
    //     let ret = '', index = 0;
    //     for (let it in data) {
    //         index++;
    //         ret += (index == 1 ? '' : '&') + encodeURIComponent(it) + '=' + encodeURIComponent(data[it])
    //     }
    //     return ret
    // }],
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
});

util.ajax.interceptors.request.use(function (config) {
    NProgress.start();
    return config
}, function (error) {
    return Promise.reject(error);
})

util.ajax.interceptors.response.use(res => {
    NProgress.done()
    return res;
}, error => {
    NProgress.done();
    return Promise.reject(error)
})
Vue.prototype.$changeLang = function (locale) {
    Vue.config.lang = locale;
}

util.fmt = function (fmt, date) {
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

}

util.truncate = function (string, length, ext) {
    return string.length > length ? ( string.substring(0, length) + (ext ? ext : '')) : string;
}

export default util;