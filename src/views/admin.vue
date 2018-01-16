<style scoped>
  .layout-nav {
    width: 300px;
    margin: 0 auto;
  }
</style>
<template>
  <v-base>
    <div slot="header">
      <div class="badge">
        <ButtonGroup size="small">
          <template v-if="true">
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'home'}">
              <Icon type="home"></Icon>
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'home'}">
              <Icon type="home"></Icon>
            </router-link>
          </template>
          <template v-if="true">
            <router-link class="ivu-btn ivu-btn-ghost "
                         :to="{ name: 'admin', params: { lang: 'zh-CN' }}">中文
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost "
                         :to="{ name: 'admin', params: { lang: 'zh-CN' }}">EN
            </router-link>
          </template>
        </ButtonGroup>
      </div>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <TOC></TOC>
      <Login></Login>
      <Editor></Editor>
    </Card>
  </v-base>
</template>
<script>
  import TOC from '../components/toc'
  import vBase from '../components/base'
  import Login from '../components/login'
  import Editor from '../components/editor'
  import {mapActions, mapState} from 'vuex'

  export default {
    name: "admin",
    components: {
      vBase,
      TOC,
      Login,
      Editor
    },
    beforeRouteUpdate(to, from, next) {
      this.switchLang(to.params.lang)
      this.getTOC(this.lang)
      next()
    },
    mounted() {
      this.switchLang(this.$route.params.lang)
    },
    computed: {
      ...mapState({
        'lang': state => state.lang,
      }),
    },
    methods: {
      ...mapActions(['switchLang', 'getTOC'])
    }
  }
</script>


