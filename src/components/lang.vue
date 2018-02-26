<style scoped>

</style>

<template>
  <div class="badge">
    <ButtonGroup size="small">
      <Button type="ghost" size="small" @click="changeLang">
        <template v-if="$i18n.locale === 'zh-CN'">EN</template>
        <template v-else>中文</template>
      </Button>
    </ButtonGroup>
  </div>
</template>

<script>
  import log from '../util/log'
  import {mapState} from 'vuex'

  export default {
    name: "lang",
    computed: {
      ...mapState({
        'diffLang': state => state.diffLang,
      }),
    },
    methods: {
      changeLang() {
        //此处利用了vue-router的组件注入特点
        if (this.$route) {
          let a = JSON.parse(JSON.stringify(this.$route.params));
          log.print(a);
          a.lang = this.diffLang;
          this.$router.push({
            name: this.$route.name,
            params:a
          })
        } else {
          log.print("无法获取route")
        }

      }
    }
  }
</script>

