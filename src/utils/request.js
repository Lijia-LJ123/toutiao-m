// 封装axios请求模块

import axios from 'axios'
import store from '@/store'
import bigint from 'json-bigint'
// 在使用之前，先转换为字符串，以防止后续使用时还需要转换
const JSONBig = bigint({
  storeAsString: true
})

const request = axios.create({
  //  基础路径
  baseURL: 'http://ttapi.research.itcast.cn/',

  // transformRequest允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      // data是后端返回的原始数据，就是JSON格式的字符串
      return JSONBig.parse(data)
    } catch (err) {
      // 如果转换失败，则包装成统一数据格式并返回
      return data;
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // config：本次请求的配置对象
  // console.log(config);

  const { user } = store.state;
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 一定要返回config,否则请求就发不出去了
  return config;
}, function (error) {
  return Promise.reject(error);
});

//   响应拦截器

//  导出
export default request
