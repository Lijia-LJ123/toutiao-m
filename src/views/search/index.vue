<template>
    <div class="search-container">
        <!-- 搜索框 -->
        <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
        <form action="/">
            <van-search
                v-model="searchText"
                show-action
                placeholder="请输入搜索关键词"
                background="#3196fa"
                @search="onSearch"
                @cancel="onCancel"
                @focus="isResultShow=false"
            >

            </van-search>

         </form>

        <!-- 搜索结果 -->
        <search-result v-if="isResultShow" :searchText='searchText'></search-result>

         <!-- 联想建议 -->
         <!-- 子组件把点击的联想结果传递给父组件，父组件触发onSearch事件，更换搜索框的内容 -->
        <search-suggestion v-else-if="searchText"  @search='onSearch' :searchText='searchText'></search-suggestion>

        <!-- 搜索历史 -->
         <search-history
         @search='onSearch'
          @clear-search-history='searchHistories=[]'
          v-else
          :searchHistories='searchHistories'>
          </search-history>
    </div>
</template>

<script>
import SearchHistory from './components/search-history';
import SearchSuggestion from './components/search-suggestion';
import SearchResult from './components/search-result';
import { setItem, getItem } from '@/utils/storage';
export default {
  name: 'SearchIndex',
  props: {},
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data () {
    return {
      // 搜索框的值
      searchText: '',
      //   搜索结果的隐藏
      isResultShow: false,
      // 存储历史记录
      // 当初始化时，首先获取本地存储的历史记录数据，如果没有，则为空
      searchHistories: getItem('search-histories') || []
    };
  },
  computed: {},
  watch: {
    // 监听历史记录的变化，并存储到本地
    searchHistories (val) {
      setItem('search-histories', val);
    }
  },
  created () {},
  methods: {
    onSearch (val) {
      // 更新文本内容
      this.searchText = val;
      // console.log(val);

      // 存储搜索的历史记录
      // 查找有没有相同的记录，
      const index = this.searchHistories.indexOf(val);
      // 如果有，先删除已存在的记录
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      // 然后再添加到历史记录的最前面
      this.searchHistories.unshift(val);

      this.isResultShow = true;
    },
    onCancel () {
      this.$toast('取消');
      this.$router.back();
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;
  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>
