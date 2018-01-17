<style>

</style>
<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <div class="badge">
        <ButtonGroup size="small">
          <template v-if="!lang">
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin', params: { lang: 'zh-CN' }}">
              <Icon type="person"></Icon>
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin', params: { lang: 'en-US' }}">
              <Icon type="person"></Icon>
            </router-link>
          </template>
          <template v-if="lang">
            <router-link class="ivu-btn ivu-btn-ghost "
                         :to="{ name: 'home', params: { lang: 'zh-CN' }}">中文
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost "
                         :to="{ name: 'home', params: { lang: 'en-US' }}">EN
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
  import ISwitch from "iview/src/components/switch/switch"
  import {mapActions, mapState} from 'vuex'

  export default {
    name: 'home',
    components: {
      ISwitch,
      vBase,
      search
    },
    beforeRouteUpdate(to, from, next) {
      if (to.path.includes('zh-CN')) {
        this.switchLang('zh-CN');
        this.getTOC(0)
      } else {
        this.switchLang('en-US');
        this.getTOC(1)
      }
      next()
    },
    mounted() {
      if (this.$route.path.includes('zh-CN')) {
        this.switchLang('zh-CN');
        this.getTOC(0)
      } else {
        this.switchLang('en-US');
        this.getTOC(1)
      }
    },
    computed: {
      ...mapState({
        'lang': state => state.lang,
      }),
    },
    methods: {
      ...mapActions(['switchLang','getTOC'])
    }
  }
</script>


