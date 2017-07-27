<template>
    <Row type="flex" justify="space-around" class="menu-panel">
        <Col :span="24">
        <Affix @on-change="fixChange">
            <Row type="flex" justify="space-around" class="downline">
                <Col :span="22">
                <Menu theme="light" :active-name="$route.path" :mode="mode" @on-select="onSelect">
                    <template v-for="menu in base.menus">
                        <Menu-item :name="menu.abbr" v-if="menu.children.length == 0">{{menu.name}}</Menu-item>
                        <Submenu :name="menu.abbr" v-else>
                            <template slot="title">{{menu.name}}</template>
                            <Menu-item :name="menuchild.abbr" v-for="menuchild in menu.children"
                                       :key="menuchild.abbr">{{menuchild.name}}
                            </Menu-item>
                        </Submenu>
                    </template>
                    <template v-if="!user.id">
                        <Menu-item name="/u/login" class="menu-right">登陆</Menu-item>
                        <Menu-item name="/u/register" class="menu-right">注册</Menu-item>
                    </template>
                    <template v-else>
                        <Menu-item name="/u/signout" class="menu-right">退出</Menu-item>
                        <Menu-item name="/manage" class="menu-right">后台管理</Menu-item>
                        <Menu-item :name="'/i/' + user.id" class="menu-right">{{user.nick}}</Menu-item>
                    </template>
                </Menu>
                </Col>
            </Row>
        </Affix>
        </Col>
    </Row>
</template>
<style>
    .menu-panel {
        height: 60px;
    }

    .sg-header {
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .25);
        padding: 0 5rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
    }

    .sg-header.fixed {
        z-index: 1;
        position: fixed;
        background-color: rgba(50, 64, 87, 0.84);
    }

    .ivu-menu-horizontal .ivu-menu-item.menu-right {
        float: right;
    }

    .downline:after{
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #dddee1;
        position: absolute;
        bottom: 0;
        left: 0;
    }
</style>
<script>
    import {mapState} from 'vuex';

    export default{
        name: 'sg-header',
        data(){
            return {
                fixed: false,
            };
        },
        props: {
            mode: {
                type: String,
                default: 'horizontal'
            }
        },
        methods: {
            fixChange: function (status) {
                this.fixed = status;
            },
            onSelect: function (name) {
                this.$router.push(name);
            }
        },
        computed: mapState({
            user: state => state.user,
            base: state => state.base
        }),
        created(){
        }
    };
</script>
