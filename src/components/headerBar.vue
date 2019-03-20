<template>
  <div class="header flex">
    <img style="width:1.3rem;height:1.4rem;" src="../../static/img/common/back.png" alt="" @click="back">
    <img style="width:1.5rem;height:1.5rem;" src="../../static/img/common/add.png" alt="" v-if="isAdd">
    <img style="width:1.5rem;height:1.5rem;" src="../../static/img/common/service.png" alt="" v-else>
  </div>
</template>

<script>
export default {
  name: 'navBar',
  props:['isAdd'],
  data () {
    return {

    }
  },
  methods:{
    back(){
        this.$router.go(-1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header{
  width:calc(100%-20px);
  height: 5vh;
  justify-content: space-between;
  padding: 10px;
  background-color: #262632;
}
</style>
<style scoped>

</style>


