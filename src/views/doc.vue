<style>
  @import '../style/mavon.less';
</style>

<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <div class="badge">
        <Button type="ghost" size="small" @click="handlerClick">
          <template v-if="!opposite">中文</template>
          <template v-else>EN</template>
        </Button>
      </div>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <div style="margin:20px 0 0 24px;line-height: 50px">
        <h1>{{doc.title}}</h1>
        <p>{{$t('doc.created')}}{{created}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{$t('doc.updated')}}{{updated}}</p>
      </div>

      <mavon-editor default_open="preview" :value=this.doc.text :toolbarsFlag="false" :subfield="false"></mavon-editor>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import {mapGetters, mapState} from 'vuex'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import Request from '../util/request'
  import util from '../util'

  export default {
    name: "doc",
    components: {
      vBase,
      search,
      mavonEditor
    },
    beforeRouteEnter(to, from, next) {
      if (to.path.includes("zh-CN") || to.path.includes("en-US")) {
        /*根据别名请求文档*/
        vm.alias = true

      }else {
        /*根据id请求文档*/

      }

      Request.fetchAsync("/docs/" + to.params.id, 'get').then(rs => {
        if (!!rs) {
          window.document.title = rs.title;
          next(vm => {
            vm.$i18n.locale = util.setLang(to.path);
            vm.GET_TOC(rs);
            vm.requireOppDoc(rs.alias_id)
          })
        } else {
          window.location = "/";
        }
      })
    },
    beforeRouteUpdate(to, from, next) {
      //切换中英文，设置i18n.local
      this.$i18n.locale = util.setLang(to.path);
      this.GET_TOC(this.doc2);
      window.document.title = this.doc2.title;
      next()
    },
    data() {
      return {
        alias: false
      }
    },
    computed: {

      ...mapState({
        'doc': state => state.doc,
      }),
      ...mapGetters([
        'created',
        'updated'
      ]),
    },
    methods: {
      /*请求文档*/
      getDoc(id, lang) {

      },

      handlerClick() {
        if (this.doc2.id) {
          this.$router.push({
            name: 'doc',
            params: {
              lang: util.langParse(this.$i18n.locale),
              id: this.doc2.id
            }
          })
        } else {
          this.$Message.warning({
            content: this.$t('doc.isNotExit'),
            duration: 2
          })
        }
      },
    }
  }
</script>


