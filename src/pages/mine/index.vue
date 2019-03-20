<template>
  <div class="page">
    <div class="page-content">
      <div class="avatar flex">
        <div class="avatar-item flex">
          <img class="photo" :src="userInfo.head?userInfo.head:'../../../static/img/index/live3.png'" alt>
          <div class="info">
            <p class="name">{{userInfo.user_name}}</p>
            <p class="phone">{{userInfo.phone}}</p>
          </div>
        </div>
        <img class="close" src="../../../static/img/common/closse.png" alt @click="to('/login')">
      </div>
      
      <div class="balance">
          <p>我的余额</p>
          <p class="money"><span>¥ </span>{{userInfo.available_amount}}</p>
      </div>
        <div class="list">
           <van-cell title="充值" is-link to="/mine/recharge" class="flex">
               <img  slot="icon" slot-scope="props" src="../../../static/img/index/recharge.png">
           </van-cell>
           <van-cell title="提现" is-link to="/mine/withdraw">
               <img  slot="icon" slot-scope="props" src="../../../static/img/index/withdraw.png">
           </van-cell>
           <van-cell title="资金明细" is-link to="/mine/capitalDetail">
               <img  slot="icon" slot-scope="props" src="../../../static/img/index/capital.png">
           </van-cell>
           <van-cell title="个人信息" is-link to="/mine/myInfo">
               <img  slot="icon" slot-scope="props" src="../../../static/img/index/myinfo.png">
           </van-cell>
           <van-cell title="客服" is-link to="">
               <img  slot="icon" slot-scope="props" src="../../../static/img/index/service.png">
           </van-cell>
        </div>
       
    </div>
    <bottom-bar :index="4"></bottom-bar>
  </div>
</template>

<script>
import bottomBar from "../../components/bottomBar";
export default {
  components: {
    bottomBar
  },
  name: "mine",
  data() {
    return {
      active: 0,
      userInfo:{},
    };
  },
  created(){
      this.getUserInfo();
  },
  mounted() {},
  methods:{
    getUserInfo(){
      var that = this;
      var token = this.getToken()
      var data = {
        authorization: token,
      };
      this.$post_token(this.API_HOST + "/api/v1/account/personal", data, res => {
        console.log("个人信息",res.data);
        if(res.data.code == 200){
            that.$store.commit('SET_INFO',res.data.data)
            that.userInfo = res.data.data
        }else{
            that.$toast(res.data.msg);
            that.$router.push('/login');
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
    .avatar {
        justify-content: space-between;
        .avatar-item{
            margin: 20px;
            align-items: center;
            .photo {
                width: 16%;
                border-radius: 50%;
            }
            .info {
                text-align: start;
                margin: 0 20px;
                .name {
                    font-size: 18px;
                }
                .phone {
                    font-size: 12px;
                    line-height: 22px;
                }
            } 
        }
      .close {
        width: 6%;
        height: 6.2%;
        padding: 16px 8px;
      }
    }
    .balance{ 
        background-color: #22222d;
        padding: 20px 0;
        border-radius: 10px;
        .money{
            color: #D61410;
            font-size: 2.4rem;
            margin: 10px 0;
            span{
                font-size: 1.2rem;
            }
        }

    }
    .list{
        margin-top: 20px;
      .van-cell:first-child{
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }  
        .van-cell{
            text-align: start;
            font-size: 14px;
            align-items: center;
            img{
              width: 5.6%;
              height: 5.6%;  
              margin-right: 10px;
            }
            &:nth-child(1),&:nth-child(2){
                img{
                    width: 7%;
                    height: 5%;
                }
            }
            &:not(:last-child)::after{
                left:0;
                right: 0;
                border-bottom: 1px solid #565568;
            }
            &:nth-child(2n){
                background-color: #363544;
            }
        }
    }
    
  }
}
</style>
<style scope>
.van-tabs__nav {
  background-color: #292836;
  color: rgb(41, 24, 24);
}

</style>


