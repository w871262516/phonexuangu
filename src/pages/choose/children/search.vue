<template>
  <div class="cho-page">
    <header-bar :isAdd="true"></header-bar>
    <title-bar :title="'自选股'"></title-bar>
    <div class="page-content">
        <van-search placeholder="请输入股票代码/名称" background="#292836" v-model="stockName" />
        <list :searchList="list"></list>
    </div>
  </div>
</template>

<script>
import headerBar from '../../../components/headerBar'
import titleBar from '../../../components/titleBar.vue'
import list from '../components/list'
export default {
  components:{
    headerBar,titleBar,list
  },
  name: 'home',
  data(){
      return {
       stockName:'',
       list: [],
      }
  },
  created(){
      
  },  
  watch:{
    stockName(val){
        if(val.length!=0){
            this.searchStock();
        }else{
            this.list = []
        }
        
    }
  },
  methods:{
    searchStock(){
      var that = this;
      this.$post(this.API_HOST + '/api/v1/search_stock', {keyword:this.stockName}, res => {
        console.log("搜索股票", res.data);
        if (res.data.code == 200) {
            that.list = res.data.data
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
  }
}
</script>
<style lang="less" scoped>
.cho-page{
   .page-content{
        width:calc(100% - 20px);
        margin: 10px;
        .th{
            justify-content: space-around;
            div{
                width: 20%;
                &:first-child{
                    margin-left: 10px;
                }
            }
        }
        .van-icon{
            margin-right: 10px;
        }
   }
}
</style>
<style scope>
.van-search .van-cell{
    padding: 10px 10px 10px 0;
}
.van-search__content{
    background-color: #303040;
    border-radius: 10px;
}
</style>


