<style>
  @import '../style/mavon.css';
</style>

<template>
  <v-base>
    <div style="text-align: center" slot="header">
      <search></search>
      <div class="badge">
        <ButtonGroup size="small">
          <template v-if="$i18n.locale==='en'">
            <router-link class="ivu-btn ivu-btn-ghost " :to="{ name: 'doc', params: { lang: 'zh-CN' }}">中文</router-link>
          </template>
          <template v-else>
            <router-link class="ivu-btn ivu-btn-ghost " :to="{ name: 'doc', params: { lang: 'en-US' }}">EN</router-link>
          </template>
        </ButtonGroup>
      </div>
    </div>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <div style="margin:20px 0 0 24px;line-height: 50px">
        <h1>{{doc.title}}</h1>
        <p>{{$t('doc.created')}}{{created}} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{$t('doc.updated')}}{{updated}}</p>
      </div>

      <mavon-editor default_open="preview" :value=this.doc.text :toolbarsFlag="false" :subfield="false"></mavon-editor>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'
  import search from '../components/search'
  import {mapActions, mapGetters, mapState} from 'vuex'
  import {mavonEditor} from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import store from '../store'
  import log from '../util/log'

  export default {
    name: "doc",
    components: {
      vBase,
      search,
      mavonEditor
    },
    beforeRouteEnter(to, from, next) {
      //进入route
      log.print('进入route');
      next(vm => {
        vm.getPath(to.path);
        store.dispatch('requireDoc', {id: to.path.split("/")[3], lang: vm.$i18n.locale}).then(rs => {
          if (!!rs) {
            vm.getDoc(rs);
            if (rs.title !== '') {
              window.document.title = rs.title
            } else {
              vm.$router.push({name: '404'})
            }

          } else {
            vm.$router.push({name: '404'})
          }
        });
      })
    },
    beforeRouteUpdate(to, from, next) {
      /*doc初始化*/
      log.print('切换语言，初始化Doc');
      this.getDoc({});

      //切换中英文，设置i18n.local
      this.getPath(to.path);
      store.dispatch('requireDoc', {id: to.path.split("/")[3], lang: this.$i18n.locale}).then(rs => {
        if (!!rs) {
          this.getDoc(rs);
          if (rs.title !== '') {
            window.document.title = rs.title
          } else {
            this.$router.push({name: '404'})
          }
        } else {
          this.$router.push({name: '404'})
        }
      });
      next()
    },
    computed: {
      ...mapState({
        'doc': state => state.doc,
      }),
      ...mapGetters([
        'created',
        'updated'
      ]),
    },
    methods: {
      getPath(path) {
        if (path.startsWith('/doc/zh-CN')) {
          this.$i18n.locale = 'zh';
        } else if (path.startsWith('/doc/en-US')) {
          this.$i18n.locale = 'en';
        } else {
          //this.$router.push({name: '404'})
        }
      },
      ...mapActions(['requireDoc', 'getDoc'])
    }
  }
</script>


