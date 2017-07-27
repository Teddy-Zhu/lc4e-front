/**
 * Created by teddyzhu on 2017/6/14.
 */

import util from '../libs/util';
import Api from '../libs/api';
let base = {
    state: {
        userImg:'',
        menus:[],
        siteName:'',
        version:''
    },
    mutations: {
        updateBaseInfo(state,base){
            state.userImg =base.userImg;
            state.menus = JSON.parse(base.menusString);
            state.siteName = base.SiteName;
            state.version = base.version;
        }
    },
    actions: {
        pullBaseInfo({state, commit}, callback){
            util.ajax.post(Api.baseInfoUrl)
                .then(function (response) {
                    if (response.data.result) {
                        commit('updateUser', response.data.data.user? JSON.parse(response.data.data.user):{});
                        commit('updateBaseInfo', response.data.data);
                    }
                    callback && callback.call(this,response);
                });
        }
    }
};
export default base;