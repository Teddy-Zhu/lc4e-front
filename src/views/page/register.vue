<template>
    <sg-body>
        <slot>
            <Row type="flex" justify="center">
                <Col :span="10" class="formStyle">
                <Form ref="form" :rules="rules" :model="form" label-position="left" :label-width="100">
                    <Form-item label="用户名" prop="name">
                        <Input v-model="form.name"></Input>
                    </Form-item>
                    <Form-item label="密码" prop="password">
                        <Input type="password" v-model="form.password"></Input>
                    </Form-item>
                    <Form-item label="重复密码" prop="rpassword">
                        <Input type="password" v-model="form.rpassword"></Input>
                    </Form-item>
                    <Form-item label="昵称" prop="nick">
                        <Input v-model="form.nick"></Input>
                    </Form-item>
                    <Form-item label="邮箱" prop="mail">
                        <Input v-model="form.mail"></Input>
                    </Form-item>
                    <Form-item label="验证码" v-if="captcha.registerCaptcha">
                        <div id="geetestArea"></div>
                    </Form-item>
                    <Form-item label="个人网页" prop="web">
                        <Input v-model="form.webBody">
                        <Select v-model="form.webPre" slot="prepend" style="width: 80px;">
                            <Option key="https://" value="https://">https://</Option>
                            <Option key="http://" value="http://">http://</Option>
                        </Select>
                        </Input>
                    </Form-item>
                    <Form-item label="电话" prop="phone">
                        <Input v-model="form.phone"></Input>
                    </Form-item>
                    <Form-item label="生日" prop="birth">
                        <Date-picker type="date" placeholder="选择日期" v-model="form.birth"
                                     style="width: 100%;"></Date-picker>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="onSubmit">注册</Button>
                        <Button @click="reset">重置</Button>
                    </Form-item>
                </Form>
                </Col>
            </Row>
        </slot>
    </sg-body>
</template>
<style>
    .web-select {
        width: 80px;
    }

    .formStyle {
        background: white;
        box-shadow: 0 2px 4px 1px rgba(0, 0, 0, .25);
        padding: 3rem 3rem 1.1rem 3rem;
        margin: 2rem;
        border-radius: .2rem;
    }
</style>
<script>
    import Body from '../compments/front.vue';
    import Api from '../../libs/api';
    import {mapState} from 'vuex';

    import initGeetest from '../../libs/gt';


    export default{
        name: 'register',
        data(){
            var that = this;
            var validateRPassword = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== that.form.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            var validateName = function (rule, value, callback) {
                that.validate('name', value, callback);
            };
            var validateNick = function (rule, value, callback) {
                that.validate('nick', value, callback);
            };

            var validateMail = function (rule, value, callback) {
                if (!/^([0-9a-z_.-]+)@([0-9a-z.-]+)\.([a-z]{2,6})$/.test(value)) {
                    callback(new Error('邮箱格式不正确'));
                    return;
                }
                that.validate('mail', value, callback);
            };

            return {
                validateInterval: undefined,
                geetestObj: undefined,
                geetResult: false,
                form: {
                    webPre: 'https://',
                    name: '',
                    mail: '',
                    nick: '',
                    password: '',
                    rpassword: '',
                    webBody: '',
                    phone: '',
                    birth: '',
                    web: '',
                    geetest_challenge: '',
                    geetest_validate: '',
                    geetest_seccode: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'},
                        {validator: validateName}
                    ],
                    nick: [
                        {required: true, message: '请输入用户昵称', trigger: 'blur'},
                        {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'},
                        {validator: validateNick, trigger: 'blur'}
                    ],
                    mail: [
                        {required: true, message: '请输入用户邮箱', trigger: 'blur'},
                        {validator: validateMail, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ],
                    rpassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator: validateRPassword}
                    ]
                }
            };
        },
        created(){
            this.loadCaptcha();
        },
        methods: {
            loadCaptcha(){
                var that = this;
                if (that.captcha.registerCaptcha) {
                    this.$util.ajax.get('/geetest/init').then(function (response) {
                        const data = response.data;
                        that.geetestObj = initGeetest({
                            width: '100%',
                            gt: data.gt,
                            challenge: data.challenge,
                            offline: !data.success
                        }, function (captchaObj) {
                            captchaObj.appendTo('#geetestArea');

                            captchaObj.onSuccess(function () {
                                const result = captchaObj.getValidate();

                                that.geetResult = true;
                                that.form.geetest_challenge = result.geetest_challenge;
                                that.form.geetest_validate = result.geetest_validate;
                                that.form.geetest_seccode = result.geetest_seccode;
                            });

                            captchaObj.onError(function () {
                                that.geetResult = false;
                            });
                        });
                    });
                }
            },
            reset() {
                this.$refs.form.resetFields();
            },
            getFormData(){
                var data = this.form;
                data.web = data.webPre + data.webBody;
                return data;
            },
            onSubmit(){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        if (that.captcha.loginCaptcha && !that.geetResult) {
                            return;
                        }

                        that.$util.ajax.post(Api.userRegisterUrl, that.getFormData()).then(function (response) {
                            if (response.data.result) {
                                that.$router.push(Api.userLoginViewUrl);
                                that.$Notice.success({
                                    title: '注册成功',
                                    desc: '感谢注册,请继续登陆'
                                });
                            } else {
                                that.$Message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + '...' : response.data.message);
                            }
                        });
                    } else {
                        this.$Message.warning('请填写必要信息');
                        return false;
                    }
                });
            },
            validate(type, value, callback){
                var that = this;
                if (that.validateInterval) clearTimeout(that.validateInterval);
                that.validateInterval = setTimeout(function () {
                    that.$util.ajax.post('/su/' + type, {
                        name: value
                    }).then(function (data) {
                        if (data.result) {
                            callback();
                        } else {
                            callback(new Error(data.message.length > 40 ? data.message.substring(0, 40) + '...' : data.message));
                        }
                    });
                }, 400);
            }
        },
        computed: mapState({
            captcha: state => state.captcha
        }),
        components: {
            'sg-body': Body
        }
    };
</script>
