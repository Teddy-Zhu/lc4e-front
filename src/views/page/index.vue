<template>
    <sg-body>
        <slot>
            <Row>
                <Col :span="24">
                <Alert closable>站点开发中~~~</Alert>
                </Col>
            </Row>
            <Row>
                <Col :span="15">
                <Row type="flex" justify="space-between" align="middle">
                    <Col :span="13" class="br-path">
                    <Breadcrumb separator=">">
                        <Breadcrumb-item href="/">{{$t('home')}}</Breadcrumb-item>
                    </Breadcrumb>
                    </Col>
                    <Col :span="10">
                    <Row type="flex" justify="end">
                        <Col :span="6">
                        <Button type="primary" icon="edit" @click="newTopic" v-if="user.id">{{$t('button.publishTopic')}}</Button>
                        </Col>
                        <Col :span="12" :offset="1">
                        <Select v-model="orderNow">
                            <Option v-for="orderItem in orders" :key="orderItem.value" :value="orderItem.value">
                                {{orderItem.label}}
                            </Option>
                        </Select>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                <Row>
                    <Col :span="24">
                    <sg-topic-Line :data="data" v-for="data in topics" :key="data.url"
                                   :avatarUrl="base.userImg"></sg-topic-Line>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col :span="24" class="pager-center">
                    <Page class="inline-block" :total="total" size="small" show-elevator @on-change="pageChange" :page-size="size"></Page>
                    </Col>
                </Row>
                </Col>
                <Col :span="7" :offset="1">
                <Row class="topic-hot">
                    <Col :span="24">
                    <h3>Topic Hot</h3>
                    </Col>
                    <Col :span="24" class="topic-hot-line" v-for="hot in hots" :key="hot.url">
                    <Tag color="blue">
                        <router-link tag="a" :to="'/a/' + hot.abbr">{{hot.name}}</router-link>
                    </Tag>
                    <router-link tag="a" :to="'/t/' + hot.url">{{hot.title}}</router-link>
                    </Col>
                </Row>
                </Col>
            </Row>
        </slot>
    </sg-body>
</template>
<style type="text/css">

    .topic-hot-line {
        margin: 5px 0;
        border-bottom: 1px solid #c2c8dc;
        padding-left: 5px;
        padding-bottom: 5px;
    }

    .topic-hot-line a {
        display: inline;
    }

    .topic-hot div:first-child h3 {
        text-align: center;
        margin: .4em 0;
    }

    .topic-hot {
        min-height: 100px;
        padding: 10px 0;
        margin-bottom: 1rem;
        border-radius: 0.2em;
    }

    .topic-hot-line a {
        text-decoration: none;
        color: black;
    }

    .pager-center {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .inline-block {
        display: inline-block;
    }

    .br-path {
        margin: 10px 0;
    }

</style>
<script type="text/javascript">
    import Body from '../compments/front.vue';
    import TopicLine from '../index/topicLine.vue';
    import {mapState} from 'vuex';
    import Api from '../../libs/api';

    export default  {
        name: 'index',
        data () {
            return {
                topics: [],
                page: this.$route.params.page ? parseInt(this.$route.params.page) : 1,
                size: 20,
                total: 0,
                orderNow: this.$route.params.order ? this.$route.params.order : '1',
                hots: []
            };
        },
        computed: mapState({
            orders: state => state.order,
            user: state => state.user,
            base: state => state.base
        }),
        created () {
            this.getTopic();
            this.getTodayTopicHot();
        },
        watch: {
            $route() {
                this.updateBaseData();
                this.getTopic();
                this.getTodayTopicHot();
            },
            page(val, OldVal){
                this.getTopic();
            },
            orderNow(val, OldVal){
                this.getTopic();
            }
        },
        methods: {
            newTopic(){
                this.$router.push('/t/new/');
            },
            pageChange(page){
                this.page = page;
            },
            updateBaseData(){
                this.page = this.$route.params.page ? this.$route.params.page : 1;
                this.orderNow = this.$route.params.order ? this.$route.params.order : '1';
            },
            getTopic(){
                var url = '/a/all/' + this.page + '/' + this.orderNow, that = this;
                this.$util.ajax.post(url).then(function (response) {
                    if (response.data.result) {
                        that.topics = response.data.data.topics.result;
                        that.page = response.data.data.topics.pageNumber;
                        that.total = response.data.data.topics.totalCount;
                        that.size = response.data.data.topics.pageSize;
                    } else {
                        that.$Message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + '...' : response.data.message);
                    }
                }).catch(function () {
                    this.$Message.error('数据获取错误');
                });
            },
            getTodayTopicHot () {
                var that = this;
                this.$util.ajax.post(Api.topicHot).then(function (response) {
                    if(response.data.result){
                        that.hots = response.data.data.topics;
                    }else{
                        that.$Message.error(response.data.message.length > 40 ? response.data.message.substring(0, 40) + '...' : response.data.message);
                    }
                });
            },
            nextPage () {
                this.page = this.page + 1;
            },
            prevPage () {
                this.page = this.page - 1;
            }
        },
        components: {
            'sg-body': Body,
            'sg-topic-Line': TopicLine
        }
    };
</script>