<style scoped>

</style>
<template>
    <div id="app">
    <i-input v-model="userName" placeholder="Enter something..." style="width: 300px"></i-input>
    <i-input v-model="password" placeholder="Enter something..." style="width: 300px"></i-input>
    <i-button type="primary" @click="login">login</i-button>
  </div>
</template>
<script>
import util from '@/libs/util.js'
import { mapMutations } from 'vuex'
    export default {
        data() {
      return {
        userName: '',
        password: ''
      }
    },
    methods: {
      login() {
        util.ajax.post('/login',{ stuNum: this.userName, password: this.password }).then((result) => {
          console.log(result)
          let data = result.data
          if (data.login === 1) {
            this.$Message.success('登陆成功！');
            this.updateUserInfo({ stuName: data.stuName, stuNum: data.stuNum, userAvatarUrl: data.userAvatarUrl, role: data.role })
            this.$router.push({path: '/index'})
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
