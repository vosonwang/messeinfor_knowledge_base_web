export default [

  {
    path: '/admin/toc/:lang',
    meta: {
      title: 'admin'
    },
    name: 'admin',
    component: (resolve) => require(['../views/admin.vue'], resolve)

  },
  {
    path: '/admin/allalias',
    meta: {
      title: 'alias'
    },
    name: 'alias',
    component: (resolve) => require(['../views/alias.vue'], resolve)

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
    path: '/doc/:lang/:alias',
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

  },
]
