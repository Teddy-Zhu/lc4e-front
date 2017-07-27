<template>
    <Row>
        <Col :span="24">
        <sg-header></sg-header>
        <Row type="flex" justify="center" class="sg-body">
            <Col :span="col">
            <slot></slot>
            </Col>
        </Row>
        <sg-footer></sg-footer>
        </Col>
    </Row>
</template>
<style>
    .sg-body {
        margin-top: 10px;
    }

</style>
<script>
    import Header from './header.vue';
    import Footer from './footer.vue';
    export default{
        name: 'sg-body',
        props: {
            col: {
                type: Number,
                default: 22
            }
        },
        data () {
            return {};
        },
        components: {
            'sg-header': Header,
            'sg-footer': Footer
        }
    }
</script>
