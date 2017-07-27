<template>
    <Menu :active-name="$route.path"  @on-select="onSelect">
        <Menu-item name="/manage">
            <Icon type="android-menu"></Icon>
            DashBoard
        </Menu-item>
        <Menu-item name="/manage/config">
            <Icon type="settings"></Icon>
            配置管理
        </Menu-item>
        <Menu-item name="/manage/topic">
            <Icon type="chatboxes"></Icon>
            主题管理
        </Menu-item>
    </Menu>
</template>
<style>
</style>
<script>
    export default{
        name: 'sg-back-menu',
        data: function () {
            return {
                path: '/'
            };
        },
        components: {},
        methods: {
            onSelect: function (name) {
                this.$router.push(name);
            }
        }
    };
</script>
