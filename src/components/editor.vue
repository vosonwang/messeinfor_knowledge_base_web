<style>
  @import '../style/mavon.css';
</style>

<template>
  <Modal v-model="modal" width="1200" id="editor">
    <div slot="header">
      <Row :style="{width:'90%'}">
        <Col span="17">
        <Input v-model="title" placeholder="标题"></Input>
        </Col>
        <Col span="6" offset="1">
        <Select v-model="alias_id" clearable filterable placeholder="别名">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
    </div>
    <mavon-editor ref=md default_open="edit" @subfieldtoggle="subfieldCallback" :value="doc.text"
                  :toolbars=this.toolbars
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

  export default {
    name: "editor",
    components: {
      mavonEditor
    },
    data() {
      return {
        cityList: [
          {
            value: 'f9353281-b386-4ec5-b53e-813744bea3b5',
            label: 'exhibitorBusiness'
          },
          {
            value: '48ee926c-21e8-4ecf-875f-2fa03efbc279',
            label: 'Mlist'
          },
          {
            value: 'ea710100-fe61-4175-aa75-41b0c9afbd85',
            label: 'finance'
          },
          {
            value: '9c2a29f1-41e1-4ac9-a642-f556b77f11d2',
            label: 'exhibitorBusinessDetail'
          },
        ],
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
      /*默认显示的是全屏编辑，所以双栏模式设置需手动设置为false*/
      this.$children[0].s_subfield = false;

      /*将自定义的上传文件按钮插入到toolbar中*/
      let md = this.$refs.md,
        toolbar_left = md.$refs.toolbar_left,
        diy = this.$refs.diy;
      toolbar_left.$el.append(diy)

    },
    watch: {
      'doc': {
        handler: function (val, oldval) {
          this.mavon = JSON.parse(JSON.stringify(val))
        }
      },
    },
    computed: {
      alias_id: {
        get: function () {
          return this.doc.alias_id
        },
        set: function (v) {
          this.UPDATE_DOC({"type": "alias_id", "value": v})
        }
      },
      title: {
        get: function () {
          return this.doc.title
        },
        set: function (v) {
          this.UPDATE_DOC({"type": "title", "value": v})
        }
      },
      modal: {
        get: function () {
          return this.editor
        },
        set: function (v) {
          this.SWITCH_EDITOR(v)
        }
      },
      ...mapState({
        'editor': state => state.editor,
        'doc': state => state.doc,
        'creator': state => state.creator,
        'parent_id': state => state.parent_id,
      }),
      ...mapGetters(['created', 'updated']),
    },
    methods: {
      /*点击双栏模式的回调函数*/
      subfieldCallback: function () {
        /*在点击双栏模式后，迫使预览模式的值和双栏模式保持一致*/
        this.$children[0].s_preview_switch = this.$children[0].s_subfield
      },
      saveArticle: function (value, render) {
        let lang = util.langParse(this.$i18n.locale);
        this.UPDATE_DOC({"type": "text", "value": value});
        this.UPDATE_DOC({"type": "lang", "value": lang});
        this.UPDATE_DOC({"type": "updater", "value": cookie.getCookie('userId')});
        Request.fetchAsync('/admin/docs', 'post', this.doc).then(data => {
          if (!!data) {
            this.GET_DOC(data);
            this.getTOC(lang);
          }
        })
      },
      upload() {
        /*打开隐藏的上传文件按钮*/
        this.$refs.input.click()
      },
      uploadImg: function (filename, imgFile) {
        Request.fetchAsync('/admin/images', 'post', imgFile, {}).then(data =>
          this.$refs.md.$img2Url(filename, data)
        )
      },
      uploadFile: function (e) {

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
      ...mapMutations(['UPDATE_DOC', 'GET_DOC','SWITCH_EDITOR']),
      ...mapActions(['getTOC', 'switchLogin'])
    }

  }
</script>

