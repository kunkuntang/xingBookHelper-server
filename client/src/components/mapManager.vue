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
                <Button type="primary" icon="ios-plus-empty" @click="addLocationCate = true">添加地点分类</Button>
                </div>
                <Table border :columns="locationCateColumns" :data="locationCateData"></Table>
            </div>
            </Card>
        </Col>
        <Col span="12">
            <span class="title">添加地点</span>
            <Card class="card-con">
            <div style="margin: 0 16px;">
                <!-- <Table border :columns="columns7" :data="data6"></Table> -->
                <div style="margin-bottom: 16px;">
                <Select v-model="selectedCateId" style="width:200px; margin-right: 15px" clearable @on-change="getLocationFromCate">
                    <Option v-for="item in locationCateData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Button type="primary" icon="ios-plus-empty" @click="addLocation = true">添加专业</Button>
                </div>
                <Table border :columns="locationColumns" :data="locationData"></Table>
            </div>
            </Card>
        </Col>
        </Row>
    </div>  
    <Modal v-model="addLocationCate" title="Common Modal dialog box title" @on-ok="addLoctionCateFunc" @on-cancel="cancel">
        <Form>
            <FormItem label="分类名称">
                <Input v-model="newLocationCateName" placeholder="输入分类名称" style="width: 300px" :autofocus="true"></Input>
            </FormItem>
        </Form>
    </Modal>
    <Modal v-model="addLocation" title="Common Modal dialog box title" @on-ok="addLocationFunc" @on-cancel="cancel">
        <Form>
            <FormItem label="地点名称">
                <Input v-model="newLocationName" placeholder="输入地点名称" style="width: 200px" :autofocus="true"></Input>
            </FormItem>
            <FormItem label="经度坐标">
                <Input v-model="newLongitude" placeholder="输入经度坐标" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="纬度坐标">
                <Input v-model="newLatitude" placeholder="输入纬度坐标" style="width: 200px"></Input>
            </FormItem>
        </Form>
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
            addLocationCate: false,
            addLocation: false,
            newLocationCateName: '',
            newLocationName: '',
            newLongitude: 0,
            newLatitude: 0,
            locationCateColumns: [{
                title: '分类名称',
                key: 'locationCateName',
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
                        this.remove(params.index)
                        }
                    }
                    }, '删除')
                ]);
                }
            }],
            locationCateData: [{
                name: '',
                id: ''
            }],
            selectedCateId: '',
            locationColumns: [{
                title: '地点名称',
                key: 'locationName',
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
                        this.remove(params.index)
                        }
                    }
                    }, '删除')
                ])
                }
            }],
            locationData: []
        }
      },
      mounted: function(e) {
        util.ajax.get('getLocationCateList').then(({data}) => {
            let tempArr = []
            let len = data.length
                console.log(data)
            
            for (var i = 0; i < len; i++) {
                console.log(data[i])
                tempArr.push({
                    name: data[i].locationCateName,
                    id: data[i].objectId
                })
            }
            this.locationCateData = tempArr
            this.selectedCateId = this.locationCateData[0].id
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
        remove (index) {
          this.locationCateData.splice(index, 1);
        },
        addLoctionCateFunc() {
          console.log(this.newLocationCateName)
          let newLocationCateName = this.newLocationCateName
          util.ajax.post('addLocationCate', {newLocationCateName: newLocationCateName}).then((result) => {
              console.log(result)
              if (result.data.status === 1) {
                  this.$Message.info('添加' + newLocationCateName + '成功');
                  this.locationCateData.push({
                    name: newLocationCateName,
                    id: result.data.objectId
                  })
              } else {
                  this.$Message.info('添加' + newLocationCateName + '失败');
              }
              this.newLocationCateName = ''
            }).catch((error) => {
              this.$Message.warning('网络问题')
              console.error(error)
            })
        },
        addLocationFunc() {
          console.log(this.newLocationName)
          let newLocationName = this.newLocationName
          let newLongitude = new Number(this.newLongitude)
          let newLatitude = new Number(this.newLatitude)
          util.ajax.post('addLocation', {selectedCateId: this.selectedCateId, newLocationName: newLocationName, newLongitude: newLongitude, newLatitude: newLatitude}).then((result) => {
              if (result.data.status === 1) {
                  this.$Message.info(result.data.mes);
                  this.locationData.push({
                    name: newLocationName,
                    id: result.data.objectId
                  })
              } else {
                  this.$Message.info(result.data.mes);
              }
              this.newLocationName = ''
              this.newLongitude = ''
              this.newLatitude = ''
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
        getLocationFromCate() {
          console.log('triggle by select change')
          console.log(this.selectedCateId)
          util.ajax.get('getLocationFromCate', {params: {selectedCateId: this.selectedCateId}}).then((results) => {
            let tempArr = []
            let data = results.data
            let len = data.length
            console.log(data)
            for (var i = 0; i < len; i++) {
                console.log(data[i])
                tempArr.push({
                    name: data[i].locationName,
                    id: data[i].objectId
                })
            }
            this.locationData = tempArr
            }).catch((err)=> {
                console.log(err)
            })
        }
      }
  }
</script>
