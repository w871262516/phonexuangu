<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <div class="banner flex">
        <!-- <p :class="type==0?'active':''">申购</p> -->
        <p :class="type==0?'active':''" @click="type = 0">持仓</p>
        <p :class="type==1?'active':''" @click="type = 1">结算</p>
    </div>
    <div class="page-content">
        
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            :offset="50"
            finished-text="没有更多了"
            error-text="请求失败，点击重新加载"
            @load="getPositions"
          >
            <hold-card :holdList="list" v-if="type==0"></hold-card>
          </van-list>
        </van-pull-refresh>
        <settle-card :settleList="list" v-if="type==1"></settle-card>
    </div>
    <bottom-bar :index="3"></bottom-bar>
   </div>
</template>

<script>
import navBar from '../../components/headerBar.vue'
import bottomBar from '../../components/bottomBar'
import holdCard from './conponents/holdCard'
import settleCard from './conponents/settleCard'
export default {
  name: 'position',
  components:{
      navBar,bottomBar,holdCard,settleCard
    },
  data () {
     return {
        type:0,
        choMoney:20,
        period:0,
        buyWay:'市价买入',
        columns: ['市价买入', '市价买入', '市价买入', '市价买入', '市价买入'],
        show2:false,
        list:[],
        loading: false,
        finished: false,
        error: false,
        refreshing: false,
        page: 1
    };
  },
  created(){
      console.log(this.$route.query.active);
      if(this.$route.query.active){
          this.type = this.$route.query.active
      }
      
  },
  methods: {
    onRefresh() {
      console.log("refresh");
      this.page = 1;
      this.finished = false;
    },
    getPositions() {
      console.log("load");
      var that = this;
      var data = {
        authorization: this.getToken(),
        page: this.page
      };
      this.$post_token(this.API_HOST + "/api/v1/trade/holdPositions", data, res => {
        console.log("我的持仓", res.data);
        if (res.data.code == 200) {
            res.data.data = [ {
            "stock_code": "601668",
            "stock_market_code": "sh601668",
            "stock_name": "中国建筑",
            "cycle_name": "两周",
            "trade_no": "19030614123213437499",
            "number_of_strand": 31596,
            "nominal_amount": "200000.00",
            "right_money": "35000.00",
            "right_money_ratio": "0.0700",
            "buying_price": "6.33",
            "buying_last_price": "6.33",
            "apply_time": 1551852752,
            "buying_time": 1551853240,
            "expire_time": 1552953240,
            "state": 10,
            "now_price": "6.40",
            "now_profit": "2211.72"
        },
        {
            "stock_code": "002670",
            "stock_market_code": "sz002670",
            "stock_name": "国盛金控",
            "cycle_name": "两周",
            "trade_no": "19030614150313437248",
            "number_of_strand": 0,
            "nominal_amount": "200000.00",
            "right_money": "35000.00",
            "right_money_ratio": "0.0700",
            "buying_price": "15.15",
            "buying_last_price": "0.00",
            "apply_time": 1551852903,
            "buying_time": 0,
            "expire_time": 0,
            "state": 9,
            "now_price": "16.18",
            "now_profit": 0
        },
        {
            "stock_code": "300050",
            "stock_market_code": "sz300050",
            "stock_name": "世纪鼎利",
            "cycle_name": "两周",
            "trade_no": "19030614142913437138",
            "number_of_strand": 0,
            "nominal_amount": "200000.00",
            "right_money": "50000.00",
            "right_money_ratio": "0.1000",
            "buying_price": "7.09",
            "buying_last_price": "0.00",
            "apply_time": 1551852869,
            "buying_time": 0,
            "expire_time": 0,
            "state": 9,
            "now_price": "7.14",
            "now_profit": 0
        },
        {
            "stock_code": "300702",
            "stock_market_code": "sz300702",
            "stock_name": "天宇股份",
            "cycle_name": "两周",
            "trade_no": "19030614135413437357",
            "number_of_strand": 0,
            "nominal_amount": "200000.00",
            "right_money": "50000.00",
            "right_money_ratio": "0.1000",
            "buying_price": "28.40",
            "buying_last_price": "0.00",
            "apply_time": 1551852834,
            "buying_time": 0,
            "expire_time": 0,
            "state": 9,
            "now_price": "28.90",
            "now_profit": 0
        }]
          if (res.data.data.length == 0) {
            that.finished = true;
          } else {
            if (that.page == 1) {
              that.list = [];
            }
            res.data.data.forEach(item => {
              item.stateText = '持仓中'
              item.buying_time = that.timeFormer(item.buying_time)
              that.list.push(item);
            });
            that.page++;
          }
          that.error = false;
          that.loading = false;
          that.refreshing = false;
        } else {
          that.error = true;
          that.$toast(res.data.msg);
        }
      });
    },
    chooseWay(picker, values) {
        console.log(picker, values);
        this.buyWay = picker;
        this.show2 = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page{
    margin-bottom: 9vh;
    .banner{
        font-size: 20px;
        background-color: #262632;
        border-bottom-left-radius: 40px;
        justify-content: space-around;
        align-items: center;
        padding: 16px 0;
    }
    .page-content{
       width: calc(100%-20px);
       margin: 0 10px; 
    
    }
    
}
</style>
<style scoped>

</style>


