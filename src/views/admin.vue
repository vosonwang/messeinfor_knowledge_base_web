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
          <template v-if="$i18n.locale==='zh'">
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'home',params: { lang: 'zh-CN' }}">
              <Icon type="home"></Icon>
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'home',params: { lang: 'en-US' }}">
              <Icon type="home"></Icon>
            </router-link>
          </template>

          <template v-if="$i18n.locale==='en'">
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin',params: { lang: 'zh-CN' }}">中文</router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin',params: { lang: 'en-US' }}">EN</router-link>
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
  import {mapActions} from 'vuex'

  export default {
    name: "admin",
    components: {
      vBase,
      TOC,
      Login,
      Editor
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getPath(to.path);
      })
    },
    beforeRouteUpdate(to, from, next) {
      this.getPath(to.path);
      next()
    },
    methods: {
      getPath(path) {
        if (path === '/admin/zh-CN') {
          this.$i18n.locale = 'zh';
          this.getTOC(0)
        } else if (path === '/admin/en-US') {
          this.$i18n.locale = 'en';
          this.getTOC(1)
        } else {
          this.$router.push({name: '404'})
        }
      },
      ...mapActions(['getTOC'])
    }
  }
</script>


