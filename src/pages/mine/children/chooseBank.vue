<template>
  <div class="page">
    <header-bar></header-bar>
    <title-bar :title="'选择银行'"></title-bar>
    <div class="page-content">
      <p class="title">已绑定银行卡列表</p>
      <div style="margin-bottom:2rem" v-for="item in bankcardList">
        <van-cell>
          <div class="cell flex">
            <div class="left">
              <p>{{item.bank_name}} {{item.holder_user_no}}</p>
              <p>单笔限额2k 单日限额2w</p>
            </div>
            <div class="right">
              <span style="color:#237CD7" @click="chooseThis(item)">选择</span>
              <span class="up">解绑</span>
            </div>
          </div>
        </van-cell>
      </div>
      <van-button class="btn" @click="addBank">添加银行卡</van-button>
    </div>
  </div>
</template>

<script>
import headerBar from "../../../components/headerBar";
import titleBar from "../../../components/titleBar.vue";
export default {
  components: {
    headerBar,
    titleBar
  },
  name: "recharge",
  data() {
    return {
      bankcardList:[],

    };
  },
  created(){
    this.getMyBankcard()
  },
  watch: {
    active(val) {
      console.log(val);
    }
  },
  methods:{
    getMyBankcard(){
      var that = this;
      this.$post_token(this.API_HOST + '/api/v1/account/my_bank_list', {authorization:this.getToken()}, res => {
        console.log("我的银行卡", res.data);
        if (res.data.code == 200) {
          that.bankcardList = res.data.data
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
    //   选择银行卡
      chooseThis(item){
          this.$router.replace({
            name:'balanceRecharge',
            params:{bankCard:item}
          });
      },
    //   添加银行卡
      addBank(){
          this.$router.push('/mine/authentication?type=2');
      }
  }
};
</script>
<style lang="less" scoped>
.page {
  .page-content {
    width: calc(100% - 20px);
    margin: 10px;
    font-size: 12px;
    .title {
      background: #262632;
      text-align: start;
      border-radius: 10px;
      line-height: 3rem;
      color: #565566;
      padding-left: 1rem;
      margin: 1rem 0;
    }
    .cell{
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 12px;
      letter-spacing: 1px;
      p{
        &:first-child{
            font-size: 14px;
        }
      }
      span{
          padding:0 .6rem;
      }
    }
    .btn {
      margin-top: 2rem;
    }
  }
}
</style>
<style scope>
</style>


