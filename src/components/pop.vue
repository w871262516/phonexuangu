<template>
    <div class="mask">
        <div class="pupo" :class="type!='choose'?'smaller-pop':''">
            <div class="title">
                <span class="up">{{title}} </span>
                <img class="close" @click="close" src="../../static/img/common/close_red.png" alt=""> 
            </div>
            <div class="choose" v-if="type=='choose'"> 
                <van-search placeholder="请输入股票名称/代码"  v-model="stoCode" />
                <van-list
                    v-model="loading"
                    :finished="finished"
                    :error.sync="error"
                    error-text="请求失败，点击重新加载"
                    @load="onLoad"
                >
                    <div class="list-item normal flex small" v-for="(item,index) in list" :key="index" >
                        <div class="normal">{{item.market_code}}</div>
                        <div class="normal">{{item.stock_code}}</div>
                        <div class="normal">{{item.stock_name}}</div>
                        <div><van-button class="btn-small" @click="addStock(item)">添加</van-button></div>
                    </div>
                </van-list>
            </div>
            <div class="code"  v-if="type=='code'||type=='codeBank'">
                <p class="tip">已向尾号{{phoneTail}}的手机发送验证码</p>
                <input type="text" placeholder="验证码:" v-model="code">
                <div class="btn" @click="confirm">确认</div>
            </div>
            <div class="code"  v-if="type=='password'">
                <input type="password" style="text-align:center; letter-spacing: .8rem;" v-model="password">
                <div class="btn" @click="confirmPw">确认</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components:{
        
    },
    name: 'popu',
    props:['type','data'],
    data(){
        return {
            title:'',
            stoCode:'',
            code:'',
            password:'',
            phoneTail:'',
            list: [],  
            loading: false,
            error: false,
            finished: false,
        }
    },
    watch:{
        stoCode(val){
            if(val.length!=0){
                this.searchStock();
            }else{
                this.list = []
            }
        }
    },
    created(){
        switch (this.type) {
            case 'choose':
                this.title = "添加自选股";
                break;
            case 'code':
                this.title = "短信验证码";
                break;
            case 'codeBank':
                this.title = "短信验证码";
                this.phoneTail = this.data.phone.substring(7);
                var that = this;
                var data = {
                    authorization:this.data.authorization,
                    phone: this.data.phone,
                }
                this.$post_token(this.API_HOST + "/api/v1/bindBankSendSMS", data, res => {
                    that.$toast(res.data.msg);
                });
                break;
            case 'password':
                this.title = "支付密码";
                break;
        
        }
    },
    methods:{
         onLoad() {
        // 异步更新数据
        // setTimeout(() => {
        //   for (let i = 0; i < 4; i++) {
        //     this.list.push(this.list.length + 1);
        //   }
            // 加载状态结束
            this.loading = false;

            // 数据全部加载完成
            // if (this.list.length >= 0) {
            // this.finished = true;
        //   }
        // }, 500);
        // fetchSomeThing().catch(() => {
        //   this.error = true;
        // });
        },
        
        searchStock(){
            var that = this;0
            this.$post(this.API_HOST + '/api/v1/search_stock', {keyword:this.stoCode}, res => {
                console.log("搜索股票", res.data);
                if (res.data.code == 200) {
                    that.list = res.data.data
                } else {
                that.$toast(res.data.msg);
                }
            });
        },
        addStock(item){
            this.$emit('addStock',item,"please close me!")
        },
        close(){
            this.$emit('closeDialog','please close me!')
        },
        confirm(){
            this.$emit('confirmDialog',this.code)
        },
        confirmPw(){
            if(this.password.length==6){
              this.$emit('confirmDialog',this.password)  
            }else{
                console.log('>>>>');
                
                this.$toast({
                    forbidClick: true,
                    message:"请输入6位数支付密码"
                })
                var ti = setTimeout(() => {
                    this.password = ''
                    clearTimeout(ti)
                }, 1500);
            }
            
        }
    }
}
</script>

<style lang="less" scoped>
.mask{
    background: rgba(29, 29, 50, 0.7);
    width:calc(100vw - 20px);
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: 5;
    .pupo{
        position: absolute;
        transform: translate(-50%,-50%);
        top: 50%;
        left: 50%;
        background: #EEEDED;
        width: 80%;
        padding: 10px 20px;
        border-radius: 8px;
        .title{
            position: relative;
            font-size: 16px;
            margin: 10px 0;
            .close{
                width: 8%;
                position: absolute;
                right: 0;
                top: 2px;
            }
        }
        .choose{
            .van-list{
              height: 50vh; 
              overflow: scroll; 
                .list-item{
                    justify-content: space-around;
                    align-items: center;
                    border-bottom: 1px solid #E4E4E4;
                    padding: 8px 0;
                    div{
                    color:#262626; 
                    }
                    .btn-small{
                        background: #d61510;
                        color: #fff;
                        border: none;
                        height: 20px;
                        line-height: 20px;
                        border-radius: 6px;
                        .van-button__text{
                            font-size: 12px;
                        }
                    }
                }  
            }
        }
        .code{
            .tip{
                color: #A09F9F;
            }
            input{
                width: 10rem;
                height: 2.4rem;
                border-radius: 20px;
                border:1px solid #A09F9F;
                padding: 0 1rem;
                margin: 1rem 0;
                color: #262626;
            }
            .btn{
                width: 10rem;
                margin: 0 auto;
                height: 2.4rem;
                line-height: 2.4rem;
                border-radius: 20px;
                padding: 0 1rem;
                margin-bottom: 1rem;
            }
        }
    }
    .smaller-pop{
        width: 60%;
        .title{
            .close{
                width: 10%;
                top: -.2rem;
            }  
        }
        
    }
}
</style>
<style scoped>


</style>

