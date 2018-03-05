<style scoped>
.title {
    font-size: 18px;
    margin: 5px 0 20px 16px;
    padding-right: 10px;
    border-bottom: 3px solid #2d8cf0;
    display: inline-block;
}
</style>

<template>

  <div>
    <div style="margin: 20px 16px;">
      <Row :gutter=16>
        <Col span="12">
          <span class="title">添加学院</span>
          <Card class="card-con">
            <div style="margin: 0 8px;">
              <div style="margin-bottom: 16px;">
                <Button type="primary" icon="ios-plus-empty" @click="addAcademy = true">添加学院</Button>
              </div>
              <Table border :columns="academyColumns" :data="academyData"></Table>
            </div>
          </Card>
        </Col>
        <Col span="12">
          <span class="title">添加专业</span>
          <Card class="card-con">
            <div style="margin: 0 16px;">
              <!-- <Table border :columns="columns7" :data="data6"></Table> -->
              <div style="margin-bottom: 16px;">
                <Select v-model="selectedAcaId" style="width:200px" clearable @on-change="getMajorFromAca">
                  <Option v-for="item in academyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Button type="primary" icon="ios-plus-empty" @click="addMajor = true">添加专业</Button>
              </div>
              <Table border :columns="majorColumns" :data="majorData"></Table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>  
    <Modal v-model="addAcademy" title="Common Modal dialog box title" @on-ok="addAcademyFunc" @on-cancel="cancel">
      <Input v-model="newAcademyName" placeholder="输入学院名称" style="width: 300px" :autofocus="true"></Input>
    </Modal>
    <Modal v-model="addMajor" title="Common Modal dialog box title" @on-ok="addMajorFunc" @on-cancel="cancel">
      <Input v-model="newMajorName" placeholder="输入专业名称" style="width: 300px" :autofocus="true"></Input>
    </Modal>
  </div>
</template>
<script>
import util from '@/libs/util.js'
  export default {
      data () {
          return {
            isCollapsed: false,
          winH: 500,
          addAcademy: false,
          addMajor: false,
          newAcademyName: '',
          newMajorName: '',
          academyColumns: [{
            title: '学院名称',
            key: 'academyName',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ]);
            }
          }, {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeAca(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }],
          academyData: [{
              name: '',
              id: ''
          }],
          selectedAcaId: '',
          majorColumns: [{
            title: '专业名称',
            key: 'majorName',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.name)
              ])
            }
          }, {
            title: '操作',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeMajor(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }],
          majorData: []
          }
      },
      mounted: function(e) {
        util.ajax.get('getAcademyList').then((results) => {
            let tempArr = []
            let data = results.data
            let len = data.length
                console.log(data)
            
            for (var i = 0; i < len; i++) {
                console.log(data[i])
                tempArr.push({
                    name: data[i].academyName,
                    id: data[i].objectId
                })
            }
            this.academyData = tempArr
            this.selectedAcaId = this.academyData[0].id
        }).catch((err)=> {
            console.log(err)
        })
      },
      computed: {
        rotateIcon() {
          return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
        },
        menuitemClasses() {
          return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        }
      },
      methods: {
        removeMajor (index) {
          console.log('removeMaj idx', index)
          let majorId = this.majorData[index].id
          util.ajax.post('/delMajor', { majorId }).then(({data}) => {
            if (data.status) {
              this.majorData.splice(index, 1);
              this.$Message.info('删除成功');
            } else {
              this.$Message.info('删除失败');              
            }
          })
        },
        removeAca (index) {
          console.log('removeAca idx', index)
          let academyId = this.academyData[index].id
          util.ajax.post('/delAcademy', { academyId }).then(({data}) => {
            if (data.status) {
              this.academyData.splice(index, 1);
              this.$Message.info('删除成功');
            } else {
              this.$Message.info('删除失败');              
            }
          })
        },
        collapsedSider() {
          this.$refs.side1.toggleCollapse();
        },
        addAcademyFunc() {
          console.log(this.newAcademyName)
          let newAcademyName = this.newAcademyName
          util.ajax.post('addAcademy', {newAcademyName: newAcademyName}).then((result) => {
              console.log(result)
              if (result.data.status === 1) {
                  this.$Message.info('添加' + newAcademyName + '成功');
                  this.academyData.push({
                    name: newAcademyName,
                    id: result.data.objectId
                  })
              } else {
                  this.$Message.info('添加' + newAcademyName + '失败');
              }
              this.newAcademyName = ''
            }).catch((error) => {
              this.$Message.warning('网络问题')
              console.error(error)
            })
        },
        addMajorFunc() {
          console.log(this.newMajorName)
          let newMajorName = this.newMajorName
          util.ajax.post('addMajor', {selectedAcaId: this.selectedAcaId, newMajorName: newMajorName}).then((result) => {
              if (result.data.status === 1) {
                  this.$Message.info(result.data.mes);
                  this.majorData.push({
                    name: newMajorName,
                    id: result.data.objectId
                  })
              } else {
                  this.$Message.info(result.data.mes);
              }
              this.newMajorName = ''
          }).catch((error) => {
              this.$Message.warning('网络问题')
              console.error(error)
            })    
        },
        cancel() {
          this.$Message.info('Clicked cancel');
          this.newAcademyName = ''
          this.newMajorName = ''
        },
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
                    name: data[i].majorName,
                    id: data[i].objectId
                })
            }
            this.majorData = tempArr
            }).catch((err)=> {
                console.log(err)
            })
        }
      }
  }
</script>
