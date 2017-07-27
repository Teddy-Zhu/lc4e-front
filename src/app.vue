<style>
    [v-cloak] {
        display: none;
    }
</style>
<template>
    <router-view></router-view>
</template>

<script>
    import './common/base.css';
    import {mapActions, mapState} from 'vuex';

    export default {
        name: 'app',
        data () {
            return {};
        },
        computed: mapState({
            orders: state => state.order,
            user: state => state.user,
            base: state => state.base
        }),
        methods: {
            ...mapActions([
                'pullBaseInfo'
            ])
        },
        created () {
            this.pullBaseInfo(function (response) {
                if (response.data.result) {
                    document.title = response.data.data.SiteName;
                }
            })
        }
    };
</script>