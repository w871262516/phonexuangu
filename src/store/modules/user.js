import store from '../../store';

const user = {
  state: {
    token: '',
    phone:'',
    userInfo:{},
  },
  mutations: {
    SET_USER: (state, userInfo) => {//登录
      state.token = userInfo.token;
      state.phone = userInfo.phone;
    },
    SET_INFO: (state, userInfo) => {//我的
      state.userInfo = userInfo
    },
    
  },
  actions: {
    // 登录
    Login({ commit, state }, loginForm) {
      // return new Promise((resolve, reject) => {
        
      // });
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      
    },
    // 登出
    LogOut({ commit }) {
      
    },
  },
};
export default user;
  