<template>
    <div class="topicNav">
        <a :class="getClz(nav)" @click="itemClick(nav)" href="javascript:void(0);" v-for="nav in navs">{{nav.title}}</a>
    </div>
</template>

<style>
    .topicNav {
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 600px;
        width: 100%;
    }

    .topicNav a.active {
        border-left: 2px solid;
        color: black;
        background: aliceblue;
    }

    .topicNav a {
        text-overflow: ellipsis;
        white-space: nowrap;
        border-left: 2px solid transparent;
        display: inline-block;
        width: 100%;
        border-bottom: 1px dashed;
        font-size: 1.8em;
        color: grey;
    }

    .topicNav a.h1 {
        padding-left: .5em;
    }

    .topicNav a.h2 {
        padding-left: 1em;
    }

    .topicNav a.h3 {
        padding-left: 1.5em;

    }

    .topicNav a.h4 {
        padding-left: 2em;

    }

    .topicNav a.h5 {
        padding-left: 2.5em;

    }

    .topicNav a.h6 {
        padding-left: 3em;
    }

</style>

<script>
    export default{
        name: 'topic-nav',
        props: {
            navs: {
                type: Array,
                required: true
            },
            activeName: {
                type: String,
                default: ''
            }
        },
        methods: {
            getClz(nav){
                return nav.clz + ' ' + (nav === this.active ? 'active' : '');
            },
            itemClick(nav){
                this.active = nav;
                this.$emit('nav-click', nav);
            }
        },
        created(){
            this.active = this.activeName;
        },
        data(){
            return {
                active: undefined
            };
        }
    };
</script>