<template>
  <v-base>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <catalog></catalog>
      <Login></Login>
    </Card>
  </v-base>
</template>
<script>
  import catalog from '../components/catalog'
  import vBase from '../components/base'
  import Login from '../components/login'

  export default {
    name: "admin",
    components: {
      vBase,
      catalog,
      Login
    },
  }
</script>

<style scoped>

</style>
