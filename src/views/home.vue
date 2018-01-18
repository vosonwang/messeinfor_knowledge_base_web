<style>

</style>
<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <div class="badge">
        <ButtonGroup size="small">
          <template v-if="$i18n.locale==='zh'">
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin', params: { lang: 'zh-CN' }}">
              <Icon type="person"></Icon>
            </router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin', params: { lang: 'en-US' }}">
              <Icon type="person"></Icon>
            </router-link>
          </template>
          <template v-if="$i18n.locale==='en'">
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
  import {mapActions} from 'vuex'

  export default {
    name: 'home',
    components: {
      vBase,
      search
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
        if (path === '/kb/zh-CN') {
          this.$i18n.locale = 'zh';
          this.getTOC(0)
        } else if (path === '/kb/en-US') {
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


