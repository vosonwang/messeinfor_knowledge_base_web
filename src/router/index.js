export default [
  {
    path: '/admin/:lang',
    meta: {
      title: 'admin'
    },
    name: 'admin',
    component: (resolve) => require(['../views/admin.vue'], resolve)

  },
  {
    path: '/kb/:lang',
    meta: {
      title: 'Home'
    },
    name: 'home',
    component: (resolve) => require(['../views/home.vue'], resolve)

  },
  {
    path: '/doc/:lang/:id',
    name: 'doc',
    component: (resolve) => require(['../views/doc.vue'], resolve)

  },
  {
    path: '*',
    meta: {
      title: '404'
    },
    name: '404',
    component: (resolve) => require(['../views/404.vue'], resolve)

  }
]
