<style scoped>
  span.hide {
    display: none
  }
</style>

<template>
  <div>
    <Tree :data="tree" :render="renderContent"></Tree>
  </div>
</template>

<script>
  import req from '../util/request'
  import util from '../util'

  export default {
    name: "catalog",
    mounted: function () {
      let _self = this
      req.fetchAsync("/admin/docs/0", "get").then(data => {
          _self.$set(_self.tree[0], 'children', util.combine(_self.addHack(data)))
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
                    width: '95%',
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
              ])
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
              data.active = true
            },
            /*鼠标移走隐藏按钮*/
            mouseout: () => {
              data.active = false
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
        ])
      },
      ok() {

      },
      editDoc(data) {

      },
      append(node, data) {
        const children = data.children || []

        let newNode = {
          title: "新文档",
          expand: true,
          active: false,
          lang: 0,
          parent_id: node.node.id,
        }, _self = this

        req.fetchAsync("/admin/docs", "post", newNode).then(rs => {
            if (!!rs) {
              newNode.id = rs
              children.push(newNode)
              _self.$set(data, 'children', children)
            }
          }
        )
      },
      remove(root, node, data) {

      },
      /*向上移动一位*/
      upward(root, node, data) {

      },
      addHack(data) {
        data.forEach(function (v, k) {
          v.active = false
          v.expand = true
        })
        return data
      }
    }
  }
</script>

