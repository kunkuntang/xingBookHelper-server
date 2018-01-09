<template>

  <div>
    <Tabs value="name1">
      <TabPane label="班级" icon="social-apple">
        <div style="margin: 0 16px;">
          <Button type="primary" icon="ios-plus-empty">添加学院</Button>
          <Table border :columns="columns7" :data="academyData"></Table>
        </div>  
      </TabPane>
      <TabPane label="社团" icon="social-windows">
        <div style="margin: 0 16px;">
          <!-- <Table border :columns="columns7" :data="data6"></Table> -->
          社团
        </div> 
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  export default {
      data () {
          return {
              columns7: [
                  {
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
                  },
                  {
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
                  }
              ],
              academyData: [
                  {
                      name: 'John Brown',
                  },
                  {
                      name: 'Jim Green',
                  },
                  {
                      name: 'Joe Black',
                  },
                  {
                      name: 'Jon Snow',
                  }
              ]
          }
      },
      create: function(){
        console.log(Bomb)
        Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");
        let Academy = Bmob.Object.extend("Academy");
        let query = new Bmob.Query(Academy);
        query.find({
          success: function(results) {
            alert("共查询到 " + results.length + " 条记录");
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              alert(object.id + ' - ' + object.get('playerName'));
            }
          },
          error: function(error) {
            alert("查询失败: " + error.code + " " + error.message);
          }
        });
      },
      mounted: function(e) {
        console.log(Bomb)
        Bmob.initialize("6636a71c682fc816bf7f4d3678561cff", "05ea04f70d33f065e52ded897c5f4765");
        let Academy = Bmob.Object.extend("Academy");
        let query = new Bmob.Query(Academy);
        query.find({
          success: function(results) {
            alert("共查询到 " + results.length + " 条记录");
            // 循环处理查询到的数据
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              alert(object.id + ' - ' + object.get('playerName'));
            }
          },
          error: function(error) {
            alert("查询失败: " + error.code + " " + error.message);
          }
        });
      },
      methods: {
          remove (index) {
              this.academyData.splice(index, 1);
          }
      }
  }
</script>
