<style scoped>

</style>
<template>
  <div class="body" :style="'min-height:' + winH + 'px'">
    <div class="content">
      <Row class="row">
        <img src="" alt="">
      </Row>
      <Row class="row">
        <i-input v-model="userName" placeholder="用户名" style="width: 200px"></i-input>
      </Row>
      <Row class="row">
        <i-input v-model="password" type="password" placeholder="密码" style="width: 200px" @on-enter="login"></i-input>
      </Row>
      <Row class="row" style="width: 200px; margin-left: auto; margin-right: auto;">
        <i-button type="primary" @click="login" style="float: right;">登陆</i-button>
      </Row>
    </div>
  </div>
</template>
<script>
import util from '@/libs/util.js'
import { mapMutations } from 'vuex'
    export default {
      data() {
        return {
          userName: '',
          password: '',
          winH: 500
        }
      },
      beforeMount() {
        this.winH = (window.innerHeight ||
        document.body.clientHeight ||
        document.documentElement.clientHeight);
      },
      methods: {
        login() {
          util.ajax.post('/login',{ stuNum: this.userName, password: this.password }).then(({data}) => {
            if (data.status === 1) {
              this.$Message.success('登陆成功！');
              // this.updateUserInfo({ stuName: data.stuName, stuNum: data.stuNum, userAvatarUrl: data.avatarUrl, academyName: data.belongAcaName, belongMajorId: data.belongMajor.objectId, majorName: data.belongMajorName, belongClass: data.belongClass, role: data.role, userId: data.objectId })
              this.$router.push({path: '/'})
            } else {
              this.$Message.error('用户名或密码错误！');
            }
          }).catch((err) => {
            console.log(err)
          })
        },
        ...mapMutations([
            'updateUserInfo'
        ])
      }
  };
</script>

<style scoped>
  .content{
    width: 350px;
    height: auto;
    margin: 0 auto;
    padding: 20px 20px 40px 20px;
    background-color: #f9f9f9;
    border: 1px solid #d8d8d8;
    border-radius:5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .row {
    margin-top: 16px;
    text-align: center;
  }
</style>

