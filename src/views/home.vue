<style>

</style>
<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <div class="badge">
        <ButtonGroup size="small">
          <Button type="ghost" size="small" @click="signIn">
            <Icon type="person"></Icon>
          </Button>

          <Button type="ghost" size="small" @click="changeLang">
            <template v-if="$i18n.locale === 'zh-CN'">EN</template>
            <template v-else>中文</template>
          </Button>
        </ButtonGroup>
      </div>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import {mapActions} from 'vuex'
  import log from "../util/log"

  export default {
    name: 'home',
    components: {
      vBase,
      search
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        log.print("home|i18n旧值:" + vm.$i18n.locale);
        vm.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
        log.print("home|i18n新值:" + vm.$i18n.locale);
        vm.lang = vm.$i18n.locale === "zh-CN" ? "en-US" : "zh-CN"
        log.print("home|lang:" + vm.lang);
      })
    },
    beforeRouteUpdate(to, from, next) {
      log.print("home|i18n旧值:" + this.$i18n.locale);
      this.$i18n.locale = to.path.includes("zh-CN") ? "zh-CN" : "en-US";
      log.print("home|i18n新值:" + this.$i18n.locale);
      this.lang = this.$i18n.locale === "zh-CN" ? "en-US" : "zh-CN";
      log.print("home|lang:" + this.lang);
      next()
    },
    data() {
      return {
        lang: ""
      }
    },
    methods: {
      signIn() {
        this.$router.push({
          name: 'admin',
          params: {
            lang: this.$i18n.locale
          }
        })
      },
      changeLang() {
        this.$router.push({
          name: 'home',
          params: {
            lang: this.lang
          }
        })
      },
      ...mapActions(['getTOC'])
    }
  }
</script>


