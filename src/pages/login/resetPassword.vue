<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <title-bar :title="'重置密码'"></title-bar>
    <div class="register">
        <van-cell-group>
            <van-field
                :border="false"
                v-model="phone"
                left-icon="phone-o"
                placeholder="请输入手机号码"
            />
            <van-field
                :border="false"
                v-model="password"
                left-icon="lock"
                type="password"
                placeholder="请设置您的密码（至少6位，英文数字皆可）"
            />
            <van-field
                :border="false"
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
                left-icon="info-o"
                placeholder="请输入图形验证码"
            >
                <van-button slot="button" size="small"
                :style="{backgroundImage:'url('+picCodeSrc+')'}"
                @click="getImg"></van-button>
            </van-field>
            <van-field
                :border="false"
                v-model="code"
                left-icon="passed"
                placeholder="获取验证码"
            >
                <van-button slot="button" size="small" @click="getCode">获取验证码</van-button>
            </van-field>
        </van-cell-group>
    </div>
    <van-button class="btn" @click="reset">重 置</van-button>
  </div>
</template>

<script>
import navBar from '../../components/headerBar.vue'
import titleBar from '../../components/titleBar.vue'
export default {
  name: 'register',
  components:{
      navBar,titleBar
    },
  data () {
     return {
      phone:'',
      password:'',
      secPassword:'',
      picCode:'',
      code:'',
      picCodeSrc:'',
      pic_name:'',
    };
  },
  created() {
    this.getImg();
  },
  methods: {
    // 表单验证
   verify(type) {
      if (type == 1) {
        //点击重置时再验证code
        if (this.code.length == 0) {
          this.$toast("请填写验证码");
          return false;
        } else if (this.code.length < 4) {
          this.$toast("验证码错误");
          return false;
        }
      }
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
      if (!this.verify()) {
        return;
      }
      var that = this;
      var data = {
        phone: this.phone,
        type: 15, //1 注册短信验证 7 修改支付密码验证 13 绑定银行卡验证 15 重置登陆密码
        image_name: this.pic_name,
        image_code: this.picCode
      };

      this.$post(this.API_HOST + "/api/v1/sendPhoneSMS", data, res => {
        that.$toast(res.data.msg);
      });
    },
    reset(){
      if (!this.verify(1)) {
        return;
      }
      var that = this;
      var data = {
        authorization: this.getToken(),
        phone_code: this.pic_name,
        password: this.picCode
      };

      this.$post(this.API_HOST + "/api/v1/account/forgetLoginPassword", data, res => {
        that.$toast(res.data.msg);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page{
    width:calc(100% - 20px);
    margin: 10px;
    .tab{
        background: #363544; 
        line-height: 32px;
        margin: 20px 0 10px 0;
        padding: 10px 15px;
        border-radius: 10px;
        justify-content: space-around;
        font-size: 16px;
        .tab-item{
            // padding: 0 12%;
            width: 50%;
            &:first-child{
                border-right: 1px solid #4A495F;
            }
        }
    }
    .register{
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
        
    }
}
</style>
<style scoped>
.van-cell{
    border-bottom: 1px solid #4A495F;
  align-items: center;
}
.van-cell-group{
    margin-bottom: 20px;
}
.van-cell:nth-child(2n){
    background-color: #363544;
}
</style>


