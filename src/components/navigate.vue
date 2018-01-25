<style scoped>

</style>

<template>
  <Menu mode="horizontal" theme="light" :active-name="activeKey" @on-select="handleSelect">
    <MenuItem name="/toc/zh-CN">
      <Icon type="ios-paper"></Icon>
      文档目录
    </MenuItem>
    <MenuItem name="/allalias">
      <Icon type="stats-bars"></Icon>
      别名管理
    </MenuItem>
  </Menu>
</template>

<script>
    export default {
        name: "navigate",
      data(){
          return{
            activeKey:this.$route.path
          }
      },
      methods:{
        handleSelect (path) {
          if (this.lang === 'en-US') path += '-en';
          this.$nextTick(() => {
            this.$router.push(path);
          });
        },
      }
    }
</script>

