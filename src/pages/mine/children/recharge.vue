<template>
  <div class="page">
    <header-bar></header-bar>
    <title-bar :title="'账户充值'" ></title-bar>
    <div class="page-content">
      <van-cell title="易宝快捷充值" is-link to="/mine/balanceRecharge" style="text-align:start;">
        <p style="font-size:14px">即时充值</p>
      </van-cell>
    </div>
  </div>
</template>

<script>
import headerBar from "../../../components/headerBar";
import titleBar from "../../../components/titleBar.vue";
export default {
  components: {
    headerBar,
    titleBar,
  },
  name: "recharge",
  data() {
    return {
      
    };
  },

  mounted() {},
  watch: {
    active(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="less" scoped>
.page {
  .page-content {
    width: calc(100% - 20px);
    margin: 10px;
    
  }
}
</style>
<style scope>

</style>


