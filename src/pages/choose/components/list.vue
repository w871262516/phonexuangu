<template>
  <div class="list">
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
        error-text="请求失败，点击重新加载"
        @load="getStock"
      >
        <van-cell
          v-for="(item,index) in list"
          :key="index">
          <router-link :to="{path:'/enquiry',query:{code:item.stock_market_code,name:item.stock_name}}">
            <div class="list-item normal flex small" >
                <div class="normal">{{item.stock_name}}</div>
                <div class="normal">{{item.stock_code}}</div>
                <div :class="item.rise>0?'normal up':'normal down'">{{item.now_price}}</div>
                <div :class="item.rise>0?'normal up':'normal down'">{{item.rise>0?'+':''}}{{item.rise}}</div>
                <div @click.stop.prevent="deleteStock(item.stock_code,index)"><van-icon name="delete" size="14px"/></div>
            </div>
          </router-link>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'list',
  props:[''],
  data () {
     return {
      list:[],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      page:1,

    };
  },
  created(){
      // this.getStock()
  },
  methods:{
    onRefresh() {
        this.page = 1;
        this.finished = false;
        this.getStock();
    },
    getStock(){
      var that = this;
      var data = {
          'authorization':this.getToken(),
          'page':this.page
      }
      this.$post_token(this.API_HOST + '/api/v1/myFavoriteStock', data, res => {
        console.log("我的自选股", res.data);
        if (res.data.code == 200) {
           if(res.data.data.length==0){
            that.finished = true;
            }else{
                if(that.page == 1){
                    that.list = []
                }
                res.data.data.forEach(item => {
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
    deleteStock(code,index){
      console.log(code,index);
      var that = this;
      var data = {
          'authorization':this.getToken(),
          'stock_code': code
      }
      this.$post_token(this.API_HOST + '/api/v1/delFavoriteStock', data, res => {
        console.log("删除自选股", res.data);
        if (res.data.code == 200) {
            that.$dialog.alert({
              message: '删除成功'
            }).then(() => {
                that.list.splice(index,1)
            });
        } else {
          that.$toast(res.data.msg);
        }
      });  
        // this.getStock()
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.list{
    font-size: 14px;
  .list-item{
    justify-content: space-between;
    align-items: center;
    div{
      width: 20%;
      text-align: center;
      &:nth-child(2){
          margin: 0 10px;
      }
      &:nth-child(4){
          margin-left: 10px;
      }
      .btn-small{
        background: #d61510;
        color: #fff;
        border: none;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
.up{
  color:#d61510;
}
.down{
  color:#47963C;
}
</style>
<style scoped>
.van-list{
  background-color: rgba(57, 56, 76, .9);
  border-radius: 10px;
  margin: 10px 0 8vh 0;
}
</style>


