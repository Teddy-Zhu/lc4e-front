<template>
    <sg-body>
        <slot>
            <Row>
                <Col :span="15">
                <Row>
                    <Col :span="24">
                    <table class="topic replyTable">
                        <tr>
                            <td class="left">
                                <router-link :to="'/i/'+topic.authorId" tag="a">{{topic.authorNick}}
                                </router-link>
                            </td>
                            <td class="title">{{topic.title}}</td>
                        </tr>
                        <tr>
                            <td class="authorpic left">
                                <img :src="getAvatar(topic.authorImg)">
                            </td>
                            <td>
                                <sg-markdown :sourceOut="topic.content" :isEditor="false"
                                             @rendered="topicRendered"></sg-markdown>
                            </td>
                        </tr>
                    </table>
                    </Col>
                    <Col :span="24">
                    <table v-for="comment in comments" class="comment replyTable">
                        <tr>
                            <td rowspan="2" class="authorpic left">
                                <img :src="getAvatar(comment.img,50)">
                            </td>
                            <td class="commentTitle">
                                <Breadcrumb separator="|">
                                    <Breadcrumb-item :href="'/i/' + comment.userId">
                                        <Tag class="clickable">{{comment.nick}}</Tag>
                                    </Breadcrumb-item>
                                    <Breadcrumb-item>
                                        <Tag>Reply : {{getDate(comment.createTime)}}</Tag>
                                    </Breadcrumb-item>
                                </Breadcrumb>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <sg-markdown :sourceOut="comment.content" :isEditor="false"></sg-markdown>
                            </td>
                        </tr>
                    </table>
                    <div v-if="comments.length == 0" class="emptyComment">
                        no comments
                    </div>
                    </Col>
                    <Col :span="24" class="pager-center" v-show="comments.length != 0">
                    <Page class="inline-block"
                          size="small" show-elevator @on-change="pageChange"
                          :total="total" :page-size="size">
                    </Page>
                    </Col>
                    <Col :span="24" v-if="user.id">
                    <Form ref="form" :rules="rules" :model="form" :label-width="0">
                        <Form-item label="" prop="content" class="replyItem">
                            <Input placeholder="请输入回复内容,文明用语,O(∩_∩)O" type="textarea"
                                   v-model="form.content" class="replyArea"
                                   :autosize="{ minRows: 3, maxRows: 5 }"></Input>
                        </Form-item>
                        <Form-item label="验证码" v-if="captcha" prop="captcha">
                            <Input v-model="form.captcha"></Input>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="onSubmit">回复</Button>
                        </Form-item>
                    </Form>
                    </Col>
                    <Col :span="24">

                    </Col>
                </Row>
                </Col>
                <Col :span="7" :offset="1">
                <Affix :offset-top="70">
                    <topic-nav :navs="navigations" @nav-click="goNav"></topic-nav>
                </Affix>
                </Col>
            </Row>
        </slot>
    </sg-body>
</template>

<style>

    .pager-center {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .comment {
        width: 100%;
    }

    .topic {
        margin-bottom: 1rem;
    }

    .clickable {
        cursor: pointer;
    }

    .replyTable {
        border-spacing: 0px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
        border: 1px solid #d3dce6;
        background: white;
        padding: 10px 10px;
        width: 100%;
    }

    .comment.replyTable {
        border-bottom: none;
    }

    .comment.replyTable:first-child {
    }

    .comment.replyTable:last-child {
        border-bottom: 1px solid #d3dce6;
    }

    .comment .commentTitle {
        border-bottom: 1px dashed black;
        padding-bottom: 5px;
        padding-left: .5em;
        height: 1px;
    }

    .inline-block {
        display: inline-block;
    }

    .left {
        width: 80px;
        text-align: center;
    }

    .title {
        border-bottom: 1px dashed black;
        font-size: 1.5em;
        padding-left: .2em;
    }

    .authorpic {
        vertical-align: top;
    }

    .authorpic.left, .left {
        border-right: 1px dashed black;
    }

    .emptyComment {
        text-align: center;
        background: white;
        width: 100%;
        border-radius: .2em;
        margin-top: 1rem;
        border: 1px dashed #afafaf;
        padding: 1rem 10px;
        box-sizing: border-box;
    }

    .replyArea {
        margin: 1rem 0;
    }

</style>
<script>
    import Body from '../compments/front.vue';
    import {scrollTop} from 'iview/src/utils/assist';
    import {mapState} from 'vuex';
    export default{
        name: 'topicInfo',
        data(){
            return {
                name: this.$route.params.topic,
                page: this.$route.params.page ? this.$route.params.page : 1,
                size: 20,
                total: 0,
                topic: {
                    authorMail: '',
                    authorName: '',
                    content: '',
                    title: ''
                },
                rules: {
                    content: [
                        {required: true, message: ' ', trigger: 'blur'},
                        {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                    ]
                },
                form: {
                    content: '',
                    captcha: ''
                },
                comments: [],
                navigations: []
            };
        },
        created(){
            this.getData();
            this.getComments();
        },
        computed: mapState({
            captcha: state => state.newTopicCaptcha,
            orders: state => state.order,
            user: state => state.user,
            base: state => state.base
        }),
        watch: {
            $route(){
                this.updateBaseData();
                this.getData();
            },
            page(){
                this.getComments();
            },
        },
        methods: {
            topicRendered(){
                this.$nextTick(function () {
                    this.buildTopicNav();
                });
            },
            buildTopicNav(){
                this.navigations = [];
                const nodelist = document.querySelectorAll('.topic .markdown-body h1,.topic .markdown-body h2,.topic .markdown-body h3,.topic .markdown-body h4,.topic .markdown-body h5,.topic .markdown-body h6');

                for (let i = 0, len = nodelist.length; i < len; i++) {
                    const node = nodelist[i];
                    this.navigations.push({
                        title: this.findText(node),
                        clz: node.tagName.toLowerCase(),
                        node: node,
                        offsetTop: node.offsetTop
                    });
                }

            },
            findText(node){
                if (node) {
                    if (node.children.length == 1) {
                        return this.findText(node.children[0]);
                    } else {
                        return node.innerHTML;
                    }
                } else {
                    return '';
                }
            },
            goNav(nav){
                const endTop = nav.offsetTop + 60;
                const sTop = document.documentElement.scrollTop || document.body.scrollTop;
                scrollTop(document.body, sTop, endTop, 1000);
            },
            goPath(path){
                this.$router.push(path);
            },
            getComments(){
                const that = this;
                this.$util.ajax.post('/t/' + that.name + '/comment/' + that.page).then(function (response) {
                    if (response.data.result) {
                        that.comments = response.data.data.comments.result;
                        that.page = response.data.data.comments.pageNumber;
                        that.total = response.data.data.comments.totalCount;
                        that.size = response.data.data.comments.pageSize;
                    } else {
                        that.$Message.warning(response.data.message);
                    }
                });
            },
            getDate(d){
                return new Date(d).toLocaleString();
            },
            onSubmit(){
                var that = this;
                this.$refs.form.validate(function (valid) {
                    if (valid) {
                        that.$util.ajax.post('/t/' + that.name + '/reply', that.form).then(function (response) {
                            if (response.data.result) {
                                that.$Message.success('回复主题' + that.topic.title + '成功');
                                that.total = that.total + 1;
                                that.comments.push(response.data.data.comment);
                                that.$refs.form.resetFields();
                            } else {
                                that.$Message.warning(response.data.message);
                            }
                        });
                    } else {
                        that.$Message.warning('请填写必要信息');
                        return false;
                    }
                });
            },
            pageChange(page){
                this.page = page;
            },
            getAvatar(img, size){
                return this.base.userImg.replace('{md5}', img ? img : '84fe01dba7e12fbae34fd2b7ea3b18a6').replace('s=48', size ? ('s=' + size) : 's=66');
            },
            getData(){
                const url = '/t/' + this.name + '/info';
                const that = this;
                this.$util.ajax.post(url).then(function (response) {
                    if (response.data.result) {
                        that.topic = response.data.data.topic;
                    } else {
                        that.$Message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + '...' : response.data.message);
                    }
                }).catch(function () {
                    that.$Message.error('数据获取错误');
                });
            },
            updateBaseData(){
                this.name = this.$route.params.topic;
                this.page = this.$route.params.page ? this.$route.params.page : 1;
            }
        },
        components: {
            'sg-body': Body,
            'sg-markdown': (resolve) => require(['../compments/markdown.vue'], resolve),
            'topic-nav': (resolve) => require(['../compments/topicNav.vue'], resolve)
        }
    };
</script>
