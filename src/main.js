// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);


Vue.prototype.API_HOST =  process.env.API_HOST
import common from './config/common.js'
Vue.use(common)
import './assets/base.css'; 

import stockChars from './config/stockChars.js';
Vue.use(stockChars);
//保留两位小数过滤器
Vue.filter('addZero', function (numb) {
  let num = parseFloat(numb);
  if (isNaN(num)) {
    return numb;
  }else{
    let numStr = Math.round(num)
    // 万以内直接返回 2位小数
    if (numStr/10000<1) {
      let result = Math.round(num * 100) / 100;
      return result.toFixed(2);
    }else if (numStr/100000000>1) {
        let decimal = numStr/100000000
        let result = (Math.round(decimal * 100) / 100).toFixed(2) + '亿';
        console.log('亿>>>>>>>>',result);
        return result;
    }else if (numStr/10000>1) {
        let decimal = numStr/10000
        let result = (Math.round(decimal * 100) / 100).toFixed(2) + '万';
        console.log('万>>>>>>>>',result);
        return result;
    }
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
