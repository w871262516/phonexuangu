/*****************************************************
    @$post_token(url, data,callback) 带的 post
    @$post(url, data,callback) 封装axios的 post
    @$get(url, data,callback) 封装axios的 get
    @isPoneAvailable(str) 判断手机号码格式
    @to(path) 跳路由
    @getToken() 从本地存储拿token
    @getToken() 从本地存储拿token
    @timeFormer(t) 解析时间，格式为 2019-01-10 14:11:53
 ******************************************************/

import Vue from 'vue'
import router from '../router'
import store from '../store/index'
import {Toast} from 'vant';
const axios = require('axios');
Vue.use(Toast);
Vue.prototype.isPoneAvailable = function (phone) { //验证手机号码
  let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}
Vue.prototype.getToken = function () {
    if(store.state.user.token==""){
        if(localStorage.getItem('token')){
            store.state.user.token = localStorage.getItem('token')
            return store.state.user.token
        }else{
            Toast('请重新登录');
            router.push('/login')
        }
    } else {
        return store.state.user.token
    }
}
Vue.prototype.to = function (params) { //跳路由
    router.push(params)
  }
Vue.prototype.$post = function (url, data, callback) {
  axios({
      method: "post",
      url: url,
      data: data,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(function (res) {
      if (res.data.code == 401) {//token过期
        Toast('请重新登录');
        router.push('/login')
      } else {
        checkToken(res)
        callback(res);
      }
      
    })
    .catch(function (error) {
      console.log(error);
    });
}

Vue.prototype.$get = function (url,data, callback) {
  axios({
      method: "get",
      url: url,
      params: data,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(function (res) {
      callback(res);
    })
    .catch(function (error) {
      console.log(error);
    });
}

Vue.prototype.$post_token = function (url, data, callback) {
  axios({
      method: "post",
      url: url,
      data:data,
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      headers: {
        'Authorization': 'bearer '+ data.authorization,
        "content-type": "application/x-www-form-urlencoded"
      }
    })
    .then(function (res) {
      if (res.data.code == 401) {//token过期
        Toast('请重新登录');
        router.push('/login')
      } else {
        checkToken(res)
        callback(res);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function checkToken(res) { //每次接口返回的数据都要检查token是否过期
  if (res.data.refresh_jwt_token&&res.data.refresh_jwt_token!='') {
    localStorage.setItem('token', res.data.refresh_jwt_token);
    store.state.user.token = res.data.refresh_jwt_token;
  } 
}
Vue.prototype.timeFormer = function(t){
	let date = new Date(t * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'; 
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    let D = date.getDate() + ' ';
   // let h = date.getHours() + ':';
    let h
    if(date.getHours()>9){
    	h = date.getHours() + ':'
    }else{
    	h ='0'+date.getHours() + ':'
    }
    let m
    if(date.getMinutes()>9){
    	m = date.getMinutes() + ':'
    }else{
    	m ='0'+date.getMinutes() + ':'
    }
    let s
    if(date.getSeconds()>9){
    	s = date.getSeconds()
    }else{
    	s ='0'+date.getSeconds()
    }
    return Y+M+D+h+m+s;
}
export default {
  name: 'commonFun'
}
