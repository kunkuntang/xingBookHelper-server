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
      <Row :gutter=16>
        <Col span="24">
          <span class="title">用户权限管理</span>
          <Card class="card-con">
            <div style="margin: 0 8px;">
              <Table border :columns="scopeColumns" :data="scopeData"></Table>
            </div>
          </Card>
        </Col>
      </Row>
  </div>
</template>

<script>
import util from "@/libs/util.js";
export default {
  data() {
    return {
      scopeColumns: [
        {
          title: "用户名称",
          key: "stuName",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.stuName)
            ]);
          }
        },
        {
          title: "学号",
          key: "stuNum"
        },
        {
          title: "专业",
          render: (h, params) => {
            return h("div", params.row.majorName + params.row.belongClass + '班');
          }
        },
        {
          title: "申请权限",
          key: "applyScope",
        },
        {
          title: "权限状态",
          render: (h, params) => {
              let scopeStatus = params.row.scopeStatus
              let status = ''
                switch (scopeStatus) {
                    case -1: status = '未申请'; break;
                    case 0: status =  '驳回'; break;
                    case 1: status =  '待审核'; break;
                    case 2: status =  '通过'; break;
                    default: status =  '未申请'; break;
                }
              return h('div', status)
          },
          key: "applyScope",
        },
        {
            title: '操作',
            key: 'action',
            width: 130,
            align: 'center',
            render: (h, params) => {
              console.log(params.row)
              let scopeStatus = params.row.scopeStatus
              let content = []
              if (scopeStatus != 2) {
                content.push(h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                      marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.passScope(params.index)
                    }
                  }
                }, '通过'))
              }
              if (scopeStatus != 0) {
                content.push(h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.denyScope(params.index)
                    }
                  }
                }, '驳回'))
              }
              return h('div', content);
            }
          }
      ],
      scopeData: []
    };
  },
  mounted() {
    util.ajax
      .get("/getUserScope")
      .then(({data}) => {
        console.log(data);
        data.results.forEach(el => {
          let applyScope = JSON.parse(el.scoped).join("、");
          console.log('applyScope', applyScope)
          if (el.belongUser.objectId != this.$store.state.userInfo.userId) {
            this.scopeData.push({
              stuName: el.belongUser.stuName,
              stuNum: el.belongUser.stuNum,
              majorName: el.belongUser.belongMajorName,
              belongClass: el.belongUser.belongClass,
              applyScope: applyScope,
              userId: el.belongUser.objectId,
              scopeStatus: el.scopeStatus
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    passScope(index) {
      let userId = this.scopeData[index].userId
      let sessionToken = this.$store.state.userInfo.sessionToken
      console.log(sessionToken)
      util.ajax.post('/passScope', { userId, sessionToken }).then(({data}) => {
          console.log(data)
          this.scopeData[index].scopeStatus = 2
      })
    },
    denyScope(index) {
      let userId = this.scopeData[index].userId
      let sessionToken = this.$store.state.userInfo.sessionToken
      util.ajax.post('/denyScope', { userId, sessionToken }).then(({data}) => {
          this.scopeData[index].scopeStatus = 0
      })
    }
  }
};
</script>

