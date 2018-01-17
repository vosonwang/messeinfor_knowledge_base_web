<style scoped>

</style>

<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <div class="badge">
        <ButtonGroup size="small">
          <template v-if="lang">
            <router-link class="ivu-btn ivu-btn-ghost "
                         :to="{ name: 'doc', params: { lang: 'zh-CN' }}">中文
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost "
                         :to="{ name: 'doc', params: { lang: 'en-US' }}">EN
            </router-link>
          </template>
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
  import {mapActions, mapState} from 'vuex'

  export default {
    name: "doc",
    components: {
      vBase,
      search
    },
    beforeRouteUpdate(to, from, next) {
      this.getPath(to.path);
      next()
    },
    mounted() {
      this.getPath(this.$route.path)
    },
    computed: {
      ...mapState({
        'lang': state => state.lang,
      }),
    },
    methods: {
      getPath(path) {
        if (path.startsWith('/doc/zh-CN')) {
          this.switchLang('zh-CN');
        } else if (path.startsWith('/doc/en-US')) {
          this.switchLang('en-US');
        } else {
          this.$router.push({name: '404'})
        }
      },
      ...mapActions(['switchLang'])
    }
  }
</script>


