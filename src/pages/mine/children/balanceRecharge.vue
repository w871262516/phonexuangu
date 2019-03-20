<template>
  <div class="page">
    <header-bar></header-bar>
    <title-bar :title="'余额充值'" ></title-bar>
    <div class="page-content recharge">
        <div>
        <van-cell  icon="idcard"  style="text-align:start;color:#D61410;font-size:12px;">
            <template slot="title">
                <span class="custom-text normal" >{{bankcard.card_no}}</span>
            </template>
            <p class="up" style="font-size:12px" @click="to">{{changeText}}</p>
        </van-cell>
        </div>
        <div style="margin:1rem 0;">
        <van-cell>
            <div class="input-money">
                <span class="normal">金额（元）</span>
                <input type="number" placeholder="请输入0.00元及以上金额" v-model="money">
            </div> 
        </van-cell>
        </div>
        <p style="font-size:12px;text-align:start;margin-bottom:4rem;">充值免手续费 <span class="up">《充值协议书》</span></p>
      
        <van-button class="btn" @click="payShow = true">确认支付</van-button>
        <pop :type="'password'"  v-if="payShow" @closeDialog="acceptDialog"></pop>
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
      payShow:false,
      bankcard:{card_no:''},
      url:'/mine/chooseBank',
      changeText:'更换',
      money:'',

    };
  },
  created(){
    if(this.$route.params.bankCard){
      that.bankcard = this.$route.params.bankCard
    }else{
      this.getMyBankcard()
    }
    
  },
  watch: {
    active(val) {
      console.log(val);
    }
  },
  methods:{
      to(){
        this.$router.push(this.url)
      },
      getMyBankcard(){
        var that = this;
        this.$post_token(this.API_HOST + '/api/v1/account/my_bank_list', {authorization:this.getToken()}, res => {
          console.log("我的银行卡", res.data);
          if (res.data.code == 200) {
            that.bankcard = res.data.data[0]
            if(res.data.data.length<2){
              that.changeText = '添加'
              that.url = {
                path:'/mine/authentication',
                query:{type:2}
              }
              
            }
          } else {
            that.$toast(res.data.msg);
          }
        });
      },
      //关闭弹窗
      acceptDialog(val){
          console.log(val);
          this.payShow = false;
      },

  }
};
</script>
<style lang="less" scoped>
.page {
  .page-content {
    width: calc(100% - 20px);
    margin: 10px;
    .input-money{
        font-size: 14px;
        input{
           background:#363544;
           border:none;
           color: #e6e6e6;
        }
        
    }
  }
}
</style>
<style scope>

</style>


