<template>
  <div class="title">
    <div class="banner flex">
      <p>{{title}} <span class="code" v-if="code">{{code.substring(2)}}</span> </p>
      <van-button class="flex"  v-if="code" @click="applyBuy">申购</van-button>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'navBar',
  props:['title','code'],
  data () {
    return {

    }
  },
  methods:{
    applyBuy(){
      console.log("申购");
      this.$router.push({
        path:'/apply',
        query:{stockName:this.title,code:this.code}
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.title{
    font-size: 24px;
    // font-weight: bold;
    background-color: #262632;
    text-align: start;
    padding: 0 0 30px 40px;
    border-bottom-left-radius: 40px;
    letter-spacing: 2px;
    .banner{
      justify-content: space-between;
      .code{
        font-size: 18px;
        font-weight: normal;
        color: #999999;
        letter-spacing: normal;
      }
      .van-button{
          justify-content: center;
          align-items: center;
          background:#d32115;
          border: none;
          color:#e6e6e6;
          margin-right: 20px;
          font-size: 16px;
          font-weight: normal;
          width: 22%;
          height: 30px;
          line-height: 30px;
          letter-spacing: 2px;
      }
    }
    
}
</style>
<style scoped>

</style>


