<template>
    <sg-body>
        <slot>
            <Row type="flex" justify="center">
                <Col :span="15">
                <Form ref="form" :rules="rules" label-position="left" :model="form" :label-width="100">
                    <Form-item label="区域名称" prop="areaId">
                        <Select v-model="form.areaId" placeholder="请选择区域">
                            <Option v-for="allowarea in areas"
                                    :value="allowarea.id" :key="allowarea.id">{{allowarea.name}}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="标题" prop="title">
                        <Input v-model="form.title"></Input>
                    </Form-item>
                    <Form-item label="内容" prop="content">
                        <Input class="topicContent" type="textarea" v-model="form.content"></Input>
                        <sg-markdown :sourceOut="form.content" @rendered="rendered" v-if="preview"></sg-markdown>
                    </Form-item>
                    <Form-item label="验证码" v-if="captcha.newTopicCaptcha" prop="captcha">
                        <Input v-model="form.captcha"></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="onSubmit">立即创建</Button>
                        <Button @click="showPreview" :loading="buttonLoading">{{previewButton}}</Button>
                    </Form-item>
                </Form>
                </Col>
                <Col :span="7" :offset="1">
                <Row class="publish">
                    <Row :col="24">
                        主题发布公告
                    </Row>
                </Row>
                </Col>
            </Row>
        </slot>
    </sg-body>
</template>
<style>

    .publish {
        min-height: 100px;
        padding: 10px 0;
        border-radius: 0.2em;
        background-color: white;
        margin-bottom: 1rem;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        border-bottom: 1px solid rgba(162, 162, 162, 0.31);
    }

    .topicContent .el-textarea__inner {
        min-height: 150px;
    }


</style>
<script>
    import Body from '../compments/front.vue';
    import Api from '../../libs/api';
    import {mapState} from 'vuex';

    export default{
        name: 'newTopic',
        data(){
            return {
                area: this.$route.params.area,
                areas: [],
                preview: false,
                buttonLoading: false,
                form: {
                    title: '',
                    content: '',
                    captcha: '',
                    areaId: undefined
                },
                rules: {
                    areaId: [
                        {type: 'number', required: true, message: '请选择区域', trigger: 'change'},
                    ],
                    title: [
                        {required: true, message: '请输入文章标题', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '请输入文章内容', trigger: 'blur'},
                        {min: 1, message: '长度大于1', trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            ...mapState(['captcha']),
            previewButton(){
                return this.preview ? '关闭预览' : '实时预览';
            }
        },
        methods: {
            onSubmit(){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.$util.ajax.post(Api.newTopic, that.form).then(function (data) {
                            if (data.data.result) {
                                that.$router.push('/t/' + data['data']['data']['topic']['url']);
                                that.$Message.success('恭喜你，主题已发布');
                            } else {
                                that.$Message.warning(data.data.message);
                            }
                        });
                    } else {
                        that.$Message.warning('请填写必要信息');
                        return false;
                    }
                });
            },
            getData(){
                const that = this;
                this.$util.ajax.post(Api.baseArea).then(function (response) {
                    if (response.data.result) {
                        that.areas = response.data['data']['areaList'];
                    } else {
                        that.$Message.error('请填写必要信息');
                    }
                });
            },
            changeAreaChoosed(){
                for (let i = 0; i < this.areas.length; i++) {
                    if (this.areas[i].abbr == this.area) {
                        this.form.areaId = this.areas[i].id;
                        return;
                    }
                }
                this.$Message.error('不存在此区域或此区域无法无法发布主题,请选择其他区域');
            },
            shouldChange(){
                return this.area && this.areas.length > 0;
            },
            showPreview(){
                this.preview = !this.preview;
                if (this.preview) {
                    this.buttonLoading = true;
                }
            },
            rendered(){
                this.buttonLoading = false;
            }
        },
        watch: {
            area(){
                this.shouldChange() && this.changeAreaChoosed();
            },
            areas(){
                this.shouldChange() && this.changeAreaChoosed();
            }
        },
        created(){
            this.getData();
        },
        components: {
            'sg-body': Body,
            'sg-markdown': (resolve) => require(['../compments/markdown.vue'], resolve)
        }
    };
</script>
