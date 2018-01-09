export default [
  {
    path: '/admin',
    meta: {
      title: 'admin'
    },
    name: 'admin',
    component: (resolve) => require(['../views/admin.vue'], resolve)

  },
  {
    path: '/',
    meta: {
      title: 'Home'
    },
    name: 'home',
    component: (resolve) => require(['../views/home.vue'], resolve)

  },
  {
    path: '*',
    meta: {
      title: 'Page Not Found'
    },
    name: '404',
    component: (resolve) => require(['../views/404.vue'], resolve)

  }
]
