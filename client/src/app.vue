<style scoped>

</style>
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import util from '@/libs/util.js'

export default {
        data() {
            return {

            };
        },
        computed: {
            ...mapState({
                userInfo: 'userInfo'
            })
        },
        beforeMount () {
            util.ajax.post('/checkLogin').then((result) => {
                if(!result.data.status) {
                    this.$router.push({path: '/login'})
                }
            })
        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {

        }
    };
</script>
