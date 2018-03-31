<template>
    <div class="content">
        <Row :gutter="16" class="row">
            <Col span="18">
                <h2>书单名：{{bookListName}}</h2>
            </Col>
            <Col span="5" >
                <Button type="ghost" size="small" @click="cancelEditBookList" style="float: right;">返回</Button>
                <Button type="primary" size="small" @click="editBookList" style="float: right; margin-right: 16px;">编辑书单</Button>
            </Col>  
            <Col span="24">
                <h4>{{belongAcaName}} - {{belongMajName}}</h4>
            </Col>
        </Row>
        <Row :gutter="16" class="row">
            <Col span="24">
                <Table :columns="bookListColumns" :data="bookListData"></Table>
            </Col>
        </Row>

        <Row>
            <Col span="6" offset="18">
                <h2 class="billSumPrice">共计：￥{{billSumPrice}}</h2>
            </Col>
        </Row>
        
        <Row :gutter="16"  class="row">
            <Col span="24">
                <h2>班里个人购买情况</h2>                
            </Col>
        </Row>
        <Row :gutter="16"  class="row">
            <Col span="4">
                <Select v-model="searchOpt" style="width:150px">
                    <Option v-for="item in searchOptArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col span="6">
                <AutoComplete
                    v-model="searchTxt"
                    icon="ios-search"
                    :data="autoComData"
                    placeholder="input here">
                </AutoComplete>
            </Col>
            <Col span="4"> 
                <Button type="primary" @click="searchStuBillInfo">搜索</Button>                
            </Col>
        </Row>
        <Row :gutter="16" class="row">
            <Col span="24">
                <Table :columns="personBookListColumns" :data="personBookListData"></Table>
            </Col>
            <Col span="6" offset="18">
                <h2 class="billSumPrice">应付：￥{{perSumPrice}}</h2>
            </Col>
        </Row>
    </div>
</template>
<script>
    import util from '@/libs/util.js'
    import { mapState } from 'vuex'

    export default {
        data () {
            return {
                bookListName: '',
                belongAcaName: '',
                belongAcaId: '',
                belongMajName: '',
                belongMajId: '',
                bookListId: '',
                curSearhStuId: '',
                
                bookListColumns: [
                    {
                        title: '书名',
                        key: 'bookName'
                    },
                    {
                        title: '价格(元)',
                        key: 'bookPrice'
                    },
                    {
                        title: '折扣',
                        key: 'bookDisc'
                    },
                    {
                        title: '折后价格(元)',
                        key: 'discPrice'
                    },
                    {
                        title: '购买人数',
                        key: 'buyCount'
                    }
                ],
                bookListData: [],

                searchOpt: '',
                searchOptArr: [{
                    label: '根据学号搜索',
                    value: 1
                }, {
                    label: '根据姓名搜索',
                    value: 2
                }, {
                    label: '根据手机号搜索',
                    value: 3
                }],
                searchTxt: '',
                autoComData: [],

                personBookListColumns: [
                    {
                        title: '书名',
                        key: 'bookName'
                    },
                    {
                        title: '价格(元)',
                        key: 'bookPrice'
                    }
                ],
                personBookListData: [],
                perSumPrice: 0
            }
        },
        computed: {
            ...mapState({
                bookListArr: 'bookListArr'
            }),
            billSumPrice: function() {
                let sumPrice = 0
                this.bookListData.forEach((books) => {
                    sumPrice += books.discPrice
                })
                return sumPrice
            }
        },
        watch: {
            searchOpt: function(val) {
                console.log('computed', val)
                let storeUserByName = []
                this.autoComData = []
                switch (val) {
                    // 学号
                    case 1:
                        this.userInfos.forEach(userInfo => {
                            this.autoComData.push(userInfo.stuNum)
                        })
                        break;
                    // 姓名
                    case 2: 
                        this.userInfos.forEach(userInfo => {
                            this.autoComData.push(userInfo.stuName)
                        })
                        break;
                    // 手机
                    case 3: 
                        this.userInfos.forEach(userInfo => {
                            this.autoComData.push(userInfo.stuPhone)
                        })
                        break;
                }
                this.searchTxt = ''
            }
        },
        beforeMount () {
            let bookListId =  this.bookListId = this.$route.query.bookListId
            let bookListName, belongAcaName, belongAcaId, belongMajName, belongMajId
            util.ajax.get('/getBooks?bookListId=' + bookListId).then((results) => {
                let tempObj = []
                results.data.forEach(element => {
                    console.log('belongMajor', element.belongBookList.belongMajor)
                    bookListName = element.belongBookList.bookListName
                    belongMajName = element.belongBookList.belongMajor.majorName
                    belongMajId = element.belongBookList.belongMajor.objectId
                    belongAcaName = element.belongBookList.belongMajor.belongAcademy.academyName
                    this.bookListData.push({
                        bookName: element.bookName,
                        bookPrice: element.bookPrice,
                        bookDisc: element.bookDisc,
                        buyCount: element.buyCount,
                        discPrice: element.bookPrice * element.bookDisc * 0.1
                    })
                });
                this.bookListName = bookListName
                this.belongAcaName = belongAcaName
                this.belongMajName = belongMajName
                this.belongMajId = belongMajId

                let tempUserInfos = []
                util.ajax.get('/getContactInfo?belongMajId=' + belongMajId).then((results) => {
                    results.data.forEach((result) => {
                        tempUserInfos.push({
                            stuName: result.stuName,
                            stuNum: result.stuNum,
                            stuPhone: result.stuPhone,
                            id: result.objectId
                        })
                    })
                })
                this.userInfos = tempUserInfos
            })
        },
        methods: {
            editBookList () {
                this.$router.push({ path: '/editBookList', query: { bookListId: this.bookListId} })
                // this.$emit('changeView', 'editBookList', bookListData)
            },
            cancelEditBookList() {
                this.$router.go(-1)
            },
            searchStuBillInfo () {
                util.ajax.get('getSearchStuInfo?stuId=' + this.curSearhStuId + '&bookListId=' + this.bookListId).then(({status, data}) => {
                    console.log(data)
                    if (status) {
                        console.log( data.containBooks)
                        this.personBookListData = JSON.parse(data.containBooks)
                        this.perSumPrice = data.sumPrice
                    }
                }).catch(err => {
                    console.log(err)
                    this.$Message.info('获取书单信息失败');
                })
            }
        }
    }
</script>

<style scoped>
.content{
    padding: 25px;
}
.row {
    margin-top: 16px;
}
.billSumPrice {
    margin: 16px 16px 0 0;
    text-align: right;
}
</style>

