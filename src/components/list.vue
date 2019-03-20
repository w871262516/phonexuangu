<template>
  <div class="list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
    <router-link :to="'/enquiry'">
      <van-cell
        v-for="(item,index) in list"
        :key="index">
        <div class="list-item normal flex" >
          <div class="left">
            <p>{{item.stock_name}} <span class="smaller">{{item.stock_code}}</span></p>
            <p :class="item.state==11?'double smaller':'single smaller'">{{item.state==9?'申购':'卖出'}} <span class="smaller normal">{{item.user_phone}}</span></p>
          </div>
          <div class="medium small up">
            盈利{{item.profit}}元
          </div>
          <div class="right small">
            选买申购
          </div>
        </div>
      </van-cell>
      </router-link>
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'notice',
  props:["list"],
  data () {
     return {
      loading: false,
      error: false,
      finished: false
    };
  },
  methods: {
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 12) {
          this.finished = true;
        }
      }, 500);
      // fetchSomeThing().catch(() => {
      //   this.error = true;
      // });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.list{
    
  .list-item{
    justify-content: space-between;
    align-items: center;
    .left{
      text-align: start;
      span{
        padding-left: 6px;
      }
    }
    .right{
      background-color: #d61510;
      padding: 0 6px;
      border-radius: 10px;
    }
  }
}
</style>
<style scoped>
.van-list{
  background-color: rgba(57, 56, 76, .9);
  border-radius: 10px;
  margin: 10px 0 8vh 0;
}

.double{
  color:#d48a1a;
}
.single{
  color:#1991de;
}
</style>


