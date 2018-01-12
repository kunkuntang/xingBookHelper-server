const routers = [{
    path: '/',
    meta: {
      title: ''
    },
    component: (resolve) => require(['./views/index.vue'], resolve)
  },
  {
    path: '/login',
    component: (resolve) => require(['./views/login.vue'], reslove)
  }
];
export default routers;