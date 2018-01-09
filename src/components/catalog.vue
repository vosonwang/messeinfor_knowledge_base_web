<style scoped>
  span.hide {
    display: none;
  }
</style>

<template>
  <div>
    <Tree :data="tree" :render="renderContent"></Tree>
  </div>
</template>

<script>
  export default {
    name: "catalog",
    data() {
      return {
        tree: [
          {
            title: "目录",
            expand: true,
            render: (h, {root, node, data}) => {
              return h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  height: '20px',
                  fontSize: '20px'
                }
              }, [
                h('span', [
                  h('Icon', {
                    props: {
                      type: 'ios-folder-outline'
                    },
                    style: {
                      marginRight: '8px'
                    }
                  }),
                  h('span', data.title)
                ]),
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '93%',
                    textAlign: 'right',
                  }
                }, [
                  h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                      icon: 'plus',
                      type: 'primary'
                    }),
                    style: {
                      width: '52px',
                      marginRight: '8px'
                    },
                    on: {
                      click: () => {
                        this.append(node, data)
                      }
                    }
                  }),
                ])
              ]);
            },
            children: []

          }
        ],
      }
    },
    methods: {
      renderContent(h, {root, node, data}) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%',
            height: '26px',
          },
          on: {
            /*鼠标经过显示按钮*/
            mouseover: () => {
              data.active = true;
            },
            /*鼠标移走隐藏按钮*/
            mouseout: () => {
              data.active = false;
            }
          },
        }, [
          h('span', [
            h('Icon', {
              props: {
                type: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', {
              style: {
                display: 'inline-block',
              }
            }, data.title)
          ]),
          h('span', {
            style: {
              marginLeft: '30px',
            },
            'class': {
              hide: !data.active
            }
          }, [
            h('Button', {
              /*将全局buttonProps和{icon:''}拼在一起给到props*/
              props: Object.assign({}, this.buttonProps, {
                icon: 'android-create',
              }),
              style: {
                marginRight: '8px',

              },

              on: {
                click: () => {
                  this.editNode(data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-plus-empty'
              }),
              style: {
                marginRight: '8px',

              },
              on: {
                click: () => {
                  this.append(node, data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-minus-empty'
              }),
              style: {
                marginRight: '8px',

              },

              on: {
                click: () => {
                  this.remove(root, node, data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-arrow-up'
              }),
              style: {
                marginRight: '8px',

              },
              on: {
                click: () => {
                  this.upward(root, node, data)
                }
              }
            }),
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-compose-outline',
              }),
              style: {},
              on: {
                click: () => {
                  this.editArticle(data)
                }
              }
            })
          ])
        ]);
      },
      editNode(data) {

      },
      ok() {

      },
      editArticle(data) {

      },
      append(node, data) {


      },
      remove(root, node, data) {

      },
      /*向上移动一位*/
      upward(root, node, data) {

      },
    }
  }
</script>

