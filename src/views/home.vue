<style>

</style>
<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
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
          <template>
            <router-link class="ivu-btn ivu-btn-ghost" :to="{name:'admin', params: { lang: 'zh-CN' }}">
              <Icon type="person"></Icon>
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
      <!--<router-link class="ivu-btn ivu-btn-primary ivu-btn-circle ivu-btn-icon-only badge" :to="{name:'admin',params: { lang: 'zh-CN' } }" tag="button">-->
        <!--<Icon type="person"/>-->
      <!--</router-link>-->
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import ISwitch from "iview/src/components/switch/switch";

  export default {
    name: 'home',
    components: {
      ISwitch,
      vBase,
      search
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>


