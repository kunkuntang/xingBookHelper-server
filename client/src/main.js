import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';


Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);



// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  util.title(to.meta.title);
  next();
});

router.afterEach(() => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});


const store = new Vuex.Store({
  state: {
    userInfo: {},
    majorArr: [],
    academyArr: [],
    bookListArr: [],
    bookListId: '',
    bookListName: ''
  },
  getters: {
    userInfo: (state) => state.userInfo,
    majorArr: (state) => state.majorArr,
    academyArr: (state) => state.academyArr,
    bookListArr: (state) => state.bookListArr,
    bookListId: (state) => state.bookListId,
  },
  mutations: {
    updateBookListId(state, newBookListId) {
      state.bookListId = newBookListId
    },
    updateBookListArr(state, newBookListArr) {
      state.bookListArr = newBookListArr
    },
    updateAcademyArr(state, newAcademyArr) {
      state.academyArr = newAcademyArr
    },
    updateMajorArr(state, newMajorArr) {
      state.majorArr = newMajorArr
    },
    updateUserInfo(state, newUserInfo) {
      console.log(newUserInfo)
      state.userInfo = newUserInfo
    }
  },
  actions: {

  }
});


new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
});