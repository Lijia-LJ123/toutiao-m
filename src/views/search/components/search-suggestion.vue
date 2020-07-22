<template>
    <div class="search-suggestion">
        <van-cell icon="search" v-for="(item,index) in suggestions" :key="index" >
          <!-- 将文本设置为插槽 -->
          <div slot="title" v-html="heightLight(item)" @click="$emit('search',item)"> </div>
        </van-cell>
    </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search.js';
// 防抖处理  使用按需导入，有利于打包结果的优化
import { debounce } from 'lodash';
export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data () {
    return {
      // 获取联想建议列表
      suggestions: []
    };
  },
  computed: {},
  watch: {
    //   监听文本框的数据变化
    searchText: {
      //   handler(val) {
      //     console.log(val);
      //     this.loadSearchSuggestion(val);
      //   },
      //   debounce函数，
      // 参数一：函数
      // 参数二：防抖时间
      // 返回值：防抖之后的函数，和参数1的功能是样的

      handler: debounce(function (val) {
        console.log(val);
        this.loadSearchSuggestion(val);
      }, 1000),

      //   该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  created () {},
  methods: {
    async loadSearchSuggestion (q) {
      try {
        const { data } = await getSearchSuggestion(q);
        // console.log(data);
        this.suggestions = data.data.options;
      } catch (err) {
        console.log(err);
      }
    },
    heightLight (item) {
      // RegExp构造函数创建了一个正则表达式对象，用于将文本与一个字符串匹配
      // g 全局匹配
      // i 不区分大小写
      // 并且正则表达式//中间的内容，会被当成字符串，所以不能使用this指向
      //  RegExp动态创建正则表达式
      // 第一个参数：匹配的模式字符串
      // 第二个参数：匹配的模式
      const heightLightStr = `<span class="active">${this.searchText} </span>`;
      const reg = new RegExp(this.searchText, 'gi');
      return item.replace(reg, heightLightStr);
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ .active {
    color: #49a2fb;
  }
}
</style>
