<style>
  @import '../style/mavon.less';
</style>

<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <template v-if="alias">
        <div class="badge">
          <ButtonGroup size="small">
            <Button type="ghost" size="small" @click="changeLang">
              <template v-if="$i18n.locale === 'zh-CN'">EN</template>
              <template v-else>中文</template>
            </Button>
          </ButtonGroup>
        </div>
      </template>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <div style="margin:20px 0 0 24px;line-height: 50px">
        <h1>{{doc.title}}</h1>
        <p>{{$t('doc.created')}}{{created}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{$t('doc.updated')}}{{updated}}</p>
      </div>

      <mavon-editor default_open="preview" :value=this.doc.text :toolbarsFlag="false" :external_link="external_link"
                    :subfield="false"></mavon-editor>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import {mapGetters, mapMutations, mapState} from 'vuex'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import Request from '../util/request'
  import util from "../util";

  export default {
    name: "doc",
    components: {
      vBase,
      search,
      mavonEditor
    },
    beforeRouteEnter(to, from, next) {

      if (to.path.includes("zh-CN") || to.path.includes("en-US")) {
        next(vm => {
          /*根据别名请求文档*/
          vm.getDocByAlias(to.params.alias, to.params.lang);
          vm.alias = to.params.alias;
          vm.$i18n.locale = to.params.lang;
          vm.diffLang = to.params.lang === "zh-CN" ? "en-US" : "zh-CN";
        });
      } else {
        /*根据id请求文档*/
        next(vm => {
            vm.getDocById(to.params.id)
          }
        )
      }
    },
    beforeRouteUpdate(to, from, next) {
      //只有别名访问，才可以切换中英文，才会调用此方法
      this.getDocByAlias(to.params.alias, to.params.lang);
      this.alias = to.params.alias;
      this.$i18n.locale = to.params.lang;
      this.diffLang = to.params.lang === "zh-CN" ? "en-US" : "zh-CN";
      next()
    },
    data() {
      return {
        external_link: {
          markdown_css: function () {
            // 这是你的markdown css文件路径
            return '/markdown/github-markdown.min.css';
          },
          hljs_js: function () {
            // 这是你的hljs文件路径
            return '/highlightjs/highlight.min.js';
          },
          hljs_css: function (css) {
            // 这是你的代码高亮配色文件路径
            return '/highlightjs/styles/' + css + '.min.css';
          },
          hljs_lang: function (lang) {
            // 这是你的代码高亮语言解析路径
            return '/highlightjs/languages/' + lang + '.min.js';
          },
          katex_css: function () {
            // 这是你的katex配色方案路径路径
            return '/katex/katex.min.css';
          },
          katex_js: function () {
            // 这是你的katex.js路径
            return '/katex/katex.min.js';
          },
        },
        alias: '',
        diffLang: ""
      }
    },
    computed: {
      ...mapState({
        'doc': state => state.doc,
      }),
      ...mapGetters(['created', 'updated']),
    },
    methods: {
      /*根据Id请求文档*/
      getDocById(id) {
        Request.fetchAsync("/docs/" + id, 'get').then(rs => {
          if (!!rs) {
            window.document.title = rs.title;
            this.GET_DOC(rs);
            this.$i18n.locale = util.langParse(rs.lang)
          } else {
            this.$router.push({name: '404'})
          }
        })
      },
      getDocByAlias(name, lang) {
        Request.fetchAsync("/mkb/docAlias/" + name, 'get', null, {"id": util.langParse(lang)}).then(rs => {
          if (!!rs) {
            window.document.title = rs.title;
            this.GET_DOC(rs);
          } else {
            this.$router.push({name: '404'})
          }
        })
      },
      changeLang() {
        this.$router.push({
          name: 'doc',
          params: {
            lang: this.diffLang,
            alias: this.alias
          }
        })
      },
      ...mapMutations(['GET_DOC']),

    }
  }
</script>


