<template>
  <v-base>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%',textAlign:'center'}">
      <p :style="{fontSize:'200px'}">404</p>
      <p :style="{fontSize:'50px'}">{{$t('notFound.msg')}}</p>
      <Button type="ghost" @click="$router.go(-2)" :style="{marginTop:'20px'}">{{$t('notFound.back')}}</Button>
    </Card>
  </v-base>
</template>

<script>
  import vBase from '../components/base'


  export default {
    components: {
      vBase
    },
    beforeRouteEnter(to, from, next) {
      if (from.path.includes('en-US')) {
        next(vm => {
          vm.$i18n.locale = 'en-US'
        })
      } else {
        next(vm => {
          vm.$i18n.locale = 'zh-CN'
        })
      }
    }
  }
</script>

