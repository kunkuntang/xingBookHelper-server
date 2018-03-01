<template>
    <div class="addBookListCon"> 
        <Row :gutter="16" class="row">
            <Col span="24">
            <label class="label-title">书单名：</label>
            </Col>
            <Col span="6">
            <Input v-model="bookListName" placeholder="请输入书单名" style="max-width: 300px;"></Input>
            </Col>
        </Row>
        <Row :gutter="16" class="row">
            <Col span="24">
            <label class="label-title">专业班级：</label>
            </Col>
            <Col span="6">
                <Select v-model="selectedAcaId" style="max-width: 300px;" clearable @on-change="getMajorFromAca">
                    <Option v-for="item in academyList" :value="item.academyId" :key="item.academyId">{{ item.academyName }}</Option>
                </Select>
            </Col>
            <Col span="6">
                <Select v-model="selectedMajId" style="max-width: 300px;" clearable>
                    <Option v-for="item in majorList" :value="item.majorId" :key="item.majorId">{{ item.majorName }}</Option>
                </Select>
            </Col>
        </Row>
        <Row :gutter="16" class="row">
            <Col span="24">
                <label class="label-title">包含书本：</label>
            </Col>
            <Form ref="formData" :model="formData" style="width: 900px;">
                <FormItem v-for="(item, index) in formData.items" :key="index" v-if="item.status">
                    <Col span="8">
                        <FormItem
                            :prop="'items.' + index + '.bookName'"
                            :rules="{required: true, message: '书名不能为空', trigger: 'blur'}">
                            <Input type="text" v-model="item.bookName" placeholder="输入书名"></Input>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                        <FormItem
                            :prop="'items.' + index + '.bookPrice'"
                            :rules="{required: true, message: '书本价格不能为空', trigger: 'blur'}">
                            <Input type="text" v-model="item.bookPrice" placeholder="输入书本价格"></Input>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="1">
                        <FormItem
                            :prop="'items.' + index + '.bookDisc'"
                            :rules="{required: true, message: '折扣不能为空', trigger: 'blur'}">
                            <Input type="text" v-model="item.bookDisc" placeholder="输入书本折扣"></Input>
                        </FormItem>
                    </Col>
                    <Col span="3" offset="1">
                        <Button type="ghost" @click="handleRemove(index)" v-if="index">删除书本</Button>
                    </Col>
                </FormItem>
                <FormItem>
                    <Col span="6">
                        <Button type="dashed" long @click="handleAdd" icon="plus-round">添加书本</Button>
                    </Col>
                </FormItem>
                <FormItem>
                    <Col span="24">
                        <Button type="primary" @click="handleSave('formData')">保存</Button>
                        <Button type="ghost" @click="handleReset('formData')" style="margin-left: 8px">重置</Button>
                        <Button type="ghost" @click="cancelSave()" style="margin-left: 8px">取消</Button>
                    </Col>
                </FormItem>
            </Form>
        </Row>            
    </div>
</template>
<script>
    import util from '@/libs/util.js'
    import { mapState, mapMutations } from 'vuex'
export default {
        data() {
            return {
                bookListName: '',
                academyList: [{ academyName: '暂无数据', academyId: ''}],
                selectedAcaId: '',
                majorList: [{ majorName: '暂无数据', majorId: ''}],
                selectedMajId: '',

                index: 1,
                formData: {
                    items: []
                },

                bookListId: ''
            };
        },
        computed: {
            ...mapState({
                academyArr: 'academyArr',
                majorArr: 'majorArr',
                bookListArr: 'bookListArr'
            })
        },
        beforeMount () {
            if (!this.bookListId) {
                this.bookListId = this.$route.query.bookListId
            }
            // util.ajax.get('/getBookListInfo?bookListId=' + this.bookListId).then(({data}) => {
            //     this.bookListName = data.bookListName
            //     this.selectedAcaId = data.belongAcaId
            //     this.selectedMajId = data.belongMajId
            // })
            util.ajax.get('/getBooks?bookListId=' + this.bookListId).then(({data}) => {
                console.log(data)
                let bookListName, belongAcaName, belongAcaId, belongMajName, belongMajId
                let tempData = []
                data.forEach(el => {
                    bookListName = el.belongBookList.bookListName
                    belongMajName = el.belongBookList.belongMajor.majorName
                    belongMajId = el.belongBookList.belongMajor.objectId
                    belongAcaName = el.belongBookList.belongMajor.belongAcademy.academyName
                    belongAcaId = el.belongBookList.belongMajor.belongAcademy.objectId
                    tempData.push({
                        bookId: el.objectId,
                        bookName: el.bookName,
                        bookPrice: el.bookPrice,
                        bookDisc: el.bookDisc,
                        bookId: el.objectId,
                        index: 1,
                        status: 1
                    })
                });
                this.formData.items = tempData
                this.bookListName = bookListName
                this.belongAcaName = belongAcaName
                this.belongMajName = belongMajName
                this.selectedAcaId = belongAcaId
                this.selectedMajId = belongMajId
            })
            if (this.academyArr.length) {
                this.academyList = this.academyArr
            } else {
                util.ajax.get('getAcademyList').then((results) => {
                    let tempArr = []
                    let data = results.data
                    let len = data.length
                        console.log(data)
                    
                    for (var i = 0; i < len; i++) {
                        console.log(data[i])
                        tempArr.push({
                            academyName: data[i].academyName,
                            academyId: data[i].objectId
                        })
                    }
                    this.academyList = tempArr
                }).catch((err)=> {
                    console.log(err)
                })
            }
            // util.ajax.post('/addBookList', { bookListData: })
        },
        beforeDestroy() {

        },
        methods: {
            getMajorFromAca() {
                console.log('triggle by select change')
                console.log(this.selectedAcaId)
                util.ajax.get('getMajorFromAca', {params: {selectedAcaId: this.selectedAcaId}}).then((results) => {
                    let tempArr = []
                    let data = results.data
                    let len = data.length
                    console.log(data)
                    for (var i = 0; i < len; i++) {
                        console.log(data[i])
                        tempArr.push({
                            majorName: data[i].majorName,
                            majorId: data[i].objectId
                        })
                    }
                    this.majorList = tempArr
                }).catch((err)=> {
                    console.log(err)
                })
            },
            handleSave (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let selectedAcaName = ''
                        let selectedMajName = ''
                        let bookListId = this.bookListId
                        this.majorList.forEach(element => {
                            if (this.selectedMajId == element.majorId) {
                                selectedMajName = element.majorName
                            }
                        });
                        this.academyList.forEach(element => {
                            if (this.selectedAcaId == element.academyId) {
                                selectedAcaName = element.academyName
                            }
                        });
                        let newBookListData = {
                            bookListName: this.bookListName,
                            belongAcaName: selectedAcaName,                            
                            belongAcaId: this.selectedAcaId,
                            belongMajName: selectedMajName,                            
                            belongMajId: this.selectedMajId,                            
                            belongMajName: selectedMajName,
                            containBooks: this.formData.items,
                        }
                        console.log(newBookListData)
                        util.ajax.post('/updateBookList', { bookListId: bookListId, newBookListData: newBookListData}).then((results) => {
                            this.resetForm()
                            this.$Message.success(results.data.mes);
                            this.bookListArr.forEach((ele) => {
                                if (bookListId == ele.objectId) {
                                    ele.bookListName = this.bookListName
                                    ele.belongMajId = this.selectedMajId
                                    ele.belongMajName = selectedMajName
                                    ele.belongAcaId = this.selectedAcaId
                                    ele.belongAcaName = selectedAcaName
                                }
                            })
                            this.cancelSave()
                        }).catch((err) => {
                            console.log(err)
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd () {
                this.index++;
                this.formData.items.push({
                            bookName: '',
                            bookPrice: '',
                            bookDisc: '',
                            index: 1,
                            status: 2
                        });
            },
            handleRemove (index) {
                // this.formData.items.splice(index, 1);
                this.formData.items[index].status = 0
            },
            resetForm () {
                this.bookListName = ''
                this.selectedAcaId = '',
                this.selectedMajId = '',
                this.handleReset('formData')
            },
            cancelSave () {
                // this.$emit('changeView', 'checkBookList')
                this.$router.go(-1)
            },
            ...mapMutations({
                updateBookListArr: 'updateBookListArr'
            })
        }
    };
</script>
<style scoped>
.label-title {
    font-size: 18px;
}
    .row{
        margin-top: 16px;
    }
    .addBookListCon {
        padding: 9px 25px 25px 25px;
    }
    .table-con{
        margin: 16px 0;
    }
</style>

