<style>
  @import '../style/base.css';
</style>
<template>
  <Layout>
    <Header class="layout-header-bar">
      <div>
        <slot name="header"></slot>
      </div>
    </Header>
    <Content>
      <div class="wrap">
        <slot name="content"></slot>
      </div>
    </Content>
    <Footer :style="{textAlign:'center'}">
      2013-2030 &copy; messeinfor.com
    </Footer>
  </Layout>
</template>

<script>
  export default {}
</script>


