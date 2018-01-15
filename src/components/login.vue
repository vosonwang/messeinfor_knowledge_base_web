<style scoped>

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
                /*TODO */
                console.log(_self.$refs[name])
              } else {
                if (data === "用户名密码错误！") {
                  _self.$Message.error({
                    content: "用户名或密码错误！",
                    duration: 2,
                  })
                } else {
                  /*登录成功后，先设定cookie，因为之后马上要请求数据，必须要有token*/
                  cookie.setCookie("Authorization", data.token, 1);
                  _self.switchLogin(false);
                }

              }
            })

          }
        })
      },
      ...mapActions(['switchLogin', 'getTocs'])

    }
  }
</script>

