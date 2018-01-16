<style>
  .wrap {
    margin: 20px auto;
    width: 80%;
    text-align: center
  }

  .badge {
    position: absolute;
    right: 20px;
    top: 20px;
    line-height: 24px
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

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


