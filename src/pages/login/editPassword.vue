<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <title-bar :title="'修改密码'"></title-bar>
    <div class="tab flex">
      <div class="tab-item" :class="type==0?'active':''" @click="type=0">登陆密码</div>
      <div class="tab-item" :class="type==1?'active':''" @click="type=1">支付密码</div>
    </div>
    <!-- 登录密码 -->
    <div class="register" v-if="type==0">
      <van-cell-group>
        <van-field
          :border="false"
          v-model="loginPw.oldPassword"
          left-icon="lock"
          type="password"
          placeholder="旧密码"
        />
        <van-field
          :border="false"
          v-model="loginPw.password"
          left-icon="lock"
          type="password"
          placeholder="请设置您的密码（至少6位，英文数字皆可）"
        />
        <van-field
          :border="false"
          v-model="loginPw.secPassword"
          left-icon="lock"
          type="password"
          placeholder="请再次输入您的密码"
        />
      </van-cell-group>
    </div>
    <!-- 支付密码 -->
    <div class="register" v-if="type==1">
        <van-cell-group>
          <van-field
            :border="false"
            :value="payPw.maskPhone"
            left-icon="phone-o"
            :disabled="true"
            placeholder="请输入手机号码"
          />
            <van-field
                :border="false"
                v-model="payPw.picCode"
                left-icon="info-o"
                placeholder="请输入图形验证码"
            >
            <van-button slot="button" size="small"
            :style="{backgroundImage:'url('+picCodeSrc+')'}"
            @click="getImg"></van-button>
            </van-field>
            <van-field
                :border="false"
                v-model="payPw.code"
                left-icon="passed"
                placeholder="获取验证码"
            >
              <van-button slot="button" size="small" @click="getCode">获取验证码</van-button>
            </van-field>
        </van-cell-group>
        <van-cell-group>
        <van-field
          :border="false"
          v-model="payPw.payPassword"
          left-icon="lock"
          type="password"
          placeholder="请设置您的密码"
        />
        <van-field
          :border="false"
          v-model="payPw.paySecPassword"
          left-icon="lock"
          type="password"
          placeholder="请再次输入您的密码"
        />
      </van-cell-group>
      <p class="tip up">注：支付密码为6位数字</p>
    </div>
    <van-button class="btn" @click="editPassword">提 交</van-button>
  </div>
</template>

<script>
import navBar from "../../components/headerBar.vue";
import titleBar from "../../components/titleBar.vue";
export default {
  name: "register",
  components: {
    navBar,
    titleBar
  },
  data() {
    return {
      type:0,
      loginPw:{
        oldPassword: "",
        password: "",
        secPassword: "",
      },
      payPw:{
        maskPhone:'',
        phone:'',
        picCode:'',
        code:'',
        payPassword:'',
        paySecPassword:'',
      },
      picCodeSrc:'',
      picCode_name:'',
    };
  },
  watch:{
    type(val){
      if(val == 1){
        this.getImg()
        this.payPw.maskPhone = this.$store.state.user.userInfo.phone
        this.payPw.phone = this.$store.state.user.phone
      }
    }
  },
  methods: {
    // 表单验证
    verify(type) {
      if(type==0){
        if (this.loginPw.oldPassword.length == 0) {
          this.$toast("请填写旧密码");
          return false;
        } else if (this.loginPw.oldPassword.length < 6) {
          this.$toast("旧密码格式错误");
          return false;
        }

        if (this.loginPw.password.length == 0) {
          this.$toast("请填写密码");
          return false;
        } else if (this.loginPw.password.length < 6) {
          this.$toast("密码格式错误");
          return false;
        }

        if (this.loginPw.password != this.loginPw.secPassword) {
          this.$toast("密码不一致");
          return false;
        }
      }else if(type==1){
        if (this.payPw.picCode.length == 0) {
          this.$toast("请填写图形验证码");
          return false;
        } else if (this.payPw.picCode.length < 4) {
          this.$toast("图形验证码错误");
          return false;
        }
      }else if(type==2){
        if (this.payPw.code.length == 0) {
          this.$toast("请填写验证码");
          return false;
        } else if (this.payPw.code.length < 4) {
          this.$toast("验证码错误");
          return false;
        }
        if (this.payPw.payPassword.length == 0) {
          this.$toast("请填写密码");
          return false;
        } else if (this.payPw.payPassword.length < 6) {
          this.$toast("密码格式错误");
          return false;
        }
        if (this.payPw.payPassword != this.payPw.paySecPassword) {
          this.$toast("密码不一致");
          return false;
        }
      }
      return true;
    },
    
    //图形验证码
    getImg() {
      var that = this;
      this.$get(this.API_HOST + "/api/v1/getImgVerifyCode", {}, res => {
        if (res.data.code == 200) {
          that.pic_name = res.data.data.img_cache_name;
          that.picCodeSrc = res.data.data.img_cache_data;
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
    //手机验证码
    getCode() {
      if (!this.verify(1)) {
        return;
      }
      var that = this;
      var data = {
        phone: this.payPw.phone,
        type: 7, //1 注册短信验证 7 修改支付密码验证 13 绑定银行卡验证
        image_name: this.pic_name,
        image_code: this.payPw.picCode
      };

      this.$post(this.API_HOST + "/api/v1/sendPhoneSMS", data, res => {
        console.log("发送手机验证码", res.data);
        that.$toast(res.data.msg);
        if(res.data.code == 400){
          that.getImg();
        }
      });
    },
    editPassword() {
      if(this.type==0){
        //修改登录密码
        if (!this.verify(0)) {
          return;
        }
        var url = "/api/v1/account/edit_password"
        var data = {
          authorization: this.getToken(),
          old_password: this.loginPw.oldPassword,
          new_password: this.loginPw.password
        };
      }else{
        //修改支付密码
        if (!this.verify(2)) {
          return;
        }
        var url = "api/v1/account/edit_pay_password"
        var data = {
          authorization: this.getToken(),
          phone_code: this.payPw.code,
          password: this.payPw.payPassword,
        };
      }

      var that = this;
      this.$post_token(this.API_HOST + url, data, res => {
        console.log("修改密码", res.data);
        if (res.data.code == 200) {
          that.$toast(res.data.msg);
        } else {
          that.$toast(res.data.msg);
          if(res.data.code == 400){
            that.getImg();
            that.payPw.picCode = '';
            that.payPw.code = '';
            that.payPw.payPassword = '';
            that.payPw.paySecPassword = '';
          }
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page {
  width: calc(100% - 20px);
  margin: 10px;
  .tab {
    background: #363544;
    line-height: 32px;
    margin: 20px 0 10px 0;
    padding: 10px 15px;
    border-radius: 10px;
    justify-content: space-around;
    font-size: 16px;
    .tab-item {
      // padding: 0 12%;
      width: 50%;
      &:first-child {
        border-right: 1px solid #4a495f;
      }
    }
  }
  .register {
    padding: 10px 0;
    .van-field{
      .van-button{
          width: 100px;
          height: 32px;
          background: #363544;
          border-radius: 10px;
          color:#e6e6e6;
      } 
      &:first-child {
          .van-button {
              background-size: 100% 100%;
              background-repeat: no-repeat;
          }
      }
      &:nth-child(2){
          .van-button{
              background: url('../../../static/img/common/btn.png');
              background-size: 100% 100%;
              border: none;
          } 
      }
        
    }
    .tip{
      text-align: end;
      margin-bottom: 1rem;
    }
  }
}
</style>
<style scoped>
.van-cell {
  border-bottom: 1px solid #4a495f;
}
.van-cell-group {
    margin-bottom: 2rem;
}
</style>


