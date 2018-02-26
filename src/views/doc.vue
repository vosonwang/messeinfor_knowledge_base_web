<style>

</style>

<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <template v-if="alias">
        <Lang></Lang>
      </template>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <div style="margin:20px 0 0 24px;line-height: 50px">
        <h1>{{doc.title}}</h1>
        <p>{{$t('doc.updated')}}{{updated}}</p>
      </div>
      <Show :doc=this.doc></Show>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import Show from '../components/show'
  import {mapGetters, mapMutations, mapState} from 'vuex'
  import 'mavon-editor/dist/css/index.css'
  import Request from '../util/request'
  import util from "../util"
  import el from "../util/mavon"
  import Lang from "../components/lang"

  export default {
    name: "doc",
    components: {
      vBase,
      search,
      Lang,
      Show,
    },
    beforeRouteEnter(to, from, next) {

      if (to.path.includes("zh-CN") || to.path.includes("en-US")) {
        next(vm => {
          /*根据别名请求文档*/
          vm.getDocByAlias(to.params.alias, to.params.lang);
          vm.alias = to.params.alias;
          vm.$i18n.locale = to.params.lang;
          vm.GET_DIFF_LANG(to.params.lang === "zh-CN" ? "en-US" : "zh-CN");
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
      this.GET_DIFF_LANG(to.params.lang === "zh-CN" ? "en-US" : "zh-CN");
      next()
    },
    data() {
      return {
        external_link: el,
        alias: '',
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
        Request.fetchAsync("/mkb/docAlias/" + name+'/'+util.langParse(lang), 'get').then(rs => {
          if (!!rs) {
            window.document.title = rs.title;
            this.GET_DOC(rs);
          } else {
            this.$router.push({name: '404'})
          }
        })
      },
      ...mapMutations(['GET_DOC','GET_DIFF_LANG']),

    }
  }
</script>


