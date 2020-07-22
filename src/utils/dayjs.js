import Vue from 'vue'

// 加载dayjs
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 加载相对时间使用的插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// 加载语言配置 全局使用
dayjs.locale('zh-cn')

// console.log(dayjs().to(dayjs('1990')));
// 30 年以前

// 使用全局过滤器
// 过滤器名称、过滤器函数
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
