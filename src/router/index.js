export default [

  {
    //为了方便路由判断，所以lang后置了
    //管理员首页-文档目录
    path: '/toc/:lang',
    meta: {
      title: 'admin'
    },
    name: 'admin',
    component: (resolve) => require(['../views/admin.vue'], resolve)

  },
  {
    //别名目录
    path: '/allalias',
    meta: {
      title: 'alias'
    },
    name: 'alias',
    component: (resolve) => require(['../views/alias.vue'], resolve)

  },
  {
    path: '/kb/:id',
    name: 'kb',
    component: (resolve) => require(['../views/doc.vue'], resolve)
  },
  // {
  //   //首页
  //   path: '/kb/:lang',
  //   meta: {
  //     title: 'Home'
  //   },
  //   name: 'home',
  //   component: (resolve) => require(['../views/home.vue'], resolve)
  // },
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
