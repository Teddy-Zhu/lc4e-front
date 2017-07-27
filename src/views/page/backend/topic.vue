<template>
    <sg-background>
        <Row type="flex" class="backHeader" justify="space-between" align="middle">
            <Col :span="14">
            <Breadcrumb separator="/">
                <Breadcrumb-item href="/manage">Dashboard</Breadcrumb-item>
                <Breadcrumb-item href="/manage/topic">主题管理</Breadcrumb-item>
            </Breadcrumb>
            </Col>
            <Col :span="5" class="right">
            </Col>
        </Row>
        <Row type="flex" class="backHeader" justify="space-between" :gutter="16" align="middle">
            <Col :span="18">
            <Date-picker class="queryField" type="datetime" :editable="false" v-model="select.createBeginTime"
                         placeholder="选择最小创建时间"></Date-picker>
            <Date-picker class="queryField" type="datetime" :editable="false" v-model="select.createEndTime"
                         placeholder="选择最大创建时间"></Date-picker>
            <Date-picker class="queryField" type="datetime" :editable="false" v-model="select.updateBeginTime"
                         placeholder="选择最小更新时间"></Date-picker>
            <Date-picker class="queryField" type="datetime" :editable="false" v-model="select.updateEndTime"
                         placeholder="选择最大更新时间"></Date-picker>
            <br/>
            <Select v-model="query.isVisible" placeholder="是否展示" class="queryField">
                <Option value="">全部</Option>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
            </Select>
            <Select v-model="query.isDelete" placeholder="是否删除" class="queryField">
                <Option value="">全部</Option>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
            </Select>
            <Select v-model="query.isClose" placeholder="是否关闭" class="queryField">
                <Option value="">全部</Option>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
            </Select>
            <Select v-model="query.isComment" placeholder="是否可评论" class="queryField">
                <Option value="">全部</Option>
                <Option value="true">是</Option>
                <Option value="false">否</Option>
            </Select>
            <Button type="error" size="small">记录删除
            </Button>
            </Col>
            <Col :span="6" class="right">
            <Page class="inline-block" @on-change="pageChange" :total="table.total" size="small" show-elevator
                  :page-size="query.pageSize"></Page>
            </Col>
        </Row>
        <Row>
            <Col :span="24">
            <Table border stripe
                   :columns="table.columns"
                   :data="table.data"
                   style="width: 100%">
            </Table>
            </Col>
        </Row>

    </sg-background>
</template>

<style type="text/css">
    .queryField, .queryField.ivu-select {
        width: 150px;
        margin-bottom: 10px;
    }
</style>
<script>
    import BackGround from '../../compments/background.vue';
    import Api from '../../../libs/api';

    export default {
        name: 'topic',
        data() {
            return {
                select: {
                    createBeginTime: '',
                    createEndTime: '',
                    updateBeginTime: '',
                    updateEndTime: ''
                },
                query: {
                    createBeginTime: '',
                    createEndTime: '',
                    updateBeginTime: '',
                    updateEndTime: '',
                    area: '',
                    isVisible: '',
                    isDelete: '',
                    isClose: '',
                    isComment: '',
                    pageSize: 10,
                    pageNum: 1
                },
                table: {
                    columns: [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: 'ID',
                        key: 'id',
                        width: 60
                    }, {
                        title: 'URL',
                        key: 'url'
                    }, {
                        title: '标题',
                        key: 'title'
                    }, {
                        title: '是否展示',
                        key: 'isVisible',
                        render: (h, params) => {
                            const bol = params.row[params.column.key];
                            return h('div', bol ? '是' : '否');
                        }
                    }, {
                        title: '是否删除',
                        key: 'isDelete',
                        render: (h, params) => {
                            const bol = params.row[params.column.key];
                            return h('div', bol ? '是' : '否');
                        }
                    }, {
                        title: '是否关闭',
                        key: 'isClose',
                        render: (h, params) => {
                            const bol = params.row[params.column.key];
                            return h('div', bol ? '是' : '否');
                        }
                    }, {
                        title: '是否可评论',
                        key: 'isComment',
                        render: (h, params) => {
                            const bol = params.row[params.column.key];
                            return h('div', bol ? '是' : '否');
                        }
                    }, {
                        title: '创建时间',
                        key: 'createTime',
                        render: (h, params) => {
                            const time = params.row[params.column.key];
                            return h('div', time ? this.$util.fmt('yyyy-MM-dd hh:mm:ss', new Date(time)) : '');
                        }
                    }, {
                        title: '最后更新时间',
                        key: 'updateTime',
                        render: (h, params) => {
                            const time = params.row[params.column.key];
                            return h('div', time ? this.$util.fmt('yyyy-MM-dd hh:mm:ss', new Date(time)) : '');
                        }
                    }],
                    data: [],
                    total: 0
                }
            };
        },
        watch: {
            'select.createBeginTime'(val) {
                this.query.createBeginTime = this.$util.fmt('yyyy-MM-dd hh:mm:ss', val);
            },
            'select.createEndTime'(val) {
                this.query.createBeginTime = this.$util.fmt('yyyy-MM-dd hh:mm:ss', val);
            },
            'select.updateBeginTime'(val) {
                this.query.createBeginTime = this.$util.fmt('yyyy-MM-dd hh:mm:ss', val);
            },
            'select.updateEndTime'(val) {
                this.query.createBeginTime = this.$util.fmt('yyyy-MM-dd hh:mm:ss', val);
            },
            'query.createBeginTime'(val,OldVal){
                if (val !== OldVal)
                    this.queryTopic();
            },
            'query.createEndTime'(val,OldVal){
                if (val !== OldVal)
                    this.queryTopic();
            },
            'query.updateBeginTime'(val,OldVal){
                if (val !== OldVal)
                    this.queryTopic();
            },
            'query.updateEndTime'(val,OldVal){
                if (val !== OldVal)
                    this.queryTopic();
            },
            'query.pageNum'(val, OldVal) {
                if (val !== OldVal)
                    this.queryTopic();
            }
        },
        methods: {
            pageChange: function (page) {
                this.query.pageNum = page;
            },
            queryTopic() {
                const that = this;
                this.$util.ajax.post(Api.manage.topic.query, this.query)
                    .then(function (response) {
                        const data = response.data;
                        if (data && data.result) {
                            that.table.data = data.data.page.result;
                            that.table.page = data.data.page.pageNumber;
                            that.table.total = data.data.page.totalCount;
                            that.table.size = data.data.page.pageSize;
                        }
                    });
            }
        },
        created() {
            this.queryTopic();
        },
        components: {
            'sg-background': BackGround
        }
    };
</script>