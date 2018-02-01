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
      <div class="badge">
        <ButtonGroup size="small">
          <Button type="ghost" size="small" @click="changeLang">
            <template v-if="$i18n.locale === 'zh-CN'">EN</template>
            <template v-else>中文</template>
          </Button>
        </ButtonGroup>
      </div>
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
  import log from "../util/log";
  import util from "../util";
  import {mapActions} from 'vuex'

  export default {
    name: "admin",
    components: {
      vBase,
      TOC,
      Login,
      Editor,
      Navigate
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        log.print("admin|i18n旧值:" + vm.$i18n.locale);
        vm.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
        log.print("admin|i18n新值:" + vm.$i18n.locale);
        vm.diffLang = vm.$i18n.locale === "zh-CN" ? "en-US" : "zh-CN";
        vm.getTOC(util.langParse(vm.$i18n.locale))
      })
    },
    beforeRouteUpdate(to, from, next) {
      log.print("admin|i18n旧值:" + this.$i18n.locale);
      this.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
      log.print("admin|i18n新值:" + this.$i18n.locale);
      this.diffLang = this.$i18n.locale === "zh-CN" ? "en-US" : "zh-CN";
      this.getTOC(util.langParse(this.$i18n.locale));
      next()
    },
    data() {
      return {
        diffLang: ""
      }
    },
    methods: {
      changeLang() {
        this.$router.push({
          name: 'admin',
          params: {
            lang: this.diffLang
          }
        })
      },
      ...mapActions(['getTOC'])
    }
  }
</script>


