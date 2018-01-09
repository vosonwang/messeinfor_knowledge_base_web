<template>
  <v-base>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%',textAlign:'center'}">
      <catalog></catalog>
    </Card>
  </v-base>
</template>
<script>
  import catalog from '../components/catalog'
  import vBase from '../components/base'

  export default {
    name: "admin",
    components: {
      vBase,
      catalog
    },
  }
</script>

<style scoped>

</style>
