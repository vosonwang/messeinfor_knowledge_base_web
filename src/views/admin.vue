<template>
  <v-base>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <toc></toc>
      <Login></Login>
      <Editor></Editor>
    </Card>
  </v-base>
</template>
<script>
  import toc from '../components/toc'
  import vBase from '../components/base'
  import Login from '../components/login'
  import Editor from '../components/editor'

  export default {
    name: "admin",
    components: {
      vBase,
      toc,
      Login,
      Editor
    },
  }
</script>

<style scoped>

</style>
