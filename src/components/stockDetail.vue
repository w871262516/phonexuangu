<template>
  <div class="stock flex">
    <div :id="type" :class="type=='minutes'?'myChart':'dayChart'" style="width=100%"></div>
    <!-- <div class="pan" v-if="type=='minutes'">
        <div class="pan-item flex" v-for="(i,index) in pkData.sellList" :key="i">
            <p>卖{{index+1}}</p>
            <p class="up">{{i.price}}</p>
            <p>{{i.volume}}</p>
        </div>
        <div class="pan-item flex" v-for="(i,index) in pkData.buyList" :key="i">
            <p>买{{index+1}}</p>
            <p class="up">{{i.price}}</p>
            <p>{{i.volume}}</p>
        </div>
    </div> -->
  </div>
</template>

<script>
export default {
    name: 'eCharts',
    props:['type','echartData','period','pkData'],
    data () {
        return {
            len:5,
            today:null,
            categoryData:{//分时数据（echart用）
                'data':[],
                "yestclose": 0
            },
            kData:[]//K线数据（echart用）
        }
    },
    watch:{
       period(VAL){
        // this.getStockInfo()
       }
    },
    created(){    
        var date = new Date()
        this.today = (date.getMonth()+1).toString()+(date.getDate()).toString()
        this.getYesCloseStock()
        console.log(this.pkData);
        
    },
    mounted(){
        this.getStockInfo()
    },
    updated () {
        // this.getStockInfo()
    },
    methods: {
        getStockInfo(){
            var data = this.echartData
            this.$chartLoading.loading(this.type)
            this.$get(this.API_HOST + '/api/v1/stockQuotation',data , res => {
                console.log("股票分 日 周 月 线行情数据", res.data);    
                if (res.data.code == 200) {  
                    console.log(this.echartData.period);
                    
                    if(this.echartData.period=='f'){
                      this.formatMinutes(res.data.data.data)
                    }else{
                        this.formatDay1(res.data.data.data)  
                    }
                } else {
                    this.$toast(res.data.msg);
                }
            });  
        },
        //昨日收盘价
        getYesCloseStock(){
            this.$get(this.API_HOST + '/api/v1/stockMinuteQuotation', {stock_code:this.echartData.stock_code}, res => {
                console.log("昨日收盘价", res.data);
                if (res.data.code == 200) {
                    this.categoryData.yestclose = res.data.data.pClose
                } else {
                    
                }
            });
        },
        //分时图
        formatMinutes(echartData){
            this.categoryData.data = []
            var rawData = echartData
            var avg = 0
            var vol = 0
            for (var i = 0; i < rawData.length; i++) {
                if(rawData[i].date.toString().substring(5)==this.today){
                    var row = []
                    row.push((rawData[i].time).toString())
                    //当前价
                    row.push(parseFloat(rawData[i].close))
                    //均价
                    // var avgPrice = ((parseInt(rawData[i].turnover)/rawData[i].volume)*100)
                    avg = avg + parseInt(rawData[i].turnover)
                    
                    vol = (vol + rawData[i].volume)
                    var avgPrice = avg/vol*100
                    //均价保留两位数
                    row.push(parseFloat(((avgPrice*100)/100).toFixed(2)))
                    //成交量
                    row.push(rawData[i].volume)
                    this.categoryData.data.push(row)
                }
            }
            this.$chart.line1(this.type,'f',this.categoryData);
        },
        //K线图
        formatDay1(echartData){
            this.kData = []
            var rawData = echartData
            for (var i = 0; i < rawData.length; i++) {
                var row = []
                var time = rawData[i].date.toString()
                //处理日期格式
                row.push(time.substring(0,4)+'-'+time.substring(4,6)+'-'+time.substring(6))
                row.push(parseFloat(rawData[i].open))
                row.push(parseFloat(rawData[i].close))
                row.push(parseFloat(rawData[i].low))
                row.push(parseFloat(rawData[i].high))
                row.push(parseFloat(rawData[i].volume))
                this.kData.push(row)
            }
            this.$chart.line1(this.type,this.echartData.period,this.kData);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.stock{
    background: #3A3949;
    .myChart{
        width: 70%; 
        height:40vh;
        margin: 1rem 0;
    }
    .pan{
        width:30%;
        .pan-item{
            justify-content: space-around; 
            &:nth-child(1),&:nth-child(6){
                margin-top: .8rem;
            }
            p{
                line-height: 1.6rem;
                // font-size: 12px;
            }  
        }
        
    }
    .dayChart{
        width: 100%; 
        height:50vh;
        margin: 1rem 0;
    }
}
</style>
<style scoped>

</style>





// WEBPACK FOOTER //
// stockDetail.vue