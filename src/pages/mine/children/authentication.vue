<template>
  <div class="auth-page">
    <nav-bar></nav-bar>
    <div class="authBanner">
      <p class="title">{{title}}</p>
      <p class="tip">{{tip}}</p>
    </div>
    <div class="page-content">
      <div class="steps" v-if="!$route.query.type">
        <div class="steps-circle flex">
          <div class="steps-item flex">
            <i :class="active>=0?'points':'checked'"></i>
          </div>
          <div class="steps-item flex">
            <i :class="active>=1?'points':'checked'"></i>
          </div>
          <div class="steps-item flex">
            <i :class="active==2?'points':'checked'"></i>
          </div>
        </div>
        <div class="steps-text flex">
          <p class="active">绑定身份</p>
          <p>设置密码</p>
          <p>设置银行卡</p>
        </div>
      </div>
      <!-- 绑定身份 -->
      <div v-if="active==0">
        <van-cell-group style="margin-top:2rem;">
            <van-field
                :border="false"
                v-model="realName"
                left-icon="contact" color="#292836"
                placeholder="请输入您的真实姓名" style="border-bottom: 1px solid #4A495F;"
            />
            <van-field
                :border="false"
                v-model="idcard"
                type="number"
                left-icon="idcard"
                placeholder="请输入您的身份证号码"
            />
        </van-cell-group>
        <p class="tip">点击按钮，表示您已同意****通过依法成立的相关机构认证本人姓名和身份证号的</p>
        <van-button class="btn" @click="authRealName">同意授权并提交</van-button>
      </div>
      
      <!-- 设置密码 -->
      <div  v-if="active==1">
        <van-cell-group style="margin-top:2rem;">
            <van-field
                :border="false"
                v-model="password" type="password"
                left-icon="lock" color="#292836"
                placeholder="请输入6位数字密码" style="border-bottom: 1px solid #4A495F;"
            />
            <van-field
                :border="false" v-model="secPassword"
                left-icon="lock" type="password"
                placeholder="请再次输入您的数字密码"
            />
        </van-cell-group>
        <van-button class="btn" @click="setPayPw">下一步</van-button>
      </div>
      <div class="bind-card" v-if="active==2">
          <van-cell-group style="margin-top:2rem;color:#fff;">
            <van-field
                :border="false" v-model="username"
                 label="持卡人："
                placeholder="请填写持卡人姓名" 
                style=""
            />
            <van-field
                :border="false" v-model="bankIdCard"
                 label="身份证："  type="number"
                placeholder="请填写身份证号" 
                style=""
            />
            <van-field
                :border="false" v-model="bankNum"
                 label="银行卡：" type="number"
                placeholder="请填写银行卡号" 
                style=""
            />
            <van-field
                :border="false" v-model="phone"
                 label="手机号："  type="number"
                placeholder="请填写银行银行预留手机号"
            />
            <van-field
                :border="false" v-model="branchName"
                 label="开户行：" @click="getProvince"
                placeholder="请填写银行开户行"
            />
            <!-- 省 -->
            <van-picker :columns="areaList.name" v-if="provinceShow"  @confirm="confirmProvince" show-toolbar
             @cancel="provinceShow = false"/>
             <!-- 市 -->
            <van-picker :columns="cityList.name" v-if="cityShow"  @confirm="confirmCity" show-toolbar
             @cancel="cityShow = false"/>
            <!-- 开户行 -->
            <van-picker :columns="bankList.name" v-if="bankaShow"  @confirm="confirmBank" show-toolbar
             @cancel="bankShow = false"/>

          </van-cell-group>
          <div class="bottom flex">
            <van-icon name="warning-o" size="18px" color="#565568"/>
            <div style="margin-left:.8rem;">
                <p class="tip">手机号需与银行卡预留一致，如有疑问请看<span class="up">这里</span></p>
                <p class="tip">点击提交，表示您同意<span class="up">《银行卡绑定协议》</span></p>
            </div>
        </div>
        <van-button class="last-btn"  @click="sendMsg">同意授权并提交</van-button>
      </div>
      <pop :type="'codeBank'" :data="dialogData" v-if="addShow" @closeDialog="acceptDialog" @confirmDialog="confirmDialog"></pop>
    </div>
  </div>
</template>

<script>
import navBar from "../../../components/headerBar.vue";
import pop from "../../../components/pop";
// import areaList from "../../../assets/area.js";
export default {
  name: "authentication",
  components: {
    navBar,pop
  },
  data() {
    return {
      active: 0,
      title:'实名认证',
      tip:'',
      btnText:'',
      //绑定身份
      realName:'',
      idcard:'',
      //设置密码
      password: '',
      secPassword: '',
      //设置银行卡
      username: '',
      bankIdCard: '',
      bankNum: '',
      phone: '',
      cityCode:'',
      bankArea:'',
      branchName:'',
      bankName:'',
      code:'',
      provinceCode:'',
      bankCode:'',
      //选择器弹窗
      provinceShow:false,
      cityShow:false,
      bankaShow:false,
      //短信弹框
      addShow:false,
      areaList:{
        name:[],
        code:[],
      },
      cityList:{
        name:[],
        code:[],
      },
      bankList:{
        name:[],
        code:[],
      },
      dialogData:{},
    };
  },
  watch:{
    active(val){
        this.changePage()

    }
  },
  created() {
    if(this.$route.query.type){
       this.active = this.$route.query.type 
    }else{
      var that = this;
      this.$post_token(this.API_HOST + '/api/v1/checkUserInfoIntegrity', {authorization:this.getToken()}, res => {
        console.log("校验用户 绑卡 支付密码 实名制 是否完整", res.data);
        if (res.data.code == 200) {
          if(!res.data.data.real_name){
            that.active = 0
          }else if(!res.data.data.pay_password){
            that.active = 1
          }else if(!res.data.data.bind_bank){
            that.active = 2
          }else{
            that.active = 2
            that.$toast("已完成实名绑卡");
            var ti = setTimeout(() => { 
              clearTimeout(ti)
              that.$router.go(-1)
            }, 1500);
          
          }
        } else {
          that.$toast(res.data.msg);
        }
      });
    }
    this.changePage()
  },

  methods: {
      changePage(){
        if(this.active==0) {
            this.title = "实名认证";
            this.tip = "这是您首次添加银行卡，为先保证资金安全，请先完成实名认证"
        }else if(this.active==1){
            this.title = "设置支付密码";
            this.tip = "为了您的资金安全，请您设置用于交易的6位数字交易密码"
        }else if(this.active==2){
            this.title = "设置银行卡";
            this.tip = "添加您的付款银行卡，请填写与"+this.realName+"一致的储蓄卡"
        }
      },
			checkIdnum(idcard){
				// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
				if(reg.test(idcard) === false) { 
					return false; 
				}else{
					return true;
				}
			},
      authRealName(){
        if(this.realName.length == 0){
          this.$toast("请输入姓名");
          return
        }
        if(!this.checkIdnum(this.idcard)){
          this.$toast("身份证格式错误");
          return
        }
        var that = this;
        var data = {
          authorization:this.getToken(),
          id_number:this.idcard,
          name:this.realName
        }
        this.$post_token(this.API_HOST + '/api/v1/account/authRealName', data, res => {
          console.log("实名认证", res.data);
          if (res.data.code == 200) {
            that.$toast(res.data.msg);
            that.active = 1
          } else {
            that.$toast(res.data.msg);
          }
        });
      },
      // 设置支付密码
      setPayPw(){
        if(!(/(^\d{6}$)/).test(parseInt(this.password))){
          this.$toast("请输入6位数字密码");
          return
        }
        if(this.secPassword != this.password){
          this.$toast("密码不一致");
          return
        }
        var that = this;
        var data = {
          authorization:this.getToken(),
          password:this.password,
          repassword:this.secPassword
        }
        this.$post_token(this.API_HOST + '/api/v1/account/set_pay_password', data, res => {
          console.log("设置密码", res.data);
          if (res.data.code == 200) {
            that.$toast(res.data.msg);
            that.active = 2
          } else {
            that.$toast(res.data.msg);
          }
        });
      },
      confirmProvince(picker,value){
        console.log(picker,value);
        this.provinceCode = this.areaList.code[value];
        this.bankArea = picker
        this.provinceShow = false
        this.getCity()
      },
      confirmCity(picker,value){
        console.log(picker,value);
        this.cityCode = this.cityList.code[value];
        this.bankArea = this.bankArea+picker
        this.cityShow = false
        this.getBank()
      },
      confirmBank(picker,value){
        console.log(picker,value);
        this.branchName = picker;
        this.bankaShow = false
      },
      getProvince(){
        if(this.bankNum.length == 0){
          this.$toast("请先输入银行卡号");
          return
        }
        var that = this;
        var data = {'authorization':this.getToken()}
        this.$post_token(this.API_HOST + '/api/v1/getAreaList', data, res => {
          console.log("获取 省 列表信息", res.data);
        if (res.data.code == 200) {
            res.data.data.forEach(item => {
                that.areaList.name.push(item.area_name);
                that.areaList.code.push(item.area_code);
            });
            that.provinceShow = true
            console.log(">>>>>>>>>>>>",that.areaList);
            
          }
          
        });
      },
      getCity(){
        var that = this;
          var data = {
            'authorization':this.getToken(),
            'parent_code':this.provinceCode
          }
        this.$post_token(this.API_HOST + '/api/v1/getAreaList', data, res => {
          console.log("获取 市 列表信息", res.data);
        if (res.data.code == 200) {
            res.data.data.forEach(item => {
                that.cityList.name.push(item.area_name);
                that.cityList.code.push(item.area_code);
            });
            that.cityShow = true
          }
        });
      },
      getBank(){
        var that = this;
          var data = {
            'authorization':this.getToken(),
            'area_code':this.cityCode,
            'bank_no':this.bankNum
          }
        this.$post_token(this.API_HOST + '/api/v1/getAreaBranchBank', data, res => {
          console.log("获取 银行卡 列表", res.data);
        if (res.data.code == 200) {
            that.bankName = res.data.data.bank_info.bankName
            that.bankCode = res.data.data.bank_info.bank_code
            res.data.data.list.forEach(item => {
                that.bankList.name.push(item.bnk_name);
                that.bankList.code.push(item.cls_code);
            });
            that.bankaShow = true
          }else{
            that.$toast(res.data.msg);
          }
        });
        
      },
    // 绑定银行卡
    bindBank(){
        var that = this;
        var data = {
          authorization:this.getToken(),
          holder_user_name:this.username,
          holder_user_no:this.bankIdCard,
          card_no:this.bankNum,
          holder_user_phone	:this.phone,
          phone_code:this.code,
          opening_address:this.bankArea,
          bank_name:this.bankName,
          branch_name:this.branchName,
          bank_code:this.bankCode

        }
        this.$post_token(this.API_HOST + '/api/v1/account/bind_bank', data, res => {
          console.log("绑定银行卡", res.data);
          if (res.data.code == 200) {
            that.$toast(res.data.msg);
            var ti = setTimeout(() => { 
              clearTimeout(ti)
              that.$router.go(-1)
            }, 1500);
          } else {
            that.$toast(res.data.msg);
          }
        });
    },  
    sendMsg(){
        if(this.username.length == 0){
          this.$toast("请先输入持卡人姓名");
          return
        }else if(this.bankIdCard.length == 0){
          this.$toast("请先输入持卡人身份证号");
          return
        }else if(this.bankNum.length == 0){
          this.$toast("请先输入银行卡号");
          return
        }else if(this.phone.length == 0){
          this.$toast("请先输入银行卡预留手机号");
          return
        }else if(this.branchName.length == 0){
          this.$toast("请先选择开户行");
          return
        }else if(!this.checkIdnum(this.bankIdCard)){
          this.$toast("身份证格式错误");
          return
        }else if (!this.isPoneAvailable(this.phone)) {
          this.$toast("手机号格式错误");
          return 
        }
      this.dialogData = { //传给pop组件发短信
        phone:this.phone,
        authorization:this.getToken()
      }
      this.addShow = true;
    },
    //关闭弹窗
    acceptDialog(val){
        console.log(val);
        this.addShow = false;
    },
    confirmDialog(val){
      console.log(val);
      this.code = val
      this.bindBank();
      this.addShow = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.auth-page {
  margin-bottom: 9vh;
  .authBanner {
    background-color: #262632;
    border-bottom-left-radius: 40px;
    padding: 16px 0;
    text-align: start;
    .title {
      font-size: 24px;
      margin: -2rem 0 0.4rem 3rem;
    }
    .tip {
      font-size: 12px;
      margin-left: 3rem;
    }
  }
  .page-content {
    width: calc(100% - 20px);
    margin: 0 10px;

    .steps {
      width: 100%;
      background: #262632;
      margin-top: 1.4rem;
      padding-top: 1rem;
      border-radius: 10px;
      .steps-circle {
        width: 80%;
        margin: 0 auto;
        .steps-item {
          position: relative;
          &:nth-child(1),
          &:nth-child(2) {
            flex: 1;
          }
          .points {
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            background: #d61410;
            border: 1px solid #d61410;
          }
          .checked{
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
            background: #262632;
            border: 1px solid #d61410;
          }
          &:nth-child(1),
          &:nth-child(2) {
            &::after {
              content: "";
              position: absolute;
              left: 56%;
              transform: translate(-50%,-50%);
              top: 50%;
              width: 74%;
              height: 1px;
              border-bottom: 1px dashed #d61410;
            }
          }
        }
      }
      .steps-text {
        justify-content: space-between;
        padding: .6rem 1rem .6rem 1.4rem;
        font-size: 12px;
        color: #565566;
      }
    }
    .tip{
        text-align: start;
        font-size: 12px;
        color: #565566;
        margin-top: .8rem;
    }
    .bottom{
        align-items: center;
    }
    .btn{
        margin-top: 4rem;
    }
    .last-btn{
        background: linear-gradient(top,#E66F50 0,#D61410);
        background-size: 100% 100%;
        border: none;
        margin-top: 2rem;
        width: 50%;
        border-radius: 8px;
        color: #fff;
    }
  }
}
</style>
<style scoped>
</style>


