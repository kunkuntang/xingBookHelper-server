<template>
  <div class="body">
      <Row :gutter="16">
            <Col span="18">
                <h2>通讯录</h2>
            </Col>
      </Row>
      <Row :gutter="16" class="row">
            <Col span="24">
                <Table :columns="phoneListColumns" :data="phoneListData"></Table>
            </Col>
      </Row>
  </div>
</template>

<script>
     import util from '@/libs/util.js'
     import { mapState } from 'vuex'
export default {
        data() {
            return {
                phoneListColumns: [
                    {
                        title: '名字',
                        key: 'stuName'
                    },
                    {
                        title: '学号',
                        key: 'stuNum'
                    },
                    {
                        title: '电话号码',
                        key: 'stuPhone'
                    }
                ],
                phoneListData: []
            };
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        beforeMount () {

        },
        mounted() {
            let belongMajorId = this.userInfo.belongMajorId
            let classNum = this.userInfo.belongClass
            util.ajax.get('/contactList?classNum=' + classNum + '&belongMajor=' + belongMajorId).then( ({data}) => {
                console.log(data)
                this.phoneListData = data.phoneList
            })
        },
        beforeDestroy() {

        },
        methods: {

        }
    };
</script>

<style scoped>
    .body{
        padding: 9px 25px 25px 25px;
    }
    .row {
        margin-top: 16px;
    }
</style>
