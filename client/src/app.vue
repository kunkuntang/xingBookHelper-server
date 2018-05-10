<style scoped>

</style>
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import util from '@/libs/util.js'
import axios from 'axios'

export default {
        data() {
            return {

            };
        },
        computed: {
            
        },
        beforeMount () {

            util.ajax.post('/checkLogin').then((result) => {
                let data = result.data
                let userInfo = data.userInfo
                if(!data.status) {
                    this.$router.push({path: '/login'})
                } else {
                    console.log(data)
                    this.updateUserInfo({
                        stuName: userInfo.stuName,
                        stuNum: userInfo.stuNum,
                        userAvatarUrl: userInfo.avatarUrl,
                        academyName: userInfo.belongAcaName,
                        belongMajorId: userInfo.belongMajor.objectId,
                        majorName: userInfo.belongMajorName,
                        belongClass: userInfo.belongClass,
                        role: userInfo.roleNum || 0,
                        scopeStatus: userInfo.scopeStatus || -1,
                        scoped: userInfo.scoped || [],
                        applyClassStatus: userInfo.applyClassStatus || -1,
                        sessionToken: userInfo.sessionToken,
                        userId: userInfo.objectId
                    })
                    this.$router.push({path: '/'})                    
                }
            }).catch(err => {
                console.log(err)
                // this.$router.push({path: '/login'})        
            })
        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {
            ...mapMutations([
                'updateUserInfo'
            ])
        }
    };
</script>
