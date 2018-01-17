<template>
  <v-base>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <template v-if="lang">
        <p :style="{fontSize:'200px'}">404</p>
        <p :style="{fontSize:'50px'}">Page Not Found</p>
        <router-link class="ivu-btn ivu-btn-ghost backhome" :to="{ name: 'home', params: { lang: 'en-US' }}" tag="button">Back to home
        </router-link>
      </template>
      <template v-else>
        <p :style="{fontSize:'200px'}">404</p>
        <p :style="{fontSize:'50px'}">找不到该页面</p>
        <router-link class="ivu-btn ivu-btn-ghost backhome" :to="{ name: 'home', params: { lang: 'zh-CN' }}" tag="button">返回主页
        </router-link>
      </template>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import {mapActions, mapState} from 'vuex'

  export default {
    components: {
      vBase
    },
    beforeRouteUpdate(to, from, next) {
      this.switchLang(to.params.lang);
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
      ...mapActions(['switchLang'])
    }
  }
</script>

<style scoped>
  .backhome {
    margin-top: 20px;
  }
</style>
