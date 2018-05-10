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
        <Col span="24">
          <span class="title">{{academyName}} - {{majorName}} - {{belongClass}}班</span>
          <Card class="card-con">
            <div style="margin: 0 8px;">
              <Table border :columns="userColumns" :data="userData"></Table>
            </div>
          </Card>
        </Col>
      </Row>
    </div>  
  </div>
</template>
<script>
import { mapState } from "vuex";
import util from "@/libs/util.js";
export default {
  data() {
    return {
      isCollapsed: false,
      winH: 500,
      academyName: "",
      majorName: "",
      belongClass: "",
      userColumns: [
        {
          title: "姓名",
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
          title: "电话",
          key: "stuPhone"
        },
        {
          title: '审核',
          render: (h, params) => {
            console.log(params)
            let applyClassStatus = params.row.applyClassStatus
            if (applyClassStatus == 2) {
              return h('span', '已通过')
            } else if (applyClassStatus == 1) {
              return h('div', [
                h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.pass(params.index)
                  }
                },
              }, '通过'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deny(params.index)
                  }
                },
              }, '驳回')])
            } else if (applyClassStatus == 0) {
              return h('span', '已驳回')
            }
          }
        }
      ],
      userData: [
        {
          stuName: "",
          stuPhone: "",
          stuNum: "",
          id: "",
          belongUserRole: "",
        }
      ]
    };
  },
  mounted: function(e) {
    this.belongClass = this.userInfo.belongClass;
    this.majorName = this.userInfo.majorName;
    this.academyName = this.userInfo.academyName;

    let belongMajorId = this.userInfo.belongMajorId;
    let classNum = this.userInfo.belongClass;
    util.ajax
      .get("getUserList?belongMajor=" + belongMajorId + "&classNum=" + classNum)
      .then(results => {
        let tempArr = [];
        let data = results.data.data;
        let len = data.length;
        console.log(data);

        for (var i = 0; i < len; i++) {
          if (data[i].belongUserRole.applyClassStatus != -1 && data[i].objectId != this.userInfo.userId)
          tempArr.push({
            stuName: data[i].stuName,
            stuPhone: data[i].stuPhone,
            stuNum: data[i].stuNum,
            id: data[i].objectId,
            applyClassStatus: data[i].belongUserRole.applyClassStatus,
            belongUserRole: data[i].belongUserRole.objectId
          });
        }
        this.userData = tempArr;
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    ...mapState({
      userInfo: "userInfo"
    }),
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    pass(index) {
      // this.academyData.splice(index, 1);
      // this.ajax.post()
      console.log(this.userData[index])
      let userRoleId = this.userData[index].belongUserRole
      util.ajax.post('passJoinRequest', { userRoleId }).then(data => {
        console.log(data)
        if (data.status == 200) {
          this.$Message.info('已通过')
          this.userData[index].applyClassStatus = 2
        } else {
          this.$Message.info('操作失败')
        } 
      })
    },
    deny(index) {
      console.log(this.userData[index])
      let userRoleId = this.userData[index].belongUserRole
      util.ajax.post('denyJoinRequest', { userRoleId }).then(data => {
        if (data.status == 200) {
          this.$Message.info('已驳回')
          this.userData[index].applyClassStatus = 0
        } else {
          this.$Message.info('操作失败')
        } 
      }).catch(err => {
        console.log(err)
      })
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    }
  }
};
</script>
