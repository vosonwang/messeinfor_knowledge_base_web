<style scoped>

</style>
<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <!--<Lang></Lang>-->
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">

      <template v-if="result.hits && result.hits.hits.length">
        <template  v-for="item in result.hits.hits" >
          <Answer :hit="item"></Answer>
        </template>
      </template>
      <template v-else>
      <p>没有记录</p>
      </template>

    </Card>
  </v-base>
</template>


<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import Lang from "../components/lang"
  import { mapMutations } from 'vuex'
  import Show from '../components/show'
  import Answer from '../components/answer'
  import log from '../util/log'
  import Request from '../util/request'


  export default {
    components: {
      vBase,
      search,
      Lang,
      Show,
      Answer
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.search(to.params.words);
        vm.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
        //因为使用了$t，所以下面这句修改标签页标题一定要放在$i18n后面
        window.document.title = to.params.words + ' - ' + vm.$t('search.result') + ' - MKB';
        vm.GET_DIFF_LANG(to.params.lang === "zh-CN" ? "en-US" : "zh-CN");
      })
    },
    beforeRouteUpdate(to, from, next) {
      this.search(to.params.words);
      this.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
      window.document.title = to.params.words + ' - ' + this.$t('search.result') + ' - MKB';
      this.GET_DIFF_LANG(to.params.lang === "zh-CN" ? "en-US" : "zh-CN");
      next()
    },
    data() {
      return {
        result: {}
      }
    },
    methods: {
      search(words) {
        Request.fetchAsync('/mkb/search/' + words, 'get').then(rs => {
          if (rs) {
            this.result = rs
          }
        })
      },
      ...mapMutations(['GET_DIFF_LANG']),
    }
  }
</script>

