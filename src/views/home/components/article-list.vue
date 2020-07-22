<template>
    <div class="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="refreshing" :success-text="refreshSuccessText" success-duration='1500' @refresh="onRefresh">
        <!-- 列表---{{channel.name}} -->
       <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        @load="onLoad"
        >
         <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->

         <!-- 文章列表组件 -->
         <article-item
            v-for="(article,index) in list"
            :key="index"
            :article="article">
          </article-item>
        </van-list>
    </van-pull-refresh>
    </div>
</template>

<script>
import { getArticleList } from '@/api/article';
// 加载整个页面
import ArticleItem from '@/components/article-item';

export default {
  name: 'ArticleList',
  props: {
    //   子组件接收父组件传递过来的数据
    channel: {
      type: Object,
      //   这个数据必须是整数
      required: true
    }
  },
  components: { ArticleItem },
  data () {
    return {
      // 存储列表数据的数组
      list: [],
      //   控制加载中的loading状态
      loading: false,
      finished: false,
      error: false, // 是否加载失败
      timestamp: null, // 请求下一页数据的时间戳
      refreshing: false, // 控制下拉刷新的状态,
      refreshSuccessText: '刷新成功' // 下拉刷新成功，提示文本
    };
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    //   初始化或滚动到底部时会调用onload
    // 当组件滚动到底部时，会触发load事件并将loading设置成true
    async onLoad () {
      try {
        // 1、请求获取数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          // timestamp相当于页码，
          // 如果是请求第一页，当前时间戳Date.now()
          // 如果是请求之后的数据，使用本次接口返回的数据中的pre_timestamp
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        });
        // console.log(data);

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('hdgaklgjda;');
        // }

        // 2. 把请求结果的数据放到list数组中
        const { results } = data.data;
        //   数组的展开运算符...，把元素一个一个拿出来添加到list中
        this.list.push(...results);

        // 3.本次数据加载结束之后，要把加载状态设置为结束
        this.loading = false; // 隐藏加载中

        // 4.判断数据是否全部加载完成
        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true; // 显示没有更多
        }
      } catch (err) {
        console.log(err);
        this.loading = false; // 关闭loading效果
        this.error = true; // 开启错误提示
      }
    },

    // 下拉刷新
    async onRefresh () {
      try {
        // 1、请求获取数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据
          with_top: 1
        });

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('hdgaklgjda;');
        // }

        // 2. 把请求结果的数据放到list数组列表的顶部
        const { results } = data.data;
        //   数组的展开运算符...，把元素一个一个拿出来添加到list中
        this.list.unshift(...results);

        // 3.关闭下拉刷新的loading状态
        this.refreshing = false;

        // 更新下拉刷新成功的提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`;
      } catch (err) {
        console.log(err);
        this.refreshing = false; // 关闭loading效果
        this.refreshSuccessText = '刷新失败';
      }
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;
  height: 79vh;
  // vm/vh是基于浏览器窗口的大小，不受父元素的影响
  overflow-y: auto;
}
</style>
