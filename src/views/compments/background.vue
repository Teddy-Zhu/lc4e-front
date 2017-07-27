<template>
    <Row justify="center">
        <Col :span="24" class="header back">
            <div>{{base.siteName}} Control Center</div>
        </Col>
        <Col :span="4" class="back menu">
            <sg-back-menu></sg-back-menu>
        </Col>
        <Col :span="20">
            <slot></slot>
        </Col>
    </Row>
</template>
<style scoped>
    .back.menu {
        background: #eef1f6;
        min-height: 600px;
    }

    .back.header {
        height: 60px;
        color: white;
        background: #2196F3;
        width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
        padding: 15px 2em;
        font-size: x-large;
    }
</style>
<script>
    import BackMenu from '../background/menu.vue';
    import {mapState} from 'vuex';

    export default{
        name: 'sg-background',
        props: {},
        data () {
            return {
            };
        },
        computed: mapState({
            base: state => state.base
        }),
        components: {
            'sg-back-menu': BackMenu
        }
    };
</script>
