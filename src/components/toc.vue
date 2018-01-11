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
  import Request from '../util/request'
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: "toc",
    mounted: function () {
      this.getTocs(0)
    },
    computed: {
      ...mapGetters([
        'proTocs'
      ]),
    },
    watch: {
      proTocs: {
        handler: function (val, oldval) {
          /*一旦全局tocs变化，则更新目录*/
          this.tree[0].children = JSON.parse(JSON.stringify(val));
        }
      }
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
      editDoc(data) {
        let _self = this;
        Request.fetchAsync('/docs/' + data.id, 'get').then(rs => {
          if (rs.text === undefined || rs.text === null) {
            _self.$Message.error({
              content: "获取文档失败！",
              duration: 2
            })
          } else {
            _self.getDoc(rs)
            this.switchEditor(true)
          }

        })
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

        Request.fetchAsync("/admin/docs", "post", newNode).then(rs => {
            if (!!rs) {
              newNode.id = rs
              children.push(newNode)
              _self.$set(data, 'children', children)
            }
          }
        )
      },
      remove(root, node, data) {

        if (!node.children || node.children.length === 0) {
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          Request.fetchAsync('/admin/docs/' + data.id, 'delete').then(rs => {
            if (rs) {
              parent.children.splice(index, 1);
            }
          });

        } else {
          this.$Message.warning({
            content: "如需删除，请先删除子节点！",
            duration: 2
          })
        }
      },
      /*向上移动一位*/
      upward(root, node, data) {
        /*移除选中状态*/
        data.active = false;

        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        const length = parent.children.length;
        if (index !== 0) {

          Request.fetchAsync('/admin/nodekey/' + data.id, 'patch',
            {"id": parent.children[index - 1].id}
          ).then(result => {
            if (!!result) {
              parent.children = parent.children.slice(0, index - 1).concat(
                parent.children.slice(index, index + 1),
                parent.children.slice(index - 1, index),
                parent.children.slice(index + 1, length)
              );
            }
          });


        }
      },
      ...mapActions(['getTocs', 'switchEditor', 'getDoc'])
    }
  }
</script>

