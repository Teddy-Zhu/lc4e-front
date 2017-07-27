/**
 * Created by teddyzhu on 2017/6/9.
 */
let api = {}

api.baseInfoUrl = '/base/baseInfo';
api.loginUrl = '/u/signin';
api.logoutUrl = '/u/signout';
api.userRegisterUrl = '/u/register';
api.userLoginViewUrl = '/u/login';
api.newTopic = '/t/new';
api.baseArea = '/base/area';

api.topicHot = '/t/todayHot';


api.manage = {
    config: {
        add: '/manage/config/new',
        edit: '/manage/config/edit',
        delete: '/manage/config/delete',
        batchDelete: '/manage/config/batchDelete',
        query: '/manage/config/query'
    },
    configGroup: {
        all: '/manage/config/group/queryAll',
        add: '/manage/config/group/new',
        batchDelete: '/manage/config/group/batchDelete',
        edit: '/manage/config/group/edit',
        query: '/manage/config/group/query',
        delete: '/manage/config/delete'
    },
    topic: {
        query: '/manage/topic/query'
    }
}
export default api;