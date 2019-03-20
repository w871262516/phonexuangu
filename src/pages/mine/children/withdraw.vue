<template>
  <div class="page">
    <header-bar></header-bar>
    <div class="withBanner flex">
      <p class="title">提现</p>
      <p class="tip">我的余额<span class="up">￥ {{balance}}</span></p>
    </div>
    <div class="with-page-content">
        <div style="margin:1rem 0;">
        <van-cell>
            <div class="input-money">
                <span class="normal">金额（元）</span>
                <input type="number" placeholder="请输入0.00元及以上金额" v-model="money">
            </div> 
        </van-cell>
        </div>
        <p style="text-align:start;margin-left:1rem;">我的银行卡</p>
        <van-radio-group v-model="cardId">
          <van-cell-group style="margin:1rem 0;">
            <van-cell clickable @click="chooseCard(i.id)" v-for="i in bankcardList" :key="i.id">
              <div class="cell flex">
                <div class="left">
                  <p>{{i.bank_name}} {{i.card_no}}</p>
                  <p>单笔限额2k 单日限额2w</p>
                </div>
                <div class="right">
                  <van-radio :name="i.id"  checked-color="#d61510"/>
                </div>
              </div>
            </van-cell>
              <van-cell>
              <router-link :to="'/mine/authentication?type=2'">
                <div class="cell add flex">
                    <van-icon name="add-o" />
                    <span>添加银行卡</span>
                </div>
              </router-link>
            </van-cell>
            
          </van-cell-group>
        </van-radio-group>
        <div class="tips">
          <p>温馨提醒</p>
          <p class="up">1、15:00之前体现的客户，钱会退回账户余额</p>
          <p class="up">1、15:00之后体现的客户，当天内快速到账</p>
        </div>
        <van-button class="btn" @click="verify">提现</van-button>
        <pop :type="'password'"  v-if="payShow" @closeDialog="acceptDialog" @confirmDialog="confirmDialog"></pop>
        
    </div>
  </div>
</template>

<script>
import headerBar from "../../../components/headerBar";
import titleBar from "../../../components/titleBar.vue";
import pop from "../../../components/pop";
export default {
  components: {
    headerBar,
    titleBar,pop
  },
  name: "recharge",
  data() {
    return {
      balance:'',
      money:'',
      cardId:'',
      bankcardList:[],
      password:'',
      payShow:false
    };
  },
  created(){
    this.getMymoney();
    this.getMyBankcard();
  },
  watch: {
    active(val) {
      console.log(val);
    }
  },
  methods:{
    getMymoney(){
      var that = this;
      this.$post_token(this.API_HOST + '/api/v1/account/available_amount', {authorization:this.getToken()}, res => {
        console.log("我的可用余额", res.data);
        if (res.data.code == 200) {
          that.balance = res.data.data.available_balance
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
    getMyBankcard(){
      var that = this;
      this.$post_token(this.API_HOST + '/api/v1/account/my_bank_list', {authorization:this.getToken()}, res => {
        console.log("我的银行卡", res.data);
        if (res.data.code == 200) {
          that.bankcardList = res.data.data
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
    chooseCard(id){
      this.cardId = id;
    },
    verify(){
      if(this.money == ''){
        this.$toast("请输入金额");
        return
      }else if(this.cardId == ''){
        this.$toast("请选择提现银行卡");
        return
      }
      this.payShow = true;
    },
    withdraw(){
      var that = this;
      var data = {
        authorization:this.getToken(),
        bank_id:this.cardId,
        amount:this.money,
        password:this.password,

      }
      this.$post_token(this.API_HOST + '/api/v1/account/applyWithdrawal', data, res => {
        console.log("提现", res.data);
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
    //确认 弹框关闭
    confirmDialog(val){
      console.log(val);
      this.password = val;
      this.withdraw();
      this.payShow = false
    },
    //关闭弹窗
    acceptDialog(val){
        console.log(val);
        this.payShow = false;
    },
  },
};
</script>
<style lang="less" scoped>
.page {
  .withBanner {
    background-color: #262632;
    border-bottom-left-radius: 40px;
    padding: 0 1rem 2rem 1rem;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 24px;
      margin-left: 2rem;
    }
    .tip {
      margin-left: 3rem;
      span{
        font-size: 1.3rem;
        margin-left: 1rem;
        vertical-align: middle;
      }
    }
  }
  .with-page-content {
    width: calc(100% - 20px);
    margin: 0 10px;
    
    .cell{
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 12px;
      letter-spacing: 1px;
      p{
        &:first-child{
            font-size: 14px;
        }
      }
      span{
          padding:0 .6rem;
      }
    }
    .input-money{
        font-size: 14px;
        input{
           background:#363544;
           border:none;
           color: #e6e6e6;
        }
        
    }
    .add{
      justify-content: center;
      font-size: 16px;
      line-height: 2rem;
    }
    .tips{
      font-size: 12px;
      text-align: start;
      line-height: 1.4rem;
      margin: 1rem;
    }
    .btn{
      margin-top: 1rem;
    }
  }
}
</style>
<style scope>

</style>


