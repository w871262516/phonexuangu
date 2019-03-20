<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <title-bar :title="'确认订单'"></title-bar>
    <div class="page-content">
        <div class="bottom">
            <div class="item flex">
            <span>标的股票：</span>
            <span>{{applyInfo.stock_name}}({{applyInfo.stock_code}})</span>
            </div>
            <div class="item flex">
            <span>执行金</span>
            <span>{{applyInfo.nominal_amount}}万</span>
            </div>
            <div class="item flex">
            <span>选买周期：</span>
            <span>{{cycleText}}</span>
            </div>
            <div class="item flex">
            <span>买入方式：</span>
            <span>市价买入</span>
            </div>
            <div class="item flex">
            <span>选买倍数：</span>
            <span>11</span>
            </div>
            <div class="item flex">
            <span>选买服务费：</span>
            <span class="up">4410.00</span>
            </div>
            <div class="item flex">
            <span>账户余额：</span>
            <span class="up">{{balance}}</span>
            </div>
        </div>
        <table>
            <tr>
                <td>预期涨幅</td>
                <td>盈亏比例</td>
                <td>盈利金额</td>
            </tr>
            <tr class="up">
                <td>8.92%</td>
                <td>0%</td>
                <td>4410.00</td>
            </tr>
            <tr class="up">
                <td>8.92%</td>
                <td>0%</td>
                <td>4410.00</td>
            </tr>
            <tr class="up">
                <td>8.92%</td>
                <td>0%</td>
                <td>4410.00</td>
            </tr>
        </table>
        <div class="contract flex">
            <van-icon name="checked" size="16px" color="#D61410"/>
            我已同意并阅读<span class="up">《用户注册协议》</span>
        </div>
        <van-button class="btn"  @click="payShow = true">立即认购</van-button>
        <pop :type="'password'"  v-if="payShow" @closeDialog="acceptDialog" @confirmDialog="apply"></pop>
    </div>
  </div>
</template>

<script>
import navBar from "../../components/headerBar.vue";
import titleBar from "../../components/titleBar";
import pop from "../../components/pop";
export default {
  name: "order",
  components: {
    navBar,
    titleBar,pop
  },
  data() {
    return {
        payShow:false,//支付弹窗
        cycleText:'两周',//选买周期
        balance:'',//可用余额
        applyInfo:{}//申购参数
    };
  },
  created() {
    console.log(this.$route.query);
    this.applyInfo = {...this.$route.query};
    if(this.$route.query.cycle_id==1){//选买周期 
        this.applyInfo.cycle = 14
    }else if(this.$route.query.cycle_id==2){
        this.applyInfo.cycle = 30
        this.cycleText = '一个月'
    }else{
        this.applyInfo.cycle = 60
        this.cycleText = '两个月'
    }
    this.getMymoney();
  },
  methods: {
    //关闭支付弹窗
    acceptDialog(val){
        console.log(val);
        this.payShow = false;
    },
    apply(val){
    this.applyInfo.pay_password = val
    var that = this;
    this.applyInfo.authorization = this.getToken();
    console.log(this.applyInfo);
    this.$post_token(
        this.API_HOST + "/v1/trade/applyPurchase", this.applyInfo, res => {
            console.log("申购", res.data);
            if (res.data.code == 200) {
                that.$toast(res.data.msg);
                var ti = setTimeout(() => {
                    that.to('/position')
                    clearTimeout(ti)
                }, 1500);
            } else {
                that.$toast({
                    forbidClick: true,
                    message:res.data.msg
                })
                that.payShow = false;
            }
        }
    );
    },
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page {
  width: 100%;
  .page-content {
      width: calc(100% - 20px);
      margin: 10px;
    .bottom {
      background: #3a3949;
      margin-top: 1rem;
      border-radius: 10px;
      .item {
        padding: .8rem;
        justify-content: space-between;
        color: #d7d7d7;
        border-bottom: 1px solid #4A495F;
        &:last-child{
            border-bottom: none;
        }
        span{
            color: #BABABA;
        }
        .up{
            color: #D61410;
        }
      }
    }
    table{
        width: 100%;
        font-size: 14px;
        background-color: #3A3949;
        padding: 10px 5px;
        margin: 1rem 0;
        border-radius: 10px;
        td{
            padding: .4rem 0;
        } 
        
    }
    .contract{
        text-align: start;
        .van-icon{
            margin: 2px 4px;
        }
    }
    .btn{
        margin-top: 1rem;
    }
  }
}
</style>
<style scoped>

</style>


