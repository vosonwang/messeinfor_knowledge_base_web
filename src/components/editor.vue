<style>
  @import '../style/mavon.less';
  @import '../style/search.less';
</style>

<template>
  <Modal v-model="modal" width="1200" id="editor">
    <div slot="header">
      <Row :style="{width:'90%'}">
        <Col span="17">
        <Input v-model="title" placeholder="标题"></Input>
        </Col>
        <Col span="6" offset="1">
        <AutoComplete v-model="desc" @on-search="searchAlias" icon="ios-search"
                      @on-select="selectAlias"
                      placeholder="别名" clearable>
          <div class="demo-auto-complete-item">
            <template>
              <Option v-for="i in aliases" :value="i.description" :key="i.id">{{i.description}}</Option>
            </template>
          </div>
          <div class="demo-auto-complete-nomore">
            <span>没有更多结果了</span>
          </div>
        </AutoComplete>
        </Col>
      </Row>
    </div>
    <mavon-editor ref=md default_open="edit" @subfieldtoggle="subfieldCallback" :value="doc.text"
                  :toolbars=this.toolbars  :external_link="external_link" :ishljs="true" :subfield = "subfield"
                  @save="saveArticle" @imgAdd="uploadImg" placeholder="写点什么..."></mavon-editor>
    <div class="ivu-upload ivu-upload-select" ref="diy">
      <input type="file" class="ivu-upload-input" ref="input" @change="uploadFile">
      <button type="button" class="op-icon fa " aria-hidden="true" title="上传附件" style="margin-left: 3px"
              @click="upload">
        <Icon type="arrow-up-a"></Icon>
      </button>
    </div>
    <div slot="footer">
      <div style="text-align: left">
        <Row>
          <Col span="6">
          创建时间：{{created}}</Col>
          <Col span="6">
          更新时间：{{updated}}</Col>
        </Row>
      </div>
    </div>
  </Modal>
</template>

<script>
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import Request from '../util/request'
  import util from '../util'
  import utf8 from 'utf8'
  import cookie from '../util/cookie'
  import debounce from 'lodash/debounce'

  export default {
    name: "editor",
    components: {
      mavonEditor
    },
    data() {
      return {
        aliases: [],
        external_link: {
          markdown_css: function() {
            // 这是你的markdown css文件路径
            return '/markdown/github-markdown.min.css';
          },
          hljs_js: function() {
            // 这是你的hljs文件路径
            return '/highlightjs/highlight.min.js';
          },
          hljs_css: function(css) {
            // 这是你的代码高亮配色文件路径
            return '/highlightjs/styles/' + css + '.min.css';
          },
          hljs_lang: function(lang) {
            // 这是你的代码高亮语言解析路径
            return '/highlightjs/languages/' + lang + '.min.js';
          },
          katex_css: function() {
            // 这是你的katex配色方案路径路径
            return '/katex/katex.min.css';
          },
          katex_js: function() {
            // 这是你的katex.js路径
            return '/katex/katex.min.js';
          },
        },
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: false, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          navigation: true, // 导航目录
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          subfield: true, // 单双栏模式
          preview: true, // 预览
        },
      }
    },
    mounted() {

      /*将自定义的上传文件按钮插入到toolbar中*/
      let md = this.$refs.md,
        toolbar_left = md.$refs.toolbar_left,
        diy = this.$refs.diy;
      toolbar_left.$el.append(diy)

    },
    computed: {
      desc: {
        get() {
          return this.description
        },
        set(v) {
          this.GET_DESC(v)
        }
      },
      title: {
        get() {
          return this.doc.title
        },
        set(v) {
          this.UPDATE_DOC({"type": "title", "value": v})
        }
      },
      modal: {
        get() {
          return this.editor
        },
        set(v) {
          this.SWITCH_EDITOR(v)
        }
      },
      ...mapState({
        'editor': state => state.editor,
        'doc': state => state.doc,
        'description': state => state.description,
      }),
      ...mapGetters(['created', 'updated']),
    },
    methods: {
      /*查找别名*/
      searchAlias: debounce(function (value) {
        if (value === "") {
          this.UPDATE_DOC({"type": "alias_id", "value": null});
          this.aliases = []
        } else {
          let _self = this;
          Request.fetchAsync("/admin/alias", "post", {
            "description": value
          }).then(rs => _self.aliases = rs)   //rs的结果可能为null
        }
      }, 500),
      /*选择别名*/
      selectAlias(value) {
        let _self = this;
        if (value) {
          if (this.aliases !== null && this.aliases !== []) {
            this.aliases.forEach(function (v) {
              if (v.description === value) {
                _self.UPDATE_DOC({"type": "alias_id", "value": v.id})
              }
            });
          }
        } else {
          this.UPDATE_DOC({"type": "alias_id", "value": null});
        }
      },
      /*点击双栏模式的回调函数*/
      subfieldCallback() {
        /*在点击双栏模式后，迫使预览模式的值和双栏模式保持一致*/
        this.$children[0].s_preview_switch = this.$children[0].s_subfield
      },
      /*保存文档*/
      saveArticle(value) {
        let lang = util.langParse(this.$i18n.locale);
        this.UPDATE_DOC({"type": "text", "value": value});
        this.UPDATE_DOC({"type": "lang", "value": lang});
        this.UPDATE_DOC({"type": "updater", "value": cookie.getCookie('userId')});
        Request.fetchAsync('/admin/docs', 'post', this.doc).then(data => {
          if (!!data) {
            this.GET_DOC(data);
            this.getTOC(util.langParse(this.$i18n.locale));
          }
        })
      },
      upload() {
        /*打开隐藏的上传文件按钮*/
        this.$refs.input.click()
      },
      uploadImg(filename, imgFile) {
        Request.fetchAsync('/admin/images', 'post', imgFile, {}).then(data =>
          this.$refs.md.$img2Url(filename, data)
        )
      },
      uploadFile(e) {

        /*获取要上传文件*/
        let a = e.target.files[0];

        Request.fetchAsync('/admin/files', 'post', a, {"id": utf8.encode(a.name)}).then(data => {
            /*清空上传文件，以便同一文件可以多次上传，否则同一个文件不会触发change事件*/
            e.target.value = null;

            /*在光标处插入上传的文件链接*/
            this.$refs.md.insertText(this.$refs.md.getTextareaDom(),
              {
                prefix: '\n[' + a.name + '](' + data + ')',
                subfix: '',
                str: ''
              })

          }
        )
      },
      ...mapMutations(['UPDATE_DOC', 'GET_DOC', 'SWITCH_EDITOR', 'GET_DESC']),
      ...mapActions(['getTOC', 'switchLogin'])
    }

  }
</script>

