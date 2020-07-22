<template>
    <div class="article-comments">
        <p class="comment-title">全部评论</p>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <!-- 加载评论项组件 -->
            <comment-item
                v-for="(item,index) in list"
                :key="index"
                :comment='item'
                @click-reply="$emit('click-reply',$event)"
                ></comment-item>
        </van-list>
    </div>
</template>

<script>
import { getComments } from '@/api/comments.js';
import CommentItem from './comment-item.vue';
export default {
  name: 'ArticleComment',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => [] // 默认值为空数组
    }
  },
  components: {
    CommentItem
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的id
      limit: 10, // 获取评论个数，0表示服务器设定的默认值
      totalCount: 0 // 总条数
    };
  },
  computed: {},
  watch: {},
  created () {
    //   点击文章就可以获得评论总数
    this.onLoad();
  },
  methods: {
    async onLoad () {
      // 1.获取数据
      try {
        const { data } = await getComments({
          type: 'a',
          source: this.source,
          offset: this.offset,
          limit: this.limit
        });

        // 2.把数据放入数组中
        // const { results, total_count: totalCount } = data.data;
        const { results } = data.data;
        this.list.push(...results);

        // 把文章评论的总数量传递到外部父组件
        this.$emit('onload-success', data.data);
        console.log(data);

        //   3.将loading加载状态结束
        this.loading = false;

        // 4. 数据是否全部加载完成
        if (results.length) {
          this.offset = data.data.last_id;
        } else {
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
.article-comments {
  .comment-title {
    margin-left: 15px;
    font-size: 40px;
  }
  .user-name {
    color: #466b9d;
    margin-left: 15px;
  }
  .van-cell__label {
    margin: 30px 0 0 15px;
  }
  .response {
    margin-left: 15px;
  }
  //   .publish-wrap {
  //     position: fixed;
  //     left: 0;
  //     bottom: 0;
  //     width: 100%;
  //   }
  //   .van-list {
  //     margin-bottom: 45px;
  //   }
}
</style>
