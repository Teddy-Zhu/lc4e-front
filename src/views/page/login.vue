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
                    <Form-item label="验证码" v-if="captcha.loginCaptcha">
                        <div id="geetestArea"></div>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="onSubmit">登陆</Button>
                        <Button @click="reset">重置</Button>
                    </Form-item>
                </Form>
                </Col>
            </Row>
        </slot>
    </sg-body>
</template>
<style>
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
    import {mapActions, mapState} from 'vuex';
    import initGeetest from '../../libs/gt';

    export default{
        name: 'login',
        data(){
            return {
                geetestObj: undefined,
                geetResult: false,
                form: {
                    name: '',
                    password: '',
                    geetest_challenge: '',
                    geetest_validate: '',
                    geetest_seccode: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'},
                        {min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
                    ]
                }
            };
        },
        created(){
            this.loadCaptcha();
        },
        methods: {
            ...mapActions(['login']),
            reset() {
                this.$refs.form.resetFields();
            },
            onSubmit(e){
                const that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        if (that.captcha.loginCaptcha && !that.geetResult) {
                            return;
                        }
                        that.login({
                            form: that.form,
                            callback: function (data) {
                                if (data.result) {
                                    that.$router.push('/');
                                    that.$Notice.success({
                                        title: '登陆成功',
                                        desc: '欢迎回来~~,' + data["data"]["user"]["nick"]
                                    });
                                } else {
                                    that.$Message.error(data.message.length > 40 ? data.message.substring(0, 40) + '...' : data.message)
                                }
                            }
                        });
                    } else {
                        that.$Message.warning('请填写必要信息');
                        return false;
                    }
                });
            },
            loadCaptcha(){
                var that = this;
                if (that.captcha.loginCaptcha) {
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
                            })
                        });
                    });
                }
            }
        },
        computed: mapState({
            captcha: state => state.captcha,
        }),
        components: {
            'sg-body': Body
        }
    };
</script>
