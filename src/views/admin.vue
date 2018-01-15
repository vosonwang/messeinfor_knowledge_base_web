<template>
  <v-base>
    <Card slot="content" dis-hover :style="{margin:'20px auto',width:'80%'}">
      <TOC></TOC>
      <Login></Login>
      <Editor></Editor>
    </Card>
  </v-base>
</template>
<script>
  import TOC from '../components/toc'
  import vBase from '../components/base'
  import Login from '../components/login'
  import Editor from '../components/editor'

  export default {
    name: "admin",
    components: {
      vBase,
      TOC,
      Login,
      Editor
    },
  }
</script>

<style scoped>

</style>
