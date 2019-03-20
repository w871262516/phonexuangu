<template>
  <div class="cho-page">
    <header-bar></header-bar>
    <div class="page-content">
      <van-search placeholder="请输入股票代码/名称" background="#292836" v-model="stockName"/>
      <div v-if="!searchList.length" class="my-list">
        <div class="th flex">
          <div v-for="i in thData" :key="i">{{i}}</div>
        </div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :error.sync="error"
            :offset="50"
            finished-text="没有更多了"
            error-text="请求失败，点击重新加载"
            @load="getStock"
          >
            <van-cell v-for="(item,index) in list" :key="index">
              <router-link
                :to="{path:'/enquiry',query:{code:item.stock_market_code,name:item.stock_name}}"
              >
                <div class="list-item normal flex small">
                  <div class="normal">{{item.stock_name}}</div>
                  <div class="normal">{{item.stock_code}}</div>
                  <div :class="item.rise>0?'normal up':'normal down'">{{item.now_price}}</div>
                  <div
                    :class="item.rise>0?'normal up':'normal down'"
                  >{{item.rise>0?'+':''}}{{item.rise}}</div>
                  <div @click.stop.prevent="deleteStock(item.stock_code,index)">
                    <van-icon name="delete" size="14px"/>
                  </div>
                </div>
              </router-link>
            </van-cell>
          </van-list>
        </van-pull-refresh>
        <van-button class="btn" @click="addShow = true">
          <van-icon name="add-o" size="20px"/>添加自选股
        </van-button>
      </div>
      <van-list class="list" v-if="searchList">
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
    <bottom-bar :index="1"></bottom-bar>
    <pop
      :type="'choose'"
      v-if="addShow"
      @closeDialog="acceptDialog"
      @addStock="addOne"
      style="overflow: scroll;"
    ></pop>
  </div>
</template>

<script>
import headerBar from "../../components/headerBar";
import bottomBar from "../../components/bottomBar";
import pop from "../../components/pop";
export default {
  components: {
    headerBar,
    bottomBar,
    pop
  },
  name: "home",
  data() {
    return {
      stockName: "",
      thData: ["股票名称", "代码", "最新价", "涨跌幅", "操作"],
      addShow: false, //添加弹框
      searchList: [],
      list: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      page: 1
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
  created() {},
  methods: {
    onRefresh() {
      console.log("refresh");
      this.page = 1;
      this.finished = false;
    },
    getStock() {
      console.log("load");
      var that = this;
      var data = {
        authorization: this.getToken(),
        page: this.page
      };
      this.$post_token(this.API_HOST + "/api/v1/myFavoriteStock", data, res => {
        console.log("我的自选股", res.data);
        if (res.data.code == 200) {
          if (res.data.data.length == 0) {
            that.finished = true;
          } else {
            if (that.page == 1) {
              that.list = [];
            }
            res.data.data.forEach(item => {
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
    deleteStock(code, index) {
      console.log(code, index);
      var that = this;
      var data = {
        authorization: this.getToken(),
        stock_code: code
      };
      this.$post_token(
        this.API_HOST + "/api/v1/delFavoriteStock",
        data,
        res => {
          console.log("删除自选股", res.data);
          if (res.data.code == 200) {
            that.$dialog
              .alert({
                message: "删除成功"
              })
              .then(() => {
                that.list.splice(index, 1);
              });
          } else {
            that.$toast(res.data.msg);
          }
        }
      );
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
    acceptDialog(val) {
      console.log(val);
      this.addShow = false;
    },
    addOne(stock, msg) {
      console.log(stock);
      var that = this;
      var data = {
        authorization: this.getToken(),
        stock_code: stock.stock_code,
        stock_market_code: stock.stock_market_code,
        stock_name: stock.stock_name
      };
      this.$post_token(
        this.API_HOST + "/api/v1/addFavoriteStock",
        data,
        res => {
          console.log("添加自选股", res.data);
          if (res.data.code == 200) {
            that.stockName = "";
            that.page = 1;
            that.getStock();
            if (msg) {
              that.addShow = false;
            }
          } else {
          }
        }
      );
    }
  }
};
</script>
<style lang="less" scoped>
.cho-page {
  .page-content {
    width: calc(100% - 20px);
    margin: 10px;
    .my-list {
      font-size: 14px;
      .th {
        justify-content: space-around;
        margin-top: 10px;
        div {
          width: 20%;
          &:first-child {
            margin-left: 10px;
          }
        }
      }
      .van-icon {
        margin-right: 10px;
      }
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
  }
.up{
  color:#d61510;
}
.down{
  color:#47963C;
}
}
</style>
<style scope>
.cho-page .van-search .van-cell {
  padding: 10px 10px 10px 0;
}
.cho-page .van-search__content {
  /* background-color: #303040; */
  border-radius: 10px;
}
.cho-page .van-cell:not(:last-child)::after {
  border-bottom: 1px solid #666576 !important;
  left: 10px;
  right: 10px;
}
.cho-page .van-list .van-cell {
  padding: 10px;
}
.cho-page .van-button__text {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.cho-page .van-list .van-cell:nth-child(2n) {
  background-color: #363544;
}
.my-list .van-list{
  background-color: rgba(57, 56, 76, .9);
  border-radius: 10px;
  margin: 10px 0 8vh 0;
}
</style>


