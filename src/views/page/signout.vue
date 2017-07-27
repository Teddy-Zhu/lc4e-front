<template>
</template>
<style>
</style>
<script>
    import {mapActions} from 'vuex'

    export default{
        data(){
            return {}
        },
        created(){
            const that = this;
            this.logout(function (response) {
                that.$Notice.success({
                    title: '退出成功',
                    desc: '您已成功退出'
                });
                that.$router.push('/')
            });
        },
        methods: {
            ...mapActions(['logout'])
        }
    }
</script>
