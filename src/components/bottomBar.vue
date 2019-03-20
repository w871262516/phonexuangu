<template>
  <div class="hello">
    <van-tabbar
      v-model="active"
      active-color="#d61411"
    >
      <van-tabbar-item v-for="(item,index) in tab" :key="index" 
      :icon="item.icon" :to="item.to"
      >
        <span>{{item.title}}</span>
        <img
          slot="icon"
          slot-scope="props"
          :src="props.active ? item.active : item.normal"
        >
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'bottomBar',
  props:['index'],
  data () {
    return {
      active: 0,
      tab:[
        {title:'首页',active:'../../static/img/index/home_ed.png',normal:'../../static/img/index/home.png',to:'/'},
        {title:'自选',active:'../../static/img/index/tabChoose_ed.png',normal:'../../static/img/index/tabChoose.png',to:'/choose'},
        {title:'申购',active:'../../static/img/index/enquiry_ed.png',normal:'../../static/img/index/enquiry.png',to:'/apply'},
        {title:'持仓',active:'../../static/img/index/hold_ed.png',normal:'../../static/img/index/hold.png',to:{path:'/position',query:{active:0}}},
        {title:'我的',active:'../../static/img/index/me_ed.png',normal:'../../static/img/index/me.png',to:'/mine'},
      ]
    }
  },
  created(){
    if(this.index){
      this.active = this.index
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.hello{
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 999;
}
</style>
<style scoped>
.van-tabbar{
  background-color: #262632;
}
[class*=van-hairline]::after{
  border: none;
}
</style>


