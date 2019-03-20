<template>
  <div class="home-page">
    <div class="banner">
      <!-- <img src="../../../static/img/index/banner.png" alt=""> -->
      <van-swipe :autoplay="5000" :show-indicators="false">
        <van-swipe-item v-for="(image, index) in images" :key="index">
          <img :src="image.img_url">
        </van-swipe-item>
      </van-swipe>
      <div class="tab flex">
        <div class="tab-item flex" v-for="(item,index) in tabList" :key="index">
          <img :src="item.icon" alt>
          <p>{{item.title}}</p>
        </div>
      </div>
    </div>
    <div class="data flex">
      <!-- <div class="data-item flex" v-for="i in stock" :key="i[1]">
            <div>
               <van-icon name="play" :style="{transform: i[3]<0?'rotate(90deg)':'rotate(-90deg)'}"  :class="i[2]<0?'down':'up'"/>
               {{i[0]}}
            </div>
            <div :class="i[3]<0?'down':'up'">{{i[1] | addZero}}</div>
            <div class="open-float flex">
               <span :class="i[2]<0?'down':'up'">{{i[2] | addZero}}</span>
               <span :class="i[3]<0?'down':'up'">{{i[3] | addZero}}%</span>
            </div>
      </div>-->
      <div class="data-item flex">
        <div>
          <van-icon
            name="play"
            :style="{transform: sh_stock[3]<0?'rotate(90deg)':'rotate(-90deg)'}"
            :class="sh_stock[2]<0?'down':'up'"
          />
          {{sh_stock[0]}}
        </div>
        <div :class="sh_stock[3]<0?'down':'up'">{{sh_stock[1] | addZero}}</div>
        <div class="open-float flex">
          <span :class="sh_stock[2]<0?'down':'up'">{{sh_stock[2] | addZero}}</span>
          <span :class="sh_stock[3]<0?'down':'up'">{{sh_stock[3] | addZero}}%</span>
        </div>
      </div>

      <div class="data-item flex">
        <div>
          <van-icon
            name="play"
            :style="{transform: sz_stock[3]<0?'rotate(90deg)':'rotate(-90deg)'}"
            :class="sz_stock[2]<0?'down':'up'"
          />
          {{sz_stock[0]}}
        </div>
        <div :class="sz_stock[3]<0?'down':'up'">{{sz_stock[1] | addZero}}</div>
        <div class="open-float flex">
          <span :class="sz_stock[2]<0?'down':'up'">{{sz_stock[2] | addZero}}</span>
          <span :class="sz_stock[3]<0?'down':'up'">{{sz_stock[3] | addZero}}%</span>
        </div>
      </div>

      <div class="data-item flex">
        <div>
          <van-icon
            name="play"
            :style="{transform: cy_stock[3]<0?'rotate(90deg)':'rotate(-90deg)'}"
            :class="cy_stock[2]<0?'down':'up'"
          />
          {{cy_stock[0]}}
        </div>
        <div :class="cy_stock[3]<0?'down':'up'">{{cy_stock[1] | addZero}}</div>
        <div class="open-float flex">
          <span :class="cy_stock[2]<0?'down':'up'">{{cy_stock[2] | addZero}}</span>
          <span :class="cy_stock[3]<0?'down':'up'">{{cy_stock[3] | addZero}}%</span>
        </div>
      </div>
    </div>
    <router-link :to="{path:'/notice',query:{id:notice[0].id}}">
      <van-notice-bar
        :text="'公告：' + notice[0].title"
        color="#d61510"
        left-icon="volume-o"
        background="rgba(57, 56, 76, .9)"
      />
    </router-link>

    <p style="text-align:start;margin:10px 0;">交易动态</p>

    <div class="list">
      <router-link :to="'/enquiry'">
        <van-cell v-for="(item,index) in trade" :key="index">
          <div class="list-item normal flex">
            <div class="left">
              <p>
                {{item.stock_name}}
                <span class="smaller">{{item.stock_code}}</span>
              </p>
              <p :class="item.state==11?'double smaller':'single smaller'">
                {{item.state==9?'申购':'卖出'}}
                <span class="smaller normal">{{item.user_phone}}</span>
              </p>
            </div>
            <div class="medium small up">盈利{{item.profit}}元</div>
            <div class="right small">选买申购</div>
          </div>
        </van-cell>
      </router-link>
    </div>
    <bottom-bar :index="0"></bottom-bar>
  </div>
</template>

<script>
import bottomBar from "../../components/bottomBar";
export default {
  components: {
    bottomBar
  },
  name: "home",
  data() {
    return {
      tabList: [
        {
          icon: "../../../static/img/index/open.png",
          title: "我要开户",
          url: ""
        },
        {
          icon: "../../../static/img/index/position.png",
          title: "持仓中心",
          url: ""
        },
        {
          icon: "../../../static/img/index/choose.png",
          title: "股票自选",
          url: ""
        },
        {
          icon: "../../../static/img/index/apply.png",
          title: "策略申购",
          url: ""
        }
      ],
      images: [], //banner
      notice: [{title:''}], //公告
      trade: [], //交易动态
      //指数名称，当前点数，当前价格，涨跌率，成交量（手），成交额（万元）；
      sh_stock: [], //上证
      sz_stock: [], //深证
      cy_stock: [] //创业指板
    };
  },
  created() {
    this.getMainMarket();
    this.getIndex();
  },
  methods: {
    getMainMarket() {
      var that = this;
      this.$get(this.API_HOST + "/api/v1/getMainMarketQuotation", {}, res => {
        console.log("上证 深证 和创业板的大盘行情", res.data);
        if (res.data.code == 200) {
          that.sh_stock = res.data.data.sh_stock;
          that.sz_stock = res.data.data.sz_stock;
          that.cy_stock = res.data.data.cy_stock;
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
    getIndex() {
      var that = this;
      this.$get(this.API_HOST + "/api/v1/index", {}, res => {
        console.log("首页", res.data);
        if (res.data.code == 200) {
          that.images = res.data.data.banner;
          that.notice = res.data.data.notice;
          that.trade = res.data.data.trade;
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.home-page {
  width: calc(100% - 20px);
  margin: 10px;
  .banner {
    position: relative;
    margin: 10px 0;
    width: 100%;
    // height: 16rem;
    .van-swipe{
      width: 100%;
      img{
        border-radius: 18px;
      }
    }
    .tab {
      position: absolute;
      width: 100%;
      bottom: 0rem;
      border-radius: 18px;
      margin-top: 1rem;
      justify-content: center;
      background-color: rgba(57, 56, 76, 0.9);
      .tab-item {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 14px 0;
        img {
          width: 40%;
        }
        p {
          font-size: 12px;
          margin-top: 4px;
          letter-spacing: 1px;
        }
      }
    }
  }
  .data {
    margin: 1rem 0;
    font-size: 14px;
    width: 100%;
    justify-content: space-between;
    .data-item {
      flex-direction: column;
      background-color: rgba(57, 56, 76, 0.9);
      padding: 14px 2px;
      border-radius: 12px;
      div {
        margin: 3px 0;
      }
      .open-float {
        font-size: 12px;
        transform: scale(0.9);
        justify-content: space-between;
        span {
          margin: 0 6px;
        }
      }
    }
  }
  .list {
    background-color: rgba(57, 56, 76, 0.9);
    border-radius: 10px;
    margin: 10px 0 8vh 0;
    .list-item {
      justify-content: space-between;
      align-items: center;
      .left {
        text-align: start;
        span {
          padding-left: 6px;
        }
      }
      .right {
        background-color: #d61510;
        padding: 0 6px;
        border-radius: 10px;
      }
      .double {
        color: #d48a1a;
      }
      .single {
        color: #1991de;
      }
    }
  }
}
</style>
<style scope>
.home-page .van-notice-bar {
  border-radius: 10px;
}
.home-page .van-cell:nth-child(2n) {
  background-color: #3f3e4c;
}
.home-page .van-cell:not(:last-child)::after {
  border-bottom: none;
}
</style>


