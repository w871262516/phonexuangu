<template>
  <div class="login-page">
    <div class="logo pore flex">
        <div class="center">logo</div>
    </div>
    <div class="tab flex">
        <p style="color:#d32115">登 录</p>
        <router-link to="/register">
          <p>注 册</p>  
        </router-link>
        
    </div>
    <div class="input flex">
        <van-cell-group>
            <van-field
                :border="false"
                v-model="phone"
                label="用户名"
                placeholder="请输入用户名/手机号"
            />
        </van-cell-group>
        <van-cell-group>
            <van-field
                :border="false"
                v-model="password"
                type="password"
                label="密码"
                placeholder="请输入密码"
            />
        </van-cell-group>
        <van-button type="default" @click="login">登录</van-button>
        
        <router-link to="/resetPassword">
          <p>忘记密码</p>  
        </router-link>
        
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
     return {
      phone:'',
      password:''
    };
  },
  methods: {
    login(){
      if (this.phone.length == 0) {
        this.$toast("请填写手机号");
        return ;
      } else if (!this.isPoneAvailable(this.phone)) {
        this.$toast("手机号格式错误");
        return ;
      }
      if (this.password.length == 0) {
        this.$toast("请填写密码");
        return ;
      } else if (this.password.length < 6) {
        this.$toast("密码格式错误");
        return ;
      }
      var that = this;
      var data = {
        phone: this.phone,
        password: this.password,
      };
      this.$post(this.API_HOST + "/api/v1/account/login", data, res => {
        console.log("登录",res.data);
        if(res.data.code == 200){
            localStorage.setItem('token',res.data.refresh_jwt_token)
            that.$store.commit('SET_USER', {'phone':that.phone,'token':res.data.refresh_jwt_token})
            that.$toast(res.data.msg);
            that.$router.push('/')
        }else{
            that.$toast(res.data.msg);
        }
        
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login-page{
    width:calc(100% - 20px);
    margin: 10px;
    color: #585769;
    .logo{
        justify-content: center;
        width: 100%;
        height: 70vw;
        div{   
            width: 30vh;
            height: 30vh;
            background-color: #d32115;
            border-radius: 50%;
            border: 5px solid #fff;
        }
    }
    .tab{
        justify-content: space-around;
        font-size: 18px;
        margin-top: 20px;
    }
    .input{
        width: 100%;
        flex-direction: column;
        justify-content: center;
        p{
            margin-top: 40px;
        }
    }
}
</style>
<style scoped>
.van-button{
    background: linear-gradient(top,#f37859 0,#c51003);
    border: none;
    border-radius: 10px;
    color:#e6e6e6;
    margin-top: 20px;
}
.van-field{
    border-radius: 10px;
    margin: 10px 0;
}
.van-cell{
    flex-direction: column;
}
</style>


