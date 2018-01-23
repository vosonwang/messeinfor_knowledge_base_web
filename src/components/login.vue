<style lang="less">
  @import "../style/login.less";
</style>

<template>
  <Modal id="login" v-model="login" width="300" :closable="false" :mask-closable="false">
    <Form ref="loginForm" :model="loginForm" :rules="ruleInline">
      <FormItem prop="user">
        <Input type="text" v-model="loginForm.username" placeholder="用户名"
               icon="person"></Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="loginForm.password" placeholder="密码"
               icon="ios-locked" @on-enter="signIn('loginForm')"></Input>
      </FormItem>
      <FormItem>
        <Button type="error" size="large" long :loading="loading" @click="signIn('loginForm')">
          登录
        </Button>
      </FormItem>
    </Form>
    <div slot="footer"></div>
  </Modal>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Request from '../util/request'
  import cookie from '../util/cookie'
  import log from '../util/log'
  import util from '../util'


  export default {
    name: "login",
    data() {
      return {
        loading: false,
        loginForm: {
          username: '',
          password: '',
        },

        ruleInline: {
          username: [
            {required: true, message: '请填写用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请填写密码', trigger: 'blur'},
            {
              type: 'string',
              min: 6,
              message: '密码长度不能小于6位',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {
      ...mapState({
          'login': state => state.login,
        }
      ),
    },
    methods: {
      signIn(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let _self = this;
            Request.fetchAsync('/tokens', 'post', _self.loginForm).then(data => {
              _self.loading = false;
              if (!data) {
                /*TODO 改为在登录界面中提示错误*/
                console.log(_self.$refs[name])
              } else {
                if (data === "用户名密码错误！") {
                  _self.$Message.error({
                    content: data,
                    duration: 2,
                  })
                } else {
                  log.print('login：登录成功');
                  this.switchLogin(false);
                  /*登录成功后，先设定cookie，因为之后马上要请求数据，必须要有token
                  * 设定token有效期为2小时
                  * */
                  cookie.setCookie("Authorization", data.token, 1);
                  cookie.setCookie("username", data.username, 1);
                  cookie.setCookie("userId", data.userId, 1);
                  log.print('login：getTOC(0)');
                  //应该改成 login状态监听 有变化则toc组件更新目录
                  this.getTOC(util.langParse(this.$i18n.locale))
                }
              }
            })
          }
        })
      },
      ...mapActions(['getTOC', 'switchLogin'])

    }
  }
</script>

