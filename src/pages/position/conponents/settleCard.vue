<template>
<div>
    <!-- <div class="card" v-for="(i,index) in list" :key="index"> -->
    <div class="card">
        <div class="top flex">
            <div class="state">
                <span style="font-size:20px;">{{list[0].name}}</span>
                <span style="font-size:14px;">{{list[0].code}}</span>
            </div>
            <div class="flex">
                <van-switch v-model="checked" active-color="#D61410" 
                inactive-color="#fcfcfc" size="16px"
                />
                <span>自主卖出</span>
            </div>
        </div>
        <div class="bottom">
            <div class="item flex">
                <span>执行金</span>
                <span>5000.00</span>
            </div>
            <div class="item flex">
                <span>结算盈亏</span>
                <span>0</span>
            </div>
            <div class="item flex">
                <span>选买服务费</span>
                <span>5000.00</span>
            </div>
            <div class="item flex">
                <span>标的股票</span>
                <span>中工国际（002051）</span>
            </div>
            <div class="item flex">
                <span>买入价</span>
                <span>12.99</span>
            </div>
            <div class="item flex">
                <span>卖出价</span>
                <span>13.15</span>
            </div>
            <div class="item flex">
                <span>买入时间</span>
                <span>2019-02-22 14:53:26</span>
            </div>
            <div class="item flex">
                <span>卖出时间 </span>
                <span>2019-02-25 14:53:26</span>
            </div>
            <div class="item flex">
                <span>卖出周期</span>
                <span>两周</span>
            </div>
            <div class="item flex">
                <span>订单编号</span>
                <span>1902211125192761</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
 name: 'settleCard',
 props:['settleList'],
  data () {
     return {
        checked:true,
        list:[
            {name:'中工国际',float:'0',state:'持仓中',code:'002051'},
            {name:'中工国际',float:'0',state:'持仓中',code:'002051'},
            {name:'中工国际',float:'0',state:'持仓中',code:'002051'},
            {name:'中工国际',float:'0',state:'持仓中',code:'002051'},
        ],
    };
  },
}
</script>

<style lang="less" scoped>
.card{
    background: #3A3949;
    padding:10px 0;
    margin-top: 26px;
    border-radius: 5px;
    .top{
        justify-content: space-between;
        align-items: center;
        margin: 0 10px;
        border-bottom: 1px dashed #969696;
        .state{
            margin: .4rem;
            span{
                margin: 0 .2rem;
            }
        }
        .flex{
            align-items: center;
            span{
                margin: 0 .4rem;
            }
        }
    }
    .bottom{
        .item{
            padding: .5rem .4rem 0 .5rem;
            margin: 0 .8rem;
            justify-content: space-between;  
            color: #D7D7D7;
            &:nth-child(3){
                border-bottom: 1px dashed #666576;
                padding-bottom: .5rem;
            }
        }
        

    }
    
}
</style>

