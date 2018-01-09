<template>
  <Layout>
    <Header>
      <slot name="header"></slot>
    </Header>
    <Content>
      <slot name="content"></slot>
    </Content>
    <Footer :style="{textAlign:'center'}">
      2013-2030 &copy; messeinfor.com
    </Footer>
  </Layout>
</template>

<script>
  export default {}
</script>

<style scoped>

</style>
