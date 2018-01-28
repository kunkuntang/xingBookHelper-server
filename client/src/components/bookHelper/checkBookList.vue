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
                <h2 class="billSumPrice">共计：￥2000</h2>
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
                    }
                ],
                bookListData: [],
                bookListName: '',
                belongAcaName: '',
                belongAcaId: '',
                belongMajName: '',
                belongMajId: '',
                bookListId: ''
            }
        },
        computed: {
            ...mapState({
                bookListArr: 'bookListArr'
            })
        },
        beforeMount () {
            let bookListId =  this.bookListId = this.$route.query.bookListId
            console.log(bookListId)
            util.ajax.get('/getBooks?bookListId=' + bookListId).then((results) => {
                console.log(results)
                let tempObj = []
                results.data.forEach(element => {
                    this.bookListData.push({
                        bookName: element.bookName,
                        bookPrice: element.bookPrice,
                        bookDisc: element.bookDisc,
                        discPrice: element.bookPrice * element.bookDisc * 0.1
                    })
                    console.log(this.bookListData)
                });
            })
            this.showBookListTitle()
        },
        methods: {
            showBookListTitle () {
                let bookListId = this.bookListId
                this.bookListArr.forEach(element => {
                    if (element.objectId == bookListId ) {
                        this.bookListName = element.bookListName
                        this.belongAcaName = element.belongAcaName
                        this.belongAcaId = element.belongAcaId
                        this.belongMajName = element.belongMajName
                        this.belongMajId = element.belongMajId
                    }
                });
            },
            editBookList () {
                this.$router.push({ path: '/editBookList', query: { bookListId: this.bookListId} })
                // this.$emit('changeView', 'editBookList', bookListData)
            },
            cancelEditBookList() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style scoped>
.content{
    padding: 16px;
}
.row {
    margin-top: 16px;
}
.billSumPrice {
    margin: 16px 16px 0 0;
    text-align: right;
}
</style>

