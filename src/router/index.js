import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home/index'//首页
import notice from '@/pages/home/notice'//首页=>公告

import login from '@/pages/login/login'//登录页
import register from '@/pages/login/register'//注册页
import resetPassword from '@/pages/login/resetPassword'//重置密码
import editPassword from '@/pages/login/editPassword'//修改密码

import choose from '@/pages/choose/index'//自选
import search from '@/pages/choose/children/search'//自选=>搜索自选股


import apply from '@/pages/apply/index'// 申购
import order from '@/pages/apply/order'// 申购=>确认订单
import enquiry from '@/pages/enquiry/index'//申购=>详情
import position from '@/pages/position/index'// 持仓/结算

import mine from '@/pages/mine/index'//我的
import recharge from '@/pages/mine/children/recharge'//我的=>充值
import withdraw from '@/pages/mine/children/withdraw'//我的=>提现
import balanceRecharge from '@/pages/mine/children/balanceRecharge'//我的=>充值=>余额充值
import chooseBank from '@/pages/mine/children/chooseBank'//我的=>充值=>余额充值=》更换/选择银行卡
import myInfo from '@/pages/mine/children/myInfo'//我的=>个人信息
import capitalDetail from '@/pages/mine/children/capitalDetail'//我的=>资金明细
import authentication from '@/pages/mine/children/authentication'//我的=>个人信息=>实名绑卡


Vue.use(Router)

export default new Router({
  routes: [
    { path: '/login', name: 'login',component: login},
    { path: '/register', name: 'register',component: register},
    { path: '/resetPassword', name: 'resetPassword',component: resetPassword},//重置密码
    { path: '/editPassword', name: 'editPassword', component: editPassword },//修改密码
    
    { path: '/', name: 'home',component: home},//首页
    { path: '/notice', name: 'notice',component: notice},//首页=>公告
    
    { path: '/choose', name: 'choose', component: choose },//自选
    { path: '/choose/search', name: 'search', component: search },//自选=>搜索自选股
    
    { path: '/apply', name: 'apply', component: apply },// 申购
    { path: '/apply/order', name: 'order', component: order },// 申购=>确认订单
    { path: '/enquiry', name: 'enquiry', component: enquiry },//申购=>详情
    { path: '/position', name: 'position', component: position },// 持仓/结算
    
    { path: '/mine', name: 'mine',component: mine},//我的
    { path: '/mine/recharge', name: 'recharge',component: recharge},//我的=>充值
    { path: '/mine/withdraw', name: 'withdraw',component: withdraw},//我的=>提现
    { path: '/mine/balanceRecharge', name: 'balanceRecharge',component: balanceRecharge},//我的=>充值=>余额充值
    { path: '/mine/chooseBank', name: 'chooseBank',component: chooseBank},//我的=>充值=>余额充值=》更换/选择银行卡
    { path: '/mine/myInfo', name: 'myInfo',component: myInfo},//我的=>个人信息
    { path: '/mine/capitalDetail', name: 'capitalDetail',component: capitalDetail},//我的=>资金明细
    { path: '/mine/authentication', name: 'authentication',component: authentication},//我的=>个人信息=>实名绑卡
  ]
})
