<style>
  @import '../style/toc.less';
</style>

<template>
  <div>
    <Tree :data="tree" :render="renderContent"></Tree>
  </div>
</template>

<script>
  import Request from '../util/request'
  import {mapActions, mapMutations, mapState} from 'vuex'
  import cookie from '../util/cookie'

  export default {
    name: "TOC",
    computed: {
      ...mapState({
        'TOC': state => state.TOC
      }),
    },
    watch: {
      TOC: {
        handler: function (val, oldval) {
          //一旦全局tocs变化，则更新目录
          this.tree[0].children = JSON.parse(JSON.stringify(val))
        }
      },
      //切换根目录的中英文显示
      '$i18n.locale': {
        handler: function (val, oldVal) {
          this.tree[0].title = this.$t('toc.title')
        }
      }
    },
    data() {
      return {
        tree: [
          {
            id: "00000000-0000-0000-0000-000000000000",
            title: this.$t('toc.title'),
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
                      size: 'small'
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
              marginLeft: '80px',
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
                size: 'small'
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
                size: 'small'

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
                size: 'small'

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
                size: 'small'

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
            h('Button', {
              props: Object.assign({}, this.buttonProps, {
                icon: 'eye',
                type: 'ghost',
                size: 'small'

              }),
              style: {
                marginRight: '8px',

              },
              on: {
                click: () => {
                  this.viewDoc(data)
                }
              }
            }),
          ])
        ])
      },
      append(node) {
        //打开编辑器，会引发清空doc的操作，因此要放在前面执行
        this.SWITCH_EDITOR(true);
        this.UPDATE_DOC({"type": "creator", "value": cookie.getCookie('userId')});
        this.UPDATE_DOC({"type": "parent_id", "value": node.node.id});
      },
      remove(root, node, data) {
        if (!node.children || node.children.length === 0) {
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          Request.fetchAsync('/admin/docs/' + data.id, 'delete').then(rs => {
            if (rs) {
              parent.children.splice(index, 1)
            }
          })

        } else {
          this.$Message.warning({
            content: "如需删除，请先删除子节点！",
            duration: 2
          })
        }
      },
      upward(root, node, data) {
        const parentKey = root.find(el => el === node).parent;
        const parent = root.find(el => el.nodeKey === parentKey).node;
        const index = parent.children.indexOf(data);
        const length = parent.children.length;
        if (index !== 0) {

          Request.fetchAsync('/admin/nodes/' + data.id + '/' + parent.children[index - 1].id, 'patch').then(result => {
            if (!!result) {
              //移除选中状态
              data.active = false;
              //Es6 合并数组
              parent.children = [
                ...parent.children.slice(0, index - 1),
                ...parent.children.slice(index, index + 1),
                ...parent.children.slice(index - 1, index),
                ...parent.children.slice(index + 1, length)
              ]
            }
          })


        }
      },
      editDoc(data) {
        //如果别名alias_id存在，则同时发起两个请求：获取文档和对应的别名
        if (data.alias_id !== '00000000-0000-0000-0000-000000000000') {
          Promise.all([Request.fetchAsync('/docs/' + data.id, 'get'), Request.fetchAsync('/alias/' + data.alias_id, 'get')]).then(all => {
            if (!all[0]) {
              this.$Message.error({
                content: "获取文档失败！",
                duration: 2
              })
            } else {

              if (!all[1]) {
                this.$Message.error({
                  content: "获取别名失败！",
                  duration: 2
                });
              }

              //即使获取别名失败，也会打开编辑器
              this.SWITCH_EDITOR(true);
              this.GET_DOC(all[0]);
              this.GET_DESC(all[1].description);
            }


          })
        } else {
          Request.fetchAsync('/docs/' + data.id, 'get').then(rs => {
            this.SWITCH_EDITOR(true);
            this.GET_DOC(rs);
          })
        }
      },
      viewDoc(data) {
        this.$router.push({
          name: 'kb',
          params: {
            id: data.id
          }
        })
      },
      ...mapMutations(['UPDATE_DOC', 'SWITCH_EDITOR', 'GET_DOC', 'GET_DESC']),
      ...mapActions(['getTOC', 'switchLogin'])
    }
  }
</script>

