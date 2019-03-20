<template>
  <div class="table" :class="data[7]<0?'down':'up'">
      <div class="current flex">
          <p class="current-price">{{nowPrice | addZero}}</p>
          <div class="floating">
              <p>{{data[7]>0?'+':''}}{{data[7] | addZero}}</p>
              <p>{{data[8]>0?'+':''}}{{data[8] | addZero}}</p>
          </div>
      </div>
    <table>
        <tr class="normal">
            <td>今开</td>
            <td>最高</td>
            <td>涨停</td>
            <td>成交量</td>
        </tr>
        <tr>
            <td>{{data[2] | addZero}}</td>
            <td>{{data[3] | addZero}}</td>
            <td>{{data[3]==data[5]?data[5]:'--' | addZero}}</td>
            <td>{{data[9] | addZero}}</td>
        </tr>
        <tr class="normal">
            <td>昨收</td>
            <td>最低</td>
            <td>跌停</td>
            <td>成交额</td>
        </tr>
        <tr>
            <td>{{data[6] | addZero}}</td>
            <td>{{data[4] | addZero}}</td>
            <td>{{data[4]==data[5]?data[5]:'--' | addZero}}</td>
            <td>{{data[10] | addZero}}</td>
        </tr>
        <tr class="normal">
            <td>总市值</td>
            <td>市净率</td>
            <td>换手率</td>
            <td>流通市值</td>
        </tr>
        <tr>
            <td>{{data[2] | addZero}}</td>
            <td>{{data[2] | addZero}}</td>
            <td>{{data[2] | addZero}}</td>
            <td>{{data[2] | addZero}}</td>
        </tr>
    </table>
    
  </div>
</template>

<script>
export default {
  name: 'stockTable',
  props:['data','nowPrice'],
  data () {
     return {
      list: [],
    };
  },
  created(){
    //   console.log(this.data);
      
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.table{
    font-size: 14px;
    background-color: #3A3949;
    padding: 10px 5px;
    .current{
        align-items: center;
        margin: 2px 16px;
        .current-price{
            font-size: 3rem;
        }
        .floating{
            font-size: 16px;
            p{
                margin: 4px 16px;
            }
        }
    }
    table{
        width: 100%;
        td{
            padding: 2px 0;   
        } 
        
    }
  
}
.up{
  color:#d61510;
}
</style>
<style scoped>

</style>



