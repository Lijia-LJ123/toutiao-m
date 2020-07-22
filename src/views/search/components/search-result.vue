<template>
    <div class="search-result">
       <van-list
            v-model="loading"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
        </van-list>
    </div>
</template>

<script>
import { getSearchResult } from '@/api/search';
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页数，默认为1
      perPage: 10, // 每页显示多少条
      error: false
    };
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      try {
        console.log(this.searchText);

        // 1.异步获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.perPage,
          q: this.searchText
        });
        console.log(data);
        // 2.把数据添加到list数组中
        const { results } = data.data;
        this.list.push(...results);

        // 3.加载状态结束
        this.loading = false;

        // 4.判断是否加载结束
        if (results.length) {
          // 如果还有内容，让页码加1，显示下一页的内容
          this.page++;
        } else {
          // 数据全部加载完成
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.error = true;
        this.loading = false;
        this.$toast('加载结果失败');
      }
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
</style>
