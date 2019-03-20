<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <title-bar :title="'申购'"></title-bar>
    <div class="item">
        <div class="title">
            <span>标的股票</span>
            <img src="../../../static/img/common/question.png" alt="">
        </div>
        <div class="search flex">
            <van-icon  name="search" size="20px"/>
            <input type="text" v-model="stockName" @click="donotSear = true">
        </div>
        <div class="info">
            <span>最新价：</span><span class="price up">{{nowPrice}} </span>
            <span class="detail" @click="detail">详情 </span>
            
        </div>
        <van-list class="list" v-if="searchList.length&&donotSear">
            <van-cell v-for="(item,index) in searchList" :key="index">
            <div class="list-item normal flex small">
                <div class="normal">{{item.stock_market_code}}</div>
                <div class="normal">{{item.stock_name}}</div>
                <div>
                <van-button class="btn-small" @click="addOne(item)">确认</van-button>
                </div>
            </div>
            </van-cell>
        </van-list>
    </div>

    <div class="payment item">
        <div class="title">
            <span>执行金</span>
        </div>
        <div class="money flex">
           <div class='cap' :class=" choMoney==20?'cho-ed':'cho'" @click="choMoney = 20">20</div>
           <div class='cap' :class="choMoney==30?'cho-ed':'cho'" @click="choMoney = 30">30</div>
           <div class='cap' :class="choMoney==50?'cho-ed':'cho'" @click="choMoney = 50">50</div>
           <div class='cap' :class="choMoney==100?'cho-ed':'cho'" @click="choMoney = 100">100</div>
        </div>
        <input type="number" v-model="choMoney">万元
        
    </div>

    <div class="item">
        <div class="title">
            <span>选买周期</span>
            <img src="../../../static/img/common/question.png" alt="">
        </div>
        <div class="money flex">
           <div class='pei' :class="period==1?'cho-ed':'cho'" @click="period = 1">两周</div>
           <div class='pei' :class="period==2?'cho-ed':'cho'" @click="period = 2">一个月</div>
           <div class='pei' :class="period==3?'cho-ed':'cho'" @click="period = 3">两个月</div>
        </div>
    </div>
    <div class="item" >
        <div class="title" style="margin-bottom:10px;">
            <span>买入方式</span>
            <img src="../../../static/img/common/question.png" alt="">
            <span style="position:absolute;right:40px;" @click="show2 = true;">{{buyWay}}</span>
        </div>
        <van-popup
            v-model="show2"
            position="bottom" close-on-click-overlay
        >
            <van-picker show-toolbar
            :columns="columns"
            @confirm="chooseWay"
            @cancel="show2 = false"
            />
        </van-popup>
    </div>
    <van-button class="btn" @click="ensureBuy">确定买入</van-button>
    <bottom-bar  :index="2"></bottom-bar>
  </div>
</template>

<script>
import navBar from '../../components/headerBar.vue'
import titleBar from '../../components/titleBar'
import bottomBar from '../../components/bottomBar'
export default {
  name: 'myInfo',
  components:{
      navBar,titleBar,bottomBar
    },
  data () {
     return {
        type:0,
        choMoney:20,
        period:1,
        stockName:'',
        stockInfo:{},//搜索框用
        nowPrice:'--',
        buyWay:'市价买入',
        columns: ['市价买入', '市价买入', '市价买入', '市价买入', '市价买入'],
        show2:false,
        searchList:[],
        donotSear:false,
        applyData:{ //传至下一页保存参数用
            stock_code:'',
            stock_name:'',
            nominal_amount:'',
            cycle_id:'',
            market_code:'',
        },
    };
  },
  watch: {
    stockName(val) {
        if (val.length != 0) {
            this.searchStock();
        } else {
            this.searchList = [];
        }
    }
  },
  created(){
      console.log(this.$route.query.stockName);
      if(this.$route.query.stockName){
        this.stockName = this.$route.query.stockName
        this.stockInfo.stock_market_code = this.$route.query.code
        this.stockInfo.stock_name = this.$route.query.stockName
        this.stockName = this.$route.query.stockName+"("+this.$route.query.code.substring(2)+")";
        this.getNowPrice()
      }
  },
  methods: {
    getNowPrice(){
      var that = this;
      this.$get(this.API_HOST + '/api/v1/getStockNowPrice', {stock_code:this.stockInfo.stock_market_code}, res => {
        console.log("获取股票最新价格", res.data);
        if (res.data.code == 200) {
            that.nowPrice = res.data.data.now_stock_price;
        } else {
          that.$toast(res.data.msg);
        }
      }); 
    },
    to(path){
        this.$router.push(path)
    },
    detail(){
        if(this.stockInfo.stock_code){
            this.to({path:'/enquiry',query:{code:this.stockInfo.stock_market_code,name:this.stockInfo.stock_name}})
        }
        
    },
    
    chooseWay(picker, values) {
        console.log(picker, values);
        this.buyWay = picker;
        this.show2 = false;
    },
    searchStock() {
      var that = this;
      this.$post(
        this.API_HOST + "/api/v1/search_stock",
        { keyword: this.stockName },
        res => {
          console.log("搜索股票", res.data);
          if (res.data.code == 200) {
               that.searchList = res.data.data; 
          } else {
            that.$toast(res.data.msg);
          }
        }
      );
    },
    addOne(item){
        this.stockInfo = item;
        this.stockName = item.stock_name+"("+item.stock_code+")";
        this.donotSear = false
        this.getNowPrice()
    },
    ensureBuy(){
        if(this.stockName.length==''){
            this.$toast('请先输入标的股票')
            return
        }
        this.applyData.stock_code = this.stockInfo.stock_market_code.substring(2);
        this.applyData.stock_name = this.stockInfo.stock_name;
        this.applyData.nominal_amount = this.choMoney;
        this.applyData.cycle_id = this.period;
        this.applyData.market_code = this.stockInfo.stock_market_code;
        this.to({path:'/apply/order',query:{...this.applyData}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page{
    width: 100%;
    .banner{
        font-size: 20px;
        background-color: #262632;
        border-bottom-left-radius: 40px;
        padding: 16px 0;
    }
    .item{
        border-bottom: 4px solid #32324E; 
        padding-bottom: 10px;
        .title{
            text-align: start;
            margin: 16px;
            img{
                width: 3%;
                display: inline;
                margin: 0 6px;
            }
        }
        .search{
            width: 70%;
            margin: 0 auto;
            background-color: #303040;
            justify-content: center;
            align-items: center;
            padding: 6px 0;
            border-radius: 6px;
            .van-icon{
                margin-right: 18px;
            }
            input{
                background: #303040;
                border: none;
                height: 30px;
                width: 60%;
                font-size: 16px;
            }
        }
        .info{
            font-size: 13px;
            margin: 10px 0;
            .price{
                font-size:24px;
                margin-right: 60px;
            }
            .detail{
                color:#5166E4;
            }
        }
        .list {
            font-size: 14px;
            background-color: rgba(57, 56, 76, 0.9);
            border-radius: 10px;
            margin: 10px 0 8vh 0;
            .list-item {
                justify-content: space-between;
                align-items: center;
                div {
                    width: 20%;
                    text-align: center;
                    &:nth-child(2) {
                        margin: 0 10px;
                    }
                    &:nth-child(4) {
                        margin-left: 10px;
                    }
                    .btn-small {
                        background: #d61510;
                        color: #fff;
                        border: none;
                        height: 30px;
                        line-height: 30px;
                    }
                }
            }
        }
        .money{
            justify-content: space-around;
            div{
                border-radius: 4px;
                padding: 5px 10px;

            }
            .cap{
                width: 8%;
            }
            .pei{
                width: 12%;
                margin-bottom: 10px;
            }
            .cho{
               border: 1px solid #fff;
            }
            .cho-ed{
                background: #d61510;
                border: 1px solid #d61510;
            }
        }
    }
    .payment{
        input{
            background: #303040;
            border: none;
            height: 30px;
            width: 60%;
            margin: 20px 20px 10px 0;
            text-align: center;
            font-size: 16px;
        }
    }
    .btn{
        margin-top: 30px;
        height: 36px;
        line-height: 36px;
    }
    
}
</style>
<style scoped>

</style>


