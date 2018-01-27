<style>
  @import '../style/toc.less';
  @import '../style/search.less';
</style>

<template>
  <v-base>
    <div slot="header" style="width: 250px;margin: 0 auto">
      <Navigate></Navigate>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">

      <Login></Login>

      <Tree :data="tree" :render="renderContent"></Tree>

      <Modal v-model="modal" @on-ok="ok" @on-visible-change="modalChange">
        <Form :model="form" :label-width="0">
          <FormItem>
            <Input v-model="form.description" placeholder="描述"></Input>
          </FormItem>
          <FormItem>
            <Input v-model="form.name" placeholder="别名"></Input>
          </FormItem>
          <FormItem>
            <AutoComplete v-model="form.title_cn" @on-search="searchCNTitle" @on-select="selectTitleCN"
                          icon="ios-search"
                          placeholder="中文" clearable>
              <div class="demo-auto-complete-item">
                <template>
                  <Option v-for="i in titlesCN" :value="i.title" :key="i.id">{{i.title}}</Option>
                </template>
              </div>
              <div class="demo-auto-complete-nomore">
                <span>没有更多结果</span>
              </div>
            </AutoComplete>
          </FormItem>
          <FormItem>
            <AutoComplete v-model="form.title_en" @on-search="searchENTitle" icon="ios-search"
                          @on-select="selectTitleEN"
                          placeholder="英文" clearable>
              <div class="demo-auto-complete-item">
                <template>
                  <Option v-for="i in titlesEN" :value="i.title" :key="i.id">{{i.title}}</Option>
                </template>
              </div>
              <div class="demo-auto-complete-nomore">
                <span>No More</span>
              </div>
            </AutoComplete>
          </FormItem>
        </Form>
      </Modal>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import Login from '../components/login'
  import Navigate from '../components/navigate'
  import Request from '../util/request'
  import util from '../util'
  import debounce from 'lodash/debounce'

  export default {
    name: "alias",
    components: {
      vBase,
      Login,
      Navigate
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.allAlias()
      })
    },
    beforeRouteUpdate(to, from, next) {
      this.allAlias()
    },
    data() {
      return {
        modal: false,
        form: {},
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
        titlesCN: [],
        titlesEN: [],
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
      append(node, data) {
        this.modal = true;
        this.form.parent_id = node.node.id
      },
      remove(root, node, data) {
        if (!node.children || node.children.length === 0) {
          const parentKey = root.find(el => el === node).parent;
          const parent = root.find(el => el.nodeKey === parentKey).node;
          const index = parent.children.indexOf(data);
          Request.fetchAsync('/admin/alias_titles/' + data.id, 'delete').then(rs => {
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
      editDoc(data) {
        this.modal = true;
        Request.fetchAsync('/admin/alias_titles/' + data.id, 'get').then(rs => {
          if (rs) {
            this.form = rs;
            this.modal = true
          }
        })
      },
      viewDoc(data) {
        this.$router.push({
          name: 'doc',
          params: {
            lang: this.$i18n.locale,
            alias: data.name
          }
        })
      },
      modalChange(value) {
        /*初始化表单*/
        if (!value) {
          this.form = {};
          this.titlesCN = [];
          this.titlesEN = []
        }
      },
      ok() {
        Request.fetchAsync('/admin/alias_titles', 'post', this.form).then(rs => {
          if (rs) this.allAlias()
        })
      },
      addTitle(data) {
        data.forEach(function (v) {
          v.title = v.description + " " + v.name + " #" + v.title_cn + "# #" + v.title_en + "#"
        });
        return data
      },
      allAlias() {
        Request.fetchAsync('/admin/alias_titles', 'get').then(rs => {
          /*未登录时，rs为undefined*/
          if (!!rs) {
            this.tree[0].children = util.combine(util.addAttr(this.addTitle(rs)))
          }
        })
      },

      /*搜索*/
      //TODO 如果是编辑别名，也会自动触发这个方法，发起请求
      searchCNTitle: debounce(function (value) {
        if (value === "") {
          this.form.doc_cn = null;
          this.titlesCN = [];
        } else {
          let _self = this;
          Request.fetchAsync("/admin/titles", "post", {
            "lang": 0,
            "title": value
          }).then(rs => _self.titlesCN = rs)   //rs的结果可能为null
        }
      }, 500),
      selectTitleCN(value) {  //不管value如何变化都会调用这个函数
        let _self = this;
        if (value) {
          if (this.titlesCN !== null && this.titlesCN !== []) { //titlesCN可能为[]或者null
            this.titlesCN.forEach(function (v) {
              if (v.title === value) {
                _self.form.doc_cn = v.id;
              }
            });
          }
        } else {
          this.form.doc_cn = null
        }

      },
      searchENTitle: debounce(function (value) {
        if (value === "") {
          this.form.doc_en = null;
          this.titlesEN = [];
        } else {
          let _self = this;
          Request.fetchAsync("/admin/titles", "post", {
            "lang": 1,
            "title": value
          }).then(rs => _self.titlesEN = rs)  //rs的结果可能为null
        }

      }, 500),
      selectTitleEN(value) {
        let _self = this;
        if (value) {
          if (this.titlesCN !== null && this.titlesCN !== []) {
            this.titlesEN.forEach(function (v) {
              if (v.title === value) {
                _self.form.doc_en = v.id;
              }
            });
          }
        } else {
          this.form.doc_en = null
        }

      }
    }
  }
</script>

