<template>
  <div class="page">
    <header-bar></header-bar>
    <title-bar :title="stockName" :code="stockCode"></title-bar>
    <div class="page-content">
      <stock-table :data="stockData" :nowPrice="nowPrice"></stock-table>
      <van-tabs v-model="active" title-active-color="#D61410" title-inactive-color="#D5D5D5">
        <van-tab title="分时">
          <stock-detail type="minutes" v-show="active==0"></stock-detail>
        </van-tab>
        <van-tab title="日K">
          <stock-detail type="day1" v-show="active==1"></stock-detail>
        </van-tab>
        <van-tab title="周K"></van-tab>
        <van-tab title="月K"></van-tab>
      </van-tabs>
      <van-tabs type="card" background="#292836" title-active-color="#292836" color="#acacac"
      style="margin-top:1rem;">
        <van-tab title="资讯">
          <news-list :newsList="list"></news-list>
        </van-tab>
        <van-tab title="简介">
          <news-list :newsList="list"></news-list></van-tab>
        <van-tab title="财务">
          <news-list :newsList="list"></news-list></van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import headerBar from "../../components/headerBar";
import bottomBar from "../../components/bottomBar";
import titleBar from "../../components/titleBar.vue";
import stockTable from "./components/table";
import stockDetail from "../../components/stockDetail";
import newsList from "./components/newsList";
export default {
  components: {
    headerBar,
    bottomBar,
    titleBar,
    stockTable,
    stockDetail,newsList
  },
  name: "enquiry",
  data() {
    return {
      active: 1,
      stockName: "",
      stockCode:'',
      stockName:'',
      nowPrice:'',
      thData: ["股票名称", "代码", "最新价", "涨跌幅", "操作"],
      stockType: [
        { title: "分时", type: "minutes" },
        { title: "日K", type: "day1" },
        { title: "周K", type: "day1" },
        { title: "月K", type: "day1" }
      ],
      list: [
        {text:'中工国际工程股份有限公司关于《中国证监会行政许可项目审查一次反馈意见通知书》回复修订的公告',time:'2019-02-21 09:34:03'},
        {text:'中工国际工程股份有限公司关于《中国证监会行政许可项目审查一次反馈意见通知书》回复修订的公告',time:'2019-02-21 09:34:03'},
        {text:'中工国际工程股份有限公司关于《中国证监会行政许可项目审查一次反馈意见通知书》回复修订的公告',time:'2019-02-21 09:34:03'},
        {text:'中工国际工程股份有限公司关于《中国证监会行政许可项目审查一次反馈意见通知书》回复修订的公告',time:'2019-02-21 09:34:03'},
        {text:'中工国际工程股份有限公司关于《中国证监会行政许可项目审查一次反馈意见通知书》回复修订的公告',time:'2019-02-21 09:34:03'},
        {text:'中工国际工程股份有限公司关于《中国证监会行政许可项目审查一次反馈意见通知书》回复修订的公告',time:'2019-02-21 09:34:03'},
        ],
        stockData:{},
    };
  },
  created(){
    this.stockCode = this.$route.query.code
    this.stockName = this.$route.query.name
    this.getDaily();
    this.getNowPrice();
  },
  watch: {
    active(val) {
      console.log(val);
    }
  },
  methods:{
    getNowPrice(){
      var that = this;
      this.$get(this.API_HOST + '/api/v1/getStockNowPrice', {stock_code:this.stockCode}, res => {
        console.log("获取股票最新价格", res.data);
        if (res.data.code == 200) {
            that.nowPrice = res.data.data.now_stock_price;
            
        } else {
          that.$toast(res.data.msg);
        }
      }); 
    },
    getDaily(){
      var that = this;
      this.$get(this.API_HOST + '/api/v1/stockDailyQuotation', {stock_code:this.stockCode}, res => {
        console.log("日线行情", res.data);
        if (res.data.code == 200) {
            that.stockData = res.data.data.data.items[0];
            
        } else {
          that.$toast(res.data.msg);
        }
      });  
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  .page-content {
    width: calc(100% - 20px);
    margin: 10px;
  }
}
</style>
<style scope>
.van-tabs__nav {
  background-color: #292836;
  color: rgb(41, 24, 24);
}
</style>


