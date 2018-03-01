<template>
    <div>
        <div v-if="bookListArr.length">
            <Row :gutter="16" style="padding: 9px 25px 25px 25px">
                <Col span="24" style="margin-top: 16px">
                    <Button type="primary" size="small" @click="addBookList">添加书单</Button>
                </Col>                
                <Col span="6" v-for="(item, index) in bookListArr" :key="index" style="margin-top: 16px; cursor: pointer;">
                    <div @click="checkBookList(item.objectId, item.bookListName)">
                        <Card>
                            <p slot="title">{{item.bookListName}}</p>
                             <a href="#" style="padding: 5px 0px 5px 5px; cursor: pointer;" slot="extra" @click.stop.prevent="shareBookList(item.objectId)">
                                <Icon type="android-share-alt"></Icon>
                                Share
                            </a>
                            <p>专业：{{item.belongMajor.belongAcademy.academyName}} - {{item.belongMajor.majorName}}</p>
                            <p>时间：{{showBookTime(item.updatedAt)}}</p>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
        <div v-else>
            <div class="addBookCon">
                <div class="tips">暂无书单，请添加</div>
                <Button type="primary" size="small" @click="addBookList">添加书单</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import util from '@/libs/util.js'
    import { mapState, mapMutations } from 'vuex'
export default {
        data() {
            return {
            };
        },
        computed: {
            ...mapState({
                bookListArr: 'bookListArr'
            })
        },
        beforeMount () {
            util.ajax.get('/getBookLists').then((result) => {
                console.log(result)
                this.updateBookListArr(result.data)
            })
        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {
            ...mapMutations([
                'updateBookListArr',
                'updateBookListId',
                'updateBookListName'
            ]),
            addBookList(){
                // this.$emit('changeView', 'addBookList')
                this.$router.push({ path: '/addBookList' })
            },
            showBookTime(time) {
                if (typeof time == 'string') {
                    return time.split(' ')[0]
                }
            },
            checkBookList(bookListId, bookListName) {
                console.log(bookListId)
                // this.$emit('changeView', 'checkBookList', bookListName)
                this.updateBookListId(bookListId)
                this.$router.push({ path: '/checkBookList', query: { bookListId: bookListId}})
            },
            shareBookList(bookListId) {
                console.log(bookListId)
                this.$Modal.confirm({
                    render: (h) => {
                        return h('div', {}, [
                            h('h2', {}, '复制以下书单ID到小程序里使用'),
                            h('h1', {
                                attrs: {
                                    style: 'margin: 16px 0 0 16px;'
                                }
                            }, bookListId)
                        ])
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .addBookCon{
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

</style>

