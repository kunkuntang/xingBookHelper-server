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
                <FormItem v-for="(item, index) in formData.items" :key="index">
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
                    <Col span="3" offset="1" v-if="index">
                        <Button type="ghost" @click="handleRemove(index)">删除书本</Button>
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
    import { mapState } from 'vuex'
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
                    items: [
                        {
                            value: '',
                            bookName: '',
                            bookPrice: '',
                            bookDisc: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
                // formRules: {
                //     items: {
                //         type: "array", required: true, len: 3,
                //         fields: {
                //             bookName: {required: true, message: '书名不能为空', trigger: 'blur'},
                //             bookPrice: {required: true, message: '书本价格不能为空', trigger: 'blur'},
                //             bookDisc: {required: true, message: '折扣不能为空', trigger: 'blur'},
                //         }
                //     }
                // }
            };
        },
        computed: {
            ...mapState({
                academyArr: 'academyArr',
                majorArr: 'majorArr',
                userInfo: 'userInfo'
            })
        },
        beforeMount () {
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
            // util.ajax.post('/addBookList', { bookListData: })
        },
        mounted() {

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
                            containBooks: this.formData.items,
                            belongUserId: this.userInfo.userId
                        }
                        console.log(newBookListData)
                        util.ajax.post('/addBookList', { newBookListData: newBookListData}).then((results) => {
                            this.resetForm()
                            this.$Message.success(results.data.mes);
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
                            status: 1
                        });
            },
            handleRemove (index) {
                this.formData.items.splice(index, 1);
            },
            resetForm () {
                this.bookListName = ''
                this.selectedAcaId = '',
                this.selectedMajId = '',
                this.handleReset('formData')
            },
            cancelSave () {
                // this.$emit('changeView', 'showAllBookList')
                this.$router.go(-1)
            }
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

