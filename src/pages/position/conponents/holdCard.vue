<template>
<div>
    <div class="card" v-for="(i,index) in holdList" :key="index">
        <div class="top flex">
            <div class="state">
                <span style="font-size:22px;">{{i.stock_name}}</span>
                <span style="font-size:15px;">{{i.stock_code}}</span>
                <span class="btn btn-small">{{i.stateText}}</span>
            </div>
            <div class="btn">卖出</div>
        </div>
        <div class="time">
            <p>{{i.buying_time}}</p>
            <p>交易订单：{{i.trade_no}}</p>
        </div>
        <div class="bottom flex">
            <div class="item">
                <p>执行金</p>
                <p>{{i.nominal_amount | addZero}}</p>
            </div>
            <div class="item">
                <p>浮动盈亏</p>
                <p>{{i.now_profit}}</p>
            </div>
            <div class="item">
                <p>选买周期</p>
                <p>{{i.cycle_name}}</p>
            </div>
            <div class="item">
                <p>选买服务费</p>
                <p>{{i.right_money | addZero}}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
 name: 'holdCard',
 props:['holdList'],
  data () {
     return {
         
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
        .state{
            margin: .4rem;
            span{
                margin: 0 .2rem;
            }
            .btn-small{
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 12px;
            }
        }
        .btn{
            width: 16%;
            height: 22px;
            line-height: 22px;
            padding: 2px 6px;
            border-radius: 14px;
        }
    }
    .time{
        color:#BCBCBC;
        font-size: 12px;
        text-align: start;
        padding: 0 0 10px 20px;
        line-height: 18px;
        border-bottom: 1px solid #2A2A36;
    }
    .bottom{
        justify-content: space-around;
        color:#BCBCBC;
        line-height: 20px;
        margin: 10px 0;
    }
}
</style>

