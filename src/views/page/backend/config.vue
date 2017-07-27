<template>
    <sg-background>
        <Row type="flex" class="backHeader" justify="space-between" align="middle">
            <Col :span="14">
            <Breadcrumb separator="/">
                <Breadcrumb-item href="/manage">Dashboard</Breadcrumb-item>
                <Breadcrumb-item href="/manage/config">配置管理</Breadcrumb-item>
            </Breadcrumb>
            </Col>
            <Col :span="5" class="right">
            <Button v-show="!isGroup" @click="addConfigModel">添加配置项</Button>
            <Button v-show="isGroup" @click="addConfigGroupModel">添加配置组</Button>
            <Button @click="switchUI" v-show="!isGroup">管理配置组</Button>
            <Button @click="switchUI" v-show="isGroup">管理配置项</Button>
            </Col>
        </Row>
        <Row type="flex" class="backHeader" justify="space-between" :gutter="16" align="middle">
            <Col :span="3">
            <Select v-model="groupId" placeholder="配置组" v-show="!isGroup">
                <Option
                        v-for="item in groupList"
                        :key="item.id"
                        :value="item.id">{{item.name}}
                </Option>
            </Select>
            </Col>
            <Col :span="15">
            <Button v-show="!isGroup && tableInitHasSelect" type="error" size="small"
                    @click="batchDeleteConfig(tableInit.selection)">删除
            </Button>
            <Button v-show="isGroup && tableGroupInitHasSelect" type="error" size="small"
                    @click="batchDeleteGroupConfig(tableGroupInit.selection)">删除
            </Button>
            </Col>
            <Col :span="6" class="right">
            <Page class="inline-block" :total="tableInit.total" size="small" show-elevator
                  @on-change="pageChange" v-show="!isGroup" :page-size="tableInit.size"></Page>

            <Page class="inline-block" :total="tableGroupInit.total" size="small" show-elevator
                  @on-change="groupPageChange" v-show="isGroup" :page-size="tableGroupInit.size"></Page>
            </Col>
        </Row>
        <Row v-if="!isGroup">
            <Col :span="24">
            <Table border stripe
                   :columns="tableInit.columns"
                   :data="tableInit.data" @on-selection-change="tableSelectChange"
                   style="width: 100%">
            </Table>
            </Col>
        </Row>
        <Row v-if="isGroup">
            <Col :span="24">
            <Table border stripe
                   :columns="tableGroupInit.columns"
                   :data="tableGroupInit.data" @on-selection-change="tableGroupSelectChange"
                   style="width: 100%">
            </Table>
            </Col>
        </Row>

        <Modal v-model="tableInit.model" :mask-closable="false" :ok-text="tableInitOkText" :title="tableInitTitle"
               @on-ok="configModelSubmit" :loading="tableInit.formLoading">
            <Form ref="config" :model="tableInit.formModel" :label-width="80">
                <Form-item label="配置名称" prop="name">
                    <Input v-model="tableInit.formModel.name" placeholder="请输入配置名称"></Input>
                </Form-item>
                <Form-item label="值" prop="value">
                    <Input v-model="tableInit.formModel.value" placeholder="请输入值"></Input>
                </Form-item>
                <Form-item label="配置组" prop="groupId">
                    <Select v-model="tableInit.formModel.groupId" placeholder="配置组">
                        <Option
                                v-for="item in groupFilterList"
                                :key="item.id"
                                :value="item.id">{{item.name}}
                        </Option>
                    </Select>
                </Form-item>
                <Form-item label="错误信息" prop="error">
                    <Input v-model="tableInit.formModel.error" placeholder="请错误信息"></Input>
                </Form-item>
                <Form-item label="描述" prop="description">
                    <Input v-model="tableInit.formModel.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                           placeholder="请输入简单描述..."></Input>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="tableGroupInit.model" :mask-closable="false"
               :ok-text="tableGroupInitOkText" :title="tableGroupInitTitle"
               @on-ok="configGroupModelSubmit" :loading="tableGroupInit.formLoading">
            <Form ref="configGroup" :model="tableGroupInit.formModel" :label-width="80">
                <Form-item label="配置组缩写" prop="abbr">
                    <Input v-model="tableGroupInit.formModel.abbr" placeholder="请输入配置组缩写"></Input>
                </Form-item>
                <Form-item label="配置组名称" prop="name">
                    <Input v-model="tableGroupInit.formModel.name" placeholder="请输入配置组名称"></Input>
                </Form-item>
            </Form>
        </Modal>
    </sg-background>
</template>
<style>
    .backHeader {
        padding: 1rem 1rem;
    }
</style>
<script>
    import BackGround from '../../compments/background.vue';
    import {mapState, mapActions} from 'vuex';
    import Api from '../../../libs/api';


    export default{
        data(){
            return {
                groupId: '',
                groupList: [],
                isGroup: false,
                tableGroupInit: {
                    size: 10,
                    page: 1,
                    total: 0,
                    data: [],
                    selection: [],
                    model: undefined,
                    formLoading: false,
                    operateType: 'new', // new or edit
                    formRule: {
                        abbr: {required: true},
                        name: {required: true}
                    },
                    formModel: {
                        id: '',
                        abbr: '',
                        name: ''
                    },
                    columns: [
                        {
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: '缩写',
                            key: 'abbr'
                        }, {
                            title: '名称',
                            key: 'name'
                        }, {
                            title: '创建时间',
                            key: 'createTime',
                            render: (h, params) => {
                                return h('div', this.datetimeFmt(params.row[params.column.key]));
                            }
                        }, {
                            title: '操作',
                            key: 'action',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editConfigGroupModel(params.row);
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteConfigGroup(params.row.id);
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }]
                },
                tableInit: {
                    size: 10,
                    page: 1,
                    total: 0,
                    data: [],
                    selection: [],
                    formLoading: false,
                    model: undefined,
                    operateType: 'new', // new or edit
                    formRule: {
                        value: {
                            required: true
                        },
                        groupId: {
                            required: true
                        },
                        name: {
                            required: true
                        }
                    },
                    formModel: {
                        id: '',
                        name: '',
                        value: '',
                        groupId: '',
                        error: '',
                        description: ''
                    },
                    columns: [
                        {
                            type: 'selection',
                            width: 60,
                            align: 'center'
                        },
                        {
                            title: '配置名称',
                            key: 'name'
                        }, {
                            title: '值',
                            key: 'value'
                        }, {
                            title: '组名称',
                            key: 'groupName'
                        }, {
                            title: '错误信息',
                            key: 'error'
                        }, {
                            title: '描述',
                            key: 'description'
                        }, {
                            title: '创建时间',
                            key: 'createTime',
                            render: (h, params) => {
                                return h('div', this.datetimeFmt(params.row[params.column.key]));
                            }
                        }, {
                            title: '操作',
                            key: 'action',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.editConfigModel(params.row);
                                            }
                                        }
                                    }, '编辑'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteConfig(params.row.id);
                                            }
                                        }
                                    }, '删除')
                                ]);
                            }
                        }
                    ]
                }
            };
        },
        computed: {
            configTypeIsNew(){
                return this.tableInit.operateType === 'new';
            },
            groupConfigIsNew(){
                return this.tableGroupInit.operateType === 'new';
            },
            tableGroupInitOkText(){
                return this.configTypeIsNew ? this.$t('backend.configGroup.addConfigModel.submitButton') : this.$t('backend.configGroup.editConfigModel.submitButton');
            },
            tableGroupInitTitle(){
                return this.configTypeIsNew ? this.$t('backend.configGroup.addConfigModel.title') : this.$t('backend.configGroup.editConfigModel.title');
            },
            tableInitOkText(){
                return this.configTypeIsNew ? this.$t('backend.config.addConfigModel.submitButton') : this.$t('backend.config.editConfigModel.submitButton');
            },
            tableInitTitle(){
                return this.configTypeIsNew ? this.$t('backend.config.addConfigModel.title') : this.$t('backend.config.editConfigModel.title');
            },
            groupFilterList(){
                return this.groupList.filter(function (item) {
                    return !!item.id;
                });
            },
            tableInitHasSelect(){
                return this.tableInit.selection.length > 0;
            },
            tableGroupInitHasSelect(){
                return this.tableGroupInit.selection.length > 0;
            }
        },
        created () {
            this.getGroup(this);
            this.getData();
        },
        watch: {
            'tableInit.page'(val, OldVal){
                if (val !== OldVal)
                    this.getData();
            },
            'tableGroupInit.page'(val, OldVal){
                if (val !== OldVal)
                    this.getData();
            },
            groupId(val, OldVal){
                if (val !== OldVal)
                    this.getData();
            },
            isGroup(val, OldVal){
                if (val !== OldVal) {
                    if (val) {
                        if (this.tableGroupInit.page == 1) {
                            this.getData();
                        } else {
                            this.tableGroupInit.page = 1;
                        }
                    } else {
                        if (this.tableInit.page == 1) {
                            this.getData();
                        } else {
                            this.tableInit.page = 1;
                        }
                    }
                }

            }
        },
        methods: {
            deleteConfigGroup: function (id) {
                if (id) {
                    const that = this;
                    this.$util.ajax.post(Api.manage.configGroup.delete, {id: id}).then(function (response) {
                        const data = response.data;
                        if (data.result) {
                            that.$Message.success(that.$t('backend.configGroup.deleteSuccessInfo'));
                            that.getData();
                        } else {
                            that.$Message.error(data.message);
                        }
                    });
                }
            },
            batchDeleteGroupConfig: function (ids) {
                if (ids.length === 0) return;
                let idlist = [];
                for (let i = 0, len = ids.length; i < len; i++) {
                    idlist.push(ids[i].id);
                }
                const that = this;
                this.$util.ajax.post(Api.manage.configGroup.batchDelete, idlist).then(function (response) {
                    const data = response.data;
                    if (data.result) {
                        that.$Message.success(that.$t('backend.configGroup.deleteSuccessInfo'));
                        that.getData();
                    } else {
                        that.$Message.error(data.message);
                    }
                });
            },
            deleteConfig: function (id) {
                if (id) {
                    const that = this;
                    this.$util.ajax.post(Api.manage.config.delete, {id: id}).then(function (response) {
                        const data = response.data;
                        if (data.result) {
                            that.$Message.success(that.$t('backend.config.deleteSuccessInfo'));
                            that.getData();
                        } else {
                            that.$Message.error(data.message);
                        }
                    });
                }
            },
            batchDeleteConfig: function (ids) {
                if (ids.length === 0) return;
                let idlist = [];
                for (let i = 0, len = ids.length; i < len; i++) {
                    idlist.push(ids[i].id);
                }
                const that = this;
                this.$util.ajax.post(Api.manage.config.batchDelete, idlist).then(function (response) {
                    const data = response.data;
                    if (data.result) {
                        that.$Message.success(that.$t('backend.config.deleteSuccessInfo'));
                        that.getData();
                    } else {
                        that.$Message.error(data.message);
                    }
                });
            },
            pageChange: function (page) {
                this.tableInit.page = page;
            },
            groupPageChange: function (page) {
                this.tableGroupInit.page = page;
            },
            datetimeFmt: function (data) {
                return this.$util.fmt('yyyy-MM-dd hh:mm:ss', new Date(data));
            },
            switchUI: function () {
                this.isGroup = !this.isGroup;
            },
            getBaseTable: function (that, url, ajaxData, type) {
                that.$util.ajax.post(url, ajaxData).then(function (response) {
                    let data = response.data;
                    if (data.result) {
                        that[type].data = data.data.pageList.result;
                        that[type].page = data.data.pageList.pageNumber;
                        that[type].total = data.data.pageList.totalCount;
                        that[type].size = data.data.pageList.pageSize;
                    } else {
                        that.$Message.error(that.$util.truncate(data.message, 40, '...'));
                    }
                });
            },
            getGroup: function (that) {
                that.$util.ajax.post(Api.manage.configGroup.all).then(function (response) {
                    let data = response.data;
                    if (data.result) {
                        data.data.list.splice(0, 0, {
                            name: that.$t('backend.config.allConfigName'),
                            abbr: '',
                            id: ''
                        });
                        that.groupList = data.data.list;
                    }
                });
            },
            getData () {
                if (this.isGroup) {
                    this.getBaseTable(this, Api.manage.configGroup.query, {
                        pageNum: this.tableGroupInit.page,
                        pageSize: this.tableGroupInit.size
                    }, 'tableGroupInit');
                } else {
                    this.getBaseTable(this, Api.manage.config.query, {
                        pageNum: this.tableInit.page,
                        pageSize: this.tableInit.size,
                        groupId: this.groupId
                    }, 'tableInit');
                }
            },
            tableSelectChange(selection){
                this.tableInit.selection = selection;
            },
            tableGroupSelectChange(selection){
                this.tableGroupInit.selection = selection;
            },
            editConfigModel(row){
                this.tableInit.operateType = 'edit';
                Object.assign(this.tableInit.formModel, row);
                this.tableInit.model = true;
            },
            addConfigModel(){
                this.tableInit.operateType = 'new';
                this.$refs['config'].resetFields();
                this.tableInit.model = true;
            },
            editConfigGroupModel(row){
                this.tableGroupInit.operateType = 'edit';
                Object.assign(this.tableGroupInit.formModel, row);
                this.tableGroupInit.model = true;
            },
            addConfigGroupModel(){
                this.tableGroupInit.operateType = 'new';
                this.$refs['configGroup'].resetFields();
                this.tableGroupInit.model = true;
            },
            configGroupModelSubmit(){
                const url = this.groupConfigIsNew ? Api.manage.configGroup.add : Api.manage.configGroup.edit,
                    that = this,
                    localeString = this.groupConfigIsNew ? 'addConfigModel' : 'editConfigModel';

                this.tableInit.formLoading = true;

                this.$refs['config'].validate((valid) => {
                    if (valid) {
                        this.$util.ajax.post(url, this.tableGroupInit.formModel)
                            .then(function (response) {
                                let data = response.data;
                                if (data.result) {
                                    that.$Message.success(that.$t('backend.configGroup.' + localeString + '.successInfo'));
                                    that.tableGroupInit.formLoading = false;
                                    that.tableGroupInit.model = false;
                                    that.getData();
                                    that.getGroup(that);
                                } else {
                                    that.$Message.error(data.message);
                                }
                            })
                            .catch(function (error) {
                                that.$Message.error(error);
                                that.tableGroupInit.formLoading = false;
                            });
                    } else {
                        this.$Message.error('请完善数据!');
                    }
                });
            },
            configModelSubmit(){
                const url = this.configTypeIsNew ? Api.manage.config.add : Api.manage.config.edit,
                    that = this,
                    localeString = this.configTypeIsNew ? 'addConfigModel' : 'editConfigModel';

                this.tableInit.formLoading = true;

                this.$refs['config'].validate((valid) => {
                    if (valid) {
                        this.$util.ajax.post(url, this.tableInit.formModel)
                            .then(function (response) {
                                let data = response.data;
                                if (data.result) {
                                    that.$Message.success(that.$t('backend.config.' + localeString + '.successInfo'));
                                    that.tableInit.formLoading = false;
                                    that.tableInit.model = false;
                                    that.getData();
                                } else {
                                    that.$Message.error(data.message);
                                }
                            })
                            .catch(function (error) {
                                that.$Message.error(error);
                                that.tableInit.formLoading = false;
                            });
                    } else {
                        this.$Message.error('请完善数据!');
                    }
                });

            }
        },
        components: {
            'sg-background': BackGround
        }
    };
</script>
