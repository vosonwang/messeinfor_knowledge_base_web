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
  import req from '../util/request'

  export default {
    name: "catalog",
    mounted: function () {
      req.fetchAsync("/admin/docs", "get").then(data => {
          console.log(data)
        }
      )
    },
    data() {
      return {
        tree: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            title: "目录",
            expand: true,
            render: (h, {root, node, data}) => {
              return h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  height: '30px',
                  lineHeight: '30px',
                  textAlign: 'left'
                }
              }, [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '96%',
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'ios-folder-outline'
                    },
                    style: {
                      marginRight: '8px',
                      fontSize: '20px'
                    }
                  }),
                  h('span', {
                    style: {
                      fontSize: '20px'
                    }
                  }, data.title)
                ]),
                h('span', {
                  style: {
                    display: 'inline-block',
                    verticalAlign: 'top'
                  }
                }, [
                  h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                      icon: 'plus',
                      type: 'ghost',
                    }),
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
            height: '30px',
            lineHeight: '30px',
            textAlign: 'left'
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
                marginRight: '8px',
                fontSize: '20px'
              }
            }),
            h('span', {
              style: {
                display: 'inline-block',
                fontSize: '18px'
              }
            }, data.title)
          ]),
          h('span', {
            style: {
              marginLeft: '30px',
              display: 'inline-block',
              verticalAlign: 'top'
            },
            'class': {
              hide: !data.active
            }
          }, [

            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'ios-plus-empty',
                type: 'ghost',

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
                icon: 'ios-minus-empty',
                type: 'ghost',

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
                icon: 'ios-arrow-up',
                type: 'ghost',

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
              /*将全局buttonProps和{icon:''}拼在一起给到props*/
              props: Object.assign({}, this.buttonProps, {
                icon: 'android-create',
                type: 'ghost',

              }),
              style: {
                marginRight: '8px',

              },

              on: {
                click: () => {
                  this.editDoc(data)
                }
              }
            }),
          ])
        ]);
      },
      ok() {

      },
      editDoc(data) {

      },
      append(node, data) {
        const children = data.children || [];
        children.push({
          title: "新文档",
          expand: true,
          active: false,
          parent_id: node.node.id,
        });
        this.$set(data, 'children', children);
      },
      remove(root, node, data) {

      },
      /*向上移动一位*/
      upward(root, node, data) {

      },
    }
  }
</script>

