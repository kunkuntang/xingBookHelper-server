<style>
.title {
    font-size: 18px;
    margin: 5px 0 20px 16px;
    padding-right: 10px;
    border-bottom: 3px solid #2d8cf0;
    display: inline-block;
}
</style>

<template>
  <div style="margin: 20px 16px;">
      <div>
        <span class="title">基本信息</span>
      </div>
      <Form :model="baseInfoForm" :label-width="80">
        <Row :gutter=16>
          <Col :span="8">
            <FormItem label="姓名">
                <Input v-model="baseInfoForm.stuName" placeholder="请输入姓名"></Input>
            </FormItem>
            <FormItem label="学号">
                <Input v-model="baseInfoForm.stuNum" placeholder="请输入学号"></Input>
            </FormItem>
            <FormItem label="手机">
                <Input v-model="baseInfoForm.stuPhone" placeholder="请输入手机"></Input>
            </FormItem>
            <FormItem label="短号">
                <Input v-model="baseInfoForm.stuShortPhone" placeholder="请输入短号"></Input>
            </FormItem>
          </Col>
          <Col :span="8" :offset="1">
            <FormItem label="学院">
                <Select v-model="baseInfoForm.belongAcademyId" clearable @on-change="getMajorFromAca">
                    <Option :value="item.academyId" v-for="(item, index) in academyList" :key="index">{{item.academyName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="专业">
                <Select v-model="baseInfoForm.belongMajorId" clearable>
                  <Option :value="item.majorId" v-for="(item, index) in majorList" :key="index">{{item.majorName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="班级">
                <Input v-model="belongClass" placeholder="请输入班级" disabled></Input>
            </FormItem>
            <FormItem label="公开手机号">
              <i-switch v-model="baseInfoForm.allowShowPhone" size="large">
                  <span slot="open">On</span>
                  <span slot="close">Off</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="17">
            <FormItem>
              <Button type="primary" style="float: right" @click="saveBaseInfo">保存</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Form :model="scopeSettingForm" :label-width="80">
        <div>
          <span class="title">权限信息</span>
        </div>
        <Row :gutter="16">
          <Col :span="8">
            <FormItem label="申请权限">
              <CheckboxGroup v-model="scopeSettingForm.scoped">
                  <Checkbox label="班级管理员"></Checkbox>
                  <Checkbox label="社团管理员"></Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <Col :span="8" :offset="1">
            <FormItem label="职位">
              <Input v-model="scopeSettingForm.position" placeholder="请输入所担当职位"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="16">
          <Col :span="17">
            <FormItem>
              <Button type="primary" style="float: right" @click="applyScoped">申请</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>  
  </div>
</template>

<script>
import util from '@/libs/util.js'
export default {
  data () {
    return {
      academyList: [],
      majorList: [],
      baseInfoForm: {
        stuName: '',
        stuNum: '',
        stuPhone: '',
        stuShortPhone: '',
        belongAcademyId: '',
        belongMajorId: '',
        allowShowPhone: false
      },
      scopeSettingForm: {
        scoped: [],
        position: ''
      },
      scopeStatus: -1
    }
  },
  created () {
    // 获取学院列表信息
    util.ajax('/getAcademyList').then(({data}) => {
      let tempArr = []
      let len = data.length
      
      for (var i = 0; i < len; i++) {
          tempArr.push({
              academyName: data[i].academyName,
              academyId: data[i].objectId
          })
      }
      this.academyList = tempArr
    })

    // 获取用户基本信息
    let userId = this.$store.state.userInfo.userId
    util.ajax('/getUserInfo?userId=' + userId).then(({data}) => {
      let userInfo = data
      this.baseInfoForm.stuName = userInfo.stuName
      this.baseInfoForm.stuNum = userInfo.stuNum
      this.baseInfoForm.stuPhone = userInfo.stuPhone
      this.baseInfoForm.stuShortPhone = userInfo.stuShortPhone
      this.baseInfoForm.belongAcademyId = userInfo.belongAcademy.objectId
      this.baseInfoForm.belongMajorId = userInfo.belongMajor.objectId
      this.baseInfoForm.allowShowPhone = userInfo.allowShowPhone

      this.scopeStatus = userInfo.status
      this.scopeSettingForm.scoped = userInfo.scoped ? JSON.parse(userInfo.scoped) : []
      this.scopeSettingForm.position = userInfo.position
      this.getMajorFromAca()
    })
  },
  computed: {
    belongClass () {
      return this.$store.state.userInfo.belongClass
    }
  },
  methods: {
    getMajorFromAca() {
      let selectedAcaId = this.baseInfoForm.belongAcademyId
      util.ajax.get('getMajorFromAca', {params: {selectedAcaId: selectedAcaId}}).then((results) => {
          let tempArr = []
          let data = results.data
          let len = data.length
          for (var i = 0; i < len; i++) {
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
    saveBaseInfo (){
      let belongAcaName = ''
      this.academyList.forEach( (el) => {
        if (this.baseInfoForm.belongAcademyId == el.academyId) {
          belongAcaName =  el.academyName
        }
      })
      console.log('belongAcaName', belongAcaName)
      let belongMajorName = ''
      this.majorList.forEach( (el) => {
        if (this.baseInfoForm.belongMajorId == el.majorId) {
          belongMajorName = el.majorName
        }
      })
      console.log('belongMajorName', belongMajorName)
      util.ajax.post('updateUserInfo', {
        sessionToken: this.$store.state.userInfo.sessionToken,
        userId: this.$store.state.userInfo.userId,
        stuName: this.baseInfoForm.stuName,
        stuNum: this.baseInfoForm.stuNum,
        stuPhone: this.baseInfoForm.stuPhone,
        stuShortPhone: this.baseInfoForm.stuShortPhone,
        allowShowPhone: this.baseInfoForm.allowShowPhone,
        belongMajorId: this.baseInfoForm.belongMajorId,
        belongAcademyId: this.baseInfoForm.belongAcademyId,
        belongAcaName,
        belongMajorName,
        
      }).then( ({data}) => {
        console.log({data})
        if (data.status) {
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg)
        }
      })
    },
    applyScoped () {
      util.ajax.post('updateUserScope', {
        sessionToken: this.$store.state.userInfo.sessionToken,
        userId: this.$store.state.userInfo.userId,
        scopeStatus: 1,
        scoped: JSON.stringify(this.scopeSettingForm.scoped),
        position: this.scopeSettingForm.position
      }).then(({data}) => {
        console.log({data})
        if (data.status) {
          this.$Message.success(data.msg)
        } else {
          this.$Message.error(data.msg)
        }
      })
    }
  }
}
</script>

