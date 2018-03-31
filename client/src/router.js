const routers = [{
  path: '/login',
  component: (resolve) => require(['./views/login.vue'], resolve)
}, {
  path: '/',
  meta: {
    title: '',
    components: (resolve) => require(['./components/dashboard.vue'], resolve)
  },
  component: (resolve) => require(['./views/index.vue'], resolve),
  children: [{
    path: '/checkBookList',
    component: (resolve) => require(['./components/bookHelper/checkBookList.vue'], resolve)
  }, {
    path: '/bookHelper',
    component: (resolve) => require(['./components/bookHelper/showAllBookList.vue'], resolve)
  }, {
    path: '/addBookList',
    component: (resolve) => require(['./components/bookHelper/addBookList'], resolve)
  }, {
    path: '/editBookList',
    component: (resolve) => require(['./components/bookHelper/editBookList'], resolve)
  }, {
    path: '/contact',
    component: (resolve) => require(['./components/contact.vue'], resolve)
  }, {
    path: '/userManager',
    component: (resolve) => require(['./components/userManager.vue'], resolve)
  }, {
    path: '/groupManager',
    component: (resolve) => require(['./components/groupManager.vue'], resolve)
  }, {
    path: '/mapManager',
    component: (resolve) => require(['./components/mapManager.vue'], resolve)
  }, {
    path: '/userCenter',
    component: (resolve) => require(['./components/userCenter.vue'], resolve)
  }, {
    path: '/scopeManager',
    component: (resolve) => require(['./components/scopeManager.vue'], resolve)
  }]
}];
export default routers;