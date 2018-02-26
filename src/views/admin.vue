<style scoped>
  .layout-nav {
    width: 300px;
    margin: 0 auto;
  }
</style>
<template>
  <v-base>
    <div slot="header" style="width: 250px;margin: 0 auto">
      <Navigate></Navigate>
      <Lang></Lang>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <Login></Login>
      <TOC></TOC>
      <Editor></Editor>
    </Card>
  </v-base>
</template>
<script>
  import TOC from '../components/toc'
  import vBase from '../components/base'
  import Navigate from '../components/navigate'
  import Login from '../components/login'
  import Editor from '../components/editor'
  import util from "../util";
  import {mapActions, mapMutations} from 'vuex'
  import Lang from "../components/lang"

  export default {
    name: "admin",
    components: {
      vBase,
      TOC,
      Login,
      Editor,
      Navigate,
      Lang
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
        vm.GET_DIFF_LANG(to.params.lang === "zh-CN" ? "en-US" : "zh-CN");
        vm.getTOC(util.langParse(vm.$i18n.locale))
      })
    },
    beforeRouteUpdate(to, from, next) {
      this.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
      this.GET_DIFF_LANG(to.params.lang === "zh-CN" ? "en-US" : "zh-CN");
      this.getTOC(util.langParse(this.$i18n.locale));
      next()
    },

    methods: {
      ...mapActions(['getTOC']),
      ...mapMutations(['GET_DIFF_LANG']),
    }
  }
</script>


