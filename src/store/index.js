import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '../utils/storage';

Vue.use(Vuex)

const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 用户的登录状态信息
    // user: null
    // 把字符串形式的在转换为对象
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data // 但此时一刷新，存储的token信息就会不存在
      // 为了防止刷新丢失，我们需要把数据备份到本地存储中
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(user))
      // localStorage只能存储字符串

      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
