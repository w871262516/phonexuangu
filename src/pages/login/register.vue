<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <title-bar :title="'注册'"></title-bar>
    <div class="register">
      <van-cell-group>
        <van-field
          :border="false"
          v-model="organization"
          left-icon="contact"
          color="#292836"
          placeholder="请输入机构编码"
        />
        <van-field
          :border="false"
          v-model="phone"
          required
          left-icon="phone-o"
          placeholder="请输入手机号码"
        />
        <van-field
          :border="false"
          required
          v-model="password"
          left-icon="lock"
          type="password"
          placeholder="请设置您的密码（至少6位，英文数字皆可）"
        />
        <van-field
          :border="false"
          required
          v-model="secPassword"
          left-icon="lock"
          type="password"
          placeholder="请再次输入您的密码"
        />
      </van-cell-group>
      <van-cell-group>
        <van-field
          :border="false"
          v-model="picCode"
          required
          left-icon="info-o"
          placeholder="请输入图形验证码"
        >
          <van-button
            slot="button"
            size="small"
            :style="{backgroundImage:'url('+picCodeSrc+')'}"
            @click="getImg"
          ></van-button>
        </van-field>
        <van-field :border="false" v-model="code" required left-icon="passed" placeholder="获取验证码">
          <van-button slot="button" size="small" @click="getCode">获取验证码</van-button>
        </van-field>
      </van-cell-group>

      <div class="contract flex">
        <van-icon
          name="checked"
          :color="isAgree?'#d61510':'#e6e6e6'"
          size="16px"
          @click="isAgree=!isAgree"
        />我已同意并阅读
        <span class="up">《用户注册协议》</span>
      </div>
    </div>
    <van-button class="btn" @click="register" v-if="isAgree">完成注册</van-button>
    <van-button class="btn-disable" v-else>完成注册</van-button>
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
      isAgree: true,
      organization: "",
      phone: "",
      password: "",
      secPassword: "",
      picCode: "",
      picCodeSrc: "",
      pic_name: "", //后台返回，验证用
      code: ""
    };
  },
  created() {
    this.getImg();
  },
  methods: {
    // 表单验证
    verify(type) {
      if (this.phone.length == 0) {
        this.$toast("请填写手机号");
        return false;
      } else if (!this.isPoneAvailable(this.phone)) {
        this.$toast("手机号格式错误");
        return false;
      }
      if (this.password.length == 0) {
        this.$toast("请填写密码");
        return false;
      } else if (this.password.length < 6) {
        this.$toast("密码格式错误");
        return false;
      }
      if (this.password != this.secPassword) {
        this.$toast("密码不一致");
        return false;
      }
      if (this.picCode.length == 0) {
        this.$toast("请填写图形验证码");
        return false;
      } else if (this.picCode.length < 4) {
        this.$toast("图形验证码错误");
        return false;
      }
      if (type == 1) {
        //点击注册时再验证code
        if (this.code.length == 0) {
          this.$toast("请填写验证码");
          return false;
        } else if (this.code.length < 4) {
          this.$toast("验证码错误");
          return false;
        }
      }
      return true;
    },
    //图形验证码
    getImg() {
      var that = this;
      this.$get(this.API_HOST + "/api/v1/getImgVerifyCode", {}, res => {
        console.log("图形验证码",res.data);
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
      if (!this.verify()) {
        return;
      }
      var that = this;
      var data = {
        phone: this.phone,
        type: 1, //1 注册短信验证 7 修改支付密码验证 13 绑定银行卡验证
        image_name: this.pic_name,
        image_code: this.picCode
      };

      this.$post(this.API_HOST + "/api/v1/sendPhoneSMS", data, res => {
        console.log("发短信",res.data);
        that.$toast(res.data.msg);
      });
    },
    register() {
      if (!this.verify(1)) {
        return;
      }
      var that = this;
      var data = {
        institution_code: this.organization,
        phone: this.phone,
        password: this.password,
        repassword: this.secPassword,
        phone_code: this.code
      };

      this.$post(this.API_HOST + "/api/v1/account/register", data, res => {
        console.log("注册",res.data);
        if (res.data.code == 200) {
          that.$toast(res.data.msg);
          that.$router.push("/login");
        } else {
          that.$toast(res.data.msg);
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
  .register {
    padding: 40px 0;
    .van-field {
      .van-button {
        width: 100px;
        height: 32px;
        background: #363544;
        border-radius: 10px;
        color: #e6e6e6;
      }
      &:first-child {
        .van-button {
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
      }
      &:nth-child(2) {
        .van-button {
          background: url("../../../static/img/common/btn.png");
          background-size: 100% 100%;
          border: none;
        }
      }
    }
  }
  .contract {
    text-align: start;
    .van-icon {
      margin: 2px 4px;
    }
  }
}
</style>
<style scoped>
.van-cell {
  border-bottom: 1px solid #4a495f;
  align-items: center;
}

.van-cell-group {
  margin: 20px 0;
}
.van-cell:nth-child(2n) {
  background-color: #363544;
}
</style>


