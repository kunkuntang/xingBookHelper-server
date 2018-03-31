<style scoped>
    
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="schoolAssistant" theme="dark" width="auto" :class="menuitemClasses" @on-select="changeContent">
                    <MenuGroup title="校园助手后台管理">
                        <MenuItem name="bookHelper">
                            <Icon type="ios-navigate"></Icon>
                            <span>购书助手</span>
                        </MenuItem>
                        <MenuItem name="contact">
                            <Icon type="search"></Icon>
                            <span>通讯录</span>
                        </MenuItem>
                        <MenuItem name="userCenter">
                            <Icon type="settings"></Icon>
                            <span>个人设置</span>
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup title="信息管理" v-if="isAdmin">
                        <MenuItem name="userManager">
                            <Icon type="settings"></Icon>
                            <span>用户管理</span>
                        </MenuItem>
                        <MenuItem name="groupManager">
                            <Icon type="settings"></Icon>
                            <span>群体管理</span>
                        </MenuItem>
                        <MenuItem name="mapManager">
                            <Icon type="settings"></Icon>
                            <span>地图地点管理</span>
                        </MenuItem>
                        <MenuItem name="scopeManager">
                            <Icon type="settings"></Icon>
                            <span>权限管理</span>
                        </MenuItem>
                    </MenuGroup>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    <span class="logoutBtn" @click="logout">登出</span>
                    <span style="float:right; margin-right: 15px; font-size: 16px;">{{userName}}</span>
                    <img :src="userAvatarUrl" alt="" class="avataorImg">
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: this.winH + 'px', position: 'relative'}">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>

import util from '@/libs/util.js'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      isCollapsed: false,
      winH: 500,
      isAdmin: false,
      comData: '',
      userName: '',
      userAvatarUrl: ''
    };
  },
  beforeMount: function() {
    // util.ajax.post('/checkLogin').then((result) => {
    //     let data = result.data
    //     let userInfo = data.userInfo
    //     if(!data.status) {
    //         this.$router.push({path: '/login'})
    //     }
    //     console.log(data)
    //     this.updateUserInfo({ stuName: userInfo.stuName, stuNum: userInfo.stuNum, userAvatarUrl: userInfo.avatarUrl, academyName: userInfo.belongAcaName, belongMajorId: userInfo.belongMajor.objectId, majorName: userInfo.belongMajorName, belongClass: userInfo.belongClass, role: userInfo.role || 0, userId: userInfo.objectId })
    //     if (this.userInfo.role >= 110 || userInfo.role >= 110) {
    //         this.isAdmin = true
    //     }
    //     this.userName = userInfo.stuName
    //     this.userAvatarUrl = userInfo.userAvatarUrl
    // }).catch(err => {
    //     console.log(err)
    //     this.$router.push({path: '/login'})        
    // })
    
    this.winH =
      (window.innerHeight ||
        document.body.clientHeight ||
        document.documentElement.clientHeight) - 104;
  },
  mounted: function() {
    setTimeout(() => {
        if (this.userInfo.role || this.userInfo.role >= 110) {
            this.isAdmin = true
        }
        this.userName = this.userInfo.stuName
        this.userAvatarUrl = this.userInfo.userAvatarUrl
    }, 500);
  },
  computed: {
    ...mapState({
        userInfo: 'userInfo'
    }),
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    changeContent (name) {
        console.log(name)
        this.$router.push({ path: name })
    },
    logout () {
        util.ajax.get('/logout').then(response => {
            this.$router.push({ path: '/login' })
        })
    },
    ...mapMutations([
        'updateUserInfo'
    ])
  },
  components: {
  }
};
</script>

<style scoped>
    .logoutBtn{
        line-height: 24px;
        float: right;
        font-size: 14px;
        margin: 20px 25px 0 0;
        cursor: pointer;
        padding: 0 5px;
        border-radius: 3px;
        background-color: #dddfe0;
    }
    .logoutBtn:hover{
        background-color: #cacaca;
    }
    .avataorImg{
        width: 40px;
        height: 40px;
        float: right;
        border-radius: 100%;
        margin-right: 5px;
        margin-top: 13px;
    }
</style>
