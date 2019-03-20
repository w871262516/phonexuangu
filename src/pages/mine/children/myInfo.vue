<template>
  <div class="lo-page">
    <nav-bar></nav-bar>
    <div class="banner flex">
        <img src="../../../../static/img/index/live3.png" alt="">
        <p>个人信息</p>
    </div>
    <div class="list">
        <van-cell title="邀请编码" is-link to="">
            <img  slot="icon" slot-scope="props" src="../../../../static/img/info/num.png">
        </van-cell>
        <van-cell title="修改密码" is-link to="/editPassword">
            <img  slot="icon" slot-scope="props" src="../../../../static/img/info/lock.png">
        </van-cell>
        <van-cell title="实名绑卡" is-link to="/mine/authentication" class="flex">
            <img  slot="icon" slot-scope="props" src="../../../../static/img/info/id.png">
            <p>{{state}}</p>
        </van-cell>
        <van-cell v-if="false" title="手机绑定" is-link to="/register">
            <img  slot="icon" slot-scope="props" src="../../../../static/img/info/phone.png">
        </van-cell>
        <van-cell title="手机绑定">
            <img  slot="icon" slot-scope="props" src="../../../../static/img/info/phone.png">
            <p>{{phone}}</p>
        </van-cell>
    </div>
  </div>
</template>

<script>
import navBar from '../../../components/headerBar.vue'
export default {
  name: 'myInfo',
  components:{
      navBar
    },
  data () {
     return {
      state:'',//实名认证状态
      phone:'',
    };
  },
  created(){
    if(this.$store.state.user.userInfo.is_real_name==1){
        this.state = '已认证'
    }else{
        this.state = '未认证' 
    }
    if(this.$store.state.user.userInfo.phone ){
        this.phone = this.$store.state.user.userInfo.phone
    //    this.phone =  str.substring(0,3)+'****'+str.substring(7)
    }
    
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.lo-page{
    width:calc(100% - 20px);
    margin: 10px;
    .banner{
        font-size: 22px;
        background-color: #262632;
        border-bottom-left-radius: 40px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: -40px;
        padding-bottom: 20px;
        img{
            width: 14%;
            height: 14%;
            border-radius: 50%;
            border: 1px solid #fff;
            margin: 10px 0;
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
              width: 4.5%;
              height: 4.5%;  
              margin-right: 30px;
            }
            &:nth-child(3){
                img{
                    width: 5%;
                    height: 4%;
                    margin-right: 26px;
                }
            }
            &:nth-child(4){
                img{
                    width:3.6%;
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
</style>
<style scoped>

</style>


