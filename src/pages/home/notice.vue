<template>
  <div class="page">
    <header-bar></header-bar>
    <title-bar :title="'公告'" ></title-bar>
    <div class="page-content">
      <div class="card">
          <p class="title">{{notice.title}}</p>
          <p class="cont">{{notice.content}}</p>
          <p class="time">{{notice.create_time}}<span class="admin">管理员</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import headerBar from "../../components/headerBar";
import titleBar from "../../components/titleBar.vue";
export default {
  components: {
    headerBar,
    titleBar,
  },
  name: "notice",
  data() {
    return {
      id:'',
      notice:{}
    };
  },
  created(){
    if(this.$route.query.id){
      this.id = this.$route.query.id
      this.getNoticeContent();
    }
  },
  watch: {
    active(val) {
      console.log(val);
    }
  },
  methods:{
    getNoticeContent() {
      var that = this;
      this.$get(this.API_HOST + "/api/v1/notice_content/"+this.id, {}, res => {
        console.log("首页", res.data);
        if (res.data.code == 200) {
          that.notice = res.data.data
          that.notice.create_time = that.timeFormer(res.data.data.create_time)
        } else {
          that.$toast(res.data.msg);
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
.page {
  .page-content {
    width: calc(100% - 20px);
    margin: 10px;
    .card{
        color: #D4D3D3;
        font-size: 12px;
        background: #363544;
        padding: 1rem 2rem;
        border-radius: 10px;
        margin: 1.2rem 0;
        .title{
            font-size: 16px;
            margin-bottom: 1rem;
            color: #fff;
        }
        .cont{
            line-height: 20px;
            text-align: start;
            margin-bottom: 1rem;
        }
        .time{
            text-align: end;
            .admin{
                margin-left: 2rem;
            }
        }
    }
  }
}
</style>
<style scope>

</style>


