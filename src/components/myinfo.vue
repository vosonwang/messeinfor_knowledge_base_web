<template>
  <Dropdown id="user" style="margin:-85px 20px auto auto; float: right;" @on-click="handleClick">
    <Button type="primary">
      User
      <Icon type="arrow-down-b"></Icon>
    </Button>
    <DropdownMenu slot="list">
      <DropdownItem name="logout">退出</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  export default {
    name: "myinfo",
    methods: {
      handleClick(name) {

      }
    }
  }
</script>

<style scoped>

</style>
