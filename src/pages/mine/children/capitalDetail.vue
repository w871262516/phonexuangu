<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <div class="capitalBanner">
        <p>资金明细</p>
        <van-radio-group v-model="radio" class="radio-gro flex" @change="changeTime">
            <van-radio name="all" checked-color="#D61410">全部</van-radio>
            <van-radio name="week" checked-color="#D61410">一周内</van-radio>
            <van-radio name="month" checked-color="#D61410">一个月</van-radio>
            <van-radio name="half" checked-color="#D61410">近半年</van-radio>
        </van-radio-group>
    </div>
    <div class="page-content">
        <van-pull-refresh
          v-model="refreshing"
          @refresh="onRefresh"
        >
          <van-list
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            :offset="50"
            finished-text="没有更多了"
            error-text='请求失败，点击重新加载'
            @load="getCapital"
          >
            <div class="list-item"  v-for="item in list" :key="item.id">
                <div class="detail flex">
                    <p>{{item.type_name}}</p>
                    <p :class="item.isAdd?'up':'down'">{{item.isAdd?"+":"-"}}{{item.amount}}</p>
                </div>
                <p class="time">{{item.create_time}}</p>
            </div>
          </van-list>
        </van-pull-refresh>
    </div>
   </div>
</template>

<script>
import navBar from '../../../components/headerBar.vue'
export default {
  name: 'position',
  components:{
      navBar
    },
  data () {
     return {
        radio:"all", 
        list: [],
        loading: false,
        finished: false,
        error: false,
        refreshing: false,
        time:'all',
        page:1,

    };
  },
  created(){
    //   this.getCapital();
  },
  methods: {
    onRefresh() {
        this.page = 1;
        this.finished = false;
        // this.getCapital();
    },
    getCapital(){
        this.loading = true;
        var that = this;
        var data = {
            authorization:this.getToken(),
            time:this.time,//today 今天 week 周 month 月 half 半年 year 年 all 全部
            page:this.page
        }
        this.$post_token(this.API_HOST + '/api/v1/account/capital_details', data, res => {
            console.log("资金明细", res.data);
            if (res.data.code == 200) {
                if(res.data.data.capital_record.length==0){
                    that.finished = true;
                }else{
                    if(that.page == 1){
                        that.list = []
                    }
                    res.data.data.capital_record.forEach(item => {
                        if(item.type==2||item.type==5||item.type==6){
                            item['isAdd'] = true;
                        }else{
                           item['isAdd'] = false; 
                        }
                        that.list.push(item) 
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
    changeTime(name){
        console.log(name);
        this.time = name;
        this.onRefresh()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page{
    margin-bottom: 9vh;
    .capitalBanner{
        background-color: #262632;
        border-bottom-left-radius: 40px;
        padding: 16px 0;
        text-align: start;
        p{
            font-size: 24px;
            margin: -2rem 0 1rem 3rem;
        }
       .radio-gro{
           justify-content: space-around;
           
           
       }
    }
    .page-content{
       width: 100%;
       margin-top: 1rem;
       .list-item{
            border-bottom: 1px solid #585673;
            padding: .2rem 1rem;
           .detail{
               justify-content: space-between;
               line-height: 2.2rem;
           }
           .time{
               text-align: start;
               color: #5D5D76;
               font-size: 12px;
               margin-bottom: .2rem;
           }
           
       }
    }
    
}
</style>
<style scoped>

</style>


