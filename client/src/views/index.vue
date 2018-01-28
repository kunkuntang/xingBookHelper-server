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
                        <MenuItem name="1-3">
                            <Icon type="settings"></Icon>
                            <span>Option 3</span>
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
                    </MenuGroup>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: this.winH + 'px', position: 'relative'}">
                    <!-- <component v-bind:is="currentView" @changeView="changeContent" :data="comData">
                    </component> -->
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import Contact from '../components/contact.vue'
import BookHelper from '../components/bookHelper'
import AddBookList from '../components/bookHelper/addBookList'
import UserManager from '../components/userManager.vue'
import GroupManager from '../components/groupManager'

import util from '@/libs/util.js'
import { mapState } from 'vuex'

const CONTACT = 'contact',
    BOOKHELPER = 'bookHelper',
    GROUPMANAGER = 'groupManager',
    USERMANAGER = 'userManager',
    ADDBOOKLIST = 'addBookList'

export default {
  data() {
    return {
      isCollapsed: false,
      winH: 500,
      currentView: CONTACT,
      isAdmin: false,
      comData: ''
    };
  },
  beforeMount: function() {
    // if (!this.userInfo.stuNum) {
    //     this.$router.push({path: '/login'})
    // }
        console.log(this.currentRoute)
    util.ajax.post('/checkLogin').then((result) => {
        if(!result.data.status) {
            this.$router.push({path: '/login'})
        }
    })
    if (this.userInfo.role) {
        this.isAdmin = true
    }
    this.winH =
      (window.innerHeight ||
        document.body.clientHeight ||
        document.documentElement.clientHeight) - 104;
  },
  computed: {
    ...mapState({
        userInfo: 'userInfo'
    }),
    changeView() {
        console.log(this.currentRoute)
        return this.changeContent(this.currentRoute)
    },
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
    changeContent (name, comData) {
        console.log(name)
        // switch (name) {
        //     case 'contact': this.currentView = CONTACT; break;
        //     case 'bookHelper': this.currentView = BOOKHELPER; break;
        //     case 'groupManager': this.currentView = GROUPMANAGER; break;
        //     case 'userManager': this.currentView = USERMANAGER; break;
        //     case 'addBookList': this.currentView = AddBookList; break;
        // }
        this.currentView = name
        this.comData = comData
        this.$router.push({ path: name })
    }
  },
  components: {
      contact: Contact,
      bookHelper: BookHelper,
      groupManager: GroupManager,
      userManager: UserManager,
      addBookList: AddBookList
  }
};
</script>