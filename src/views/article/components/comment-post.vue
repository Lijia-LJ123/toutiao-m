<template>
 <div class="comment-post">
   <van-field
     class="post-field"
     v-model.trim="message"
     rows="2"
     autosize
     type="textarea"
     maxlength="50"
     placeholder="请输入留言"
     show-word-limit
   />
   <van-button
     class="post-btn"
     :disabled='!message.length'
     @click="onPost"
   >发布</van-button>
 </div>
</template>

<script>
import { addComment } from '@/api/comments.js';
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, Object, String],
      required: true
    }
  },
  data () {
    return {
      message: '' // 评论的内容
    };
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0
      });

      try {
        const { data } = await addComment({
          target: this.target, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message,
          art_id: null // 文章id，对文章进行评论，不要传此参数。
        });
        console.log(data);

        // 关闭弹出层
        // 将发布的内容显示到列表顶部
        // 清空文本框
        this.message = '';
        this.$emit('post-success', data.data); // 把子组件的数据传递给父组件使用
        this.$toast.success('发布成功');
      } catch (err) {
        console.log(err);
        this.$toast.fail('发布失败');
      }
    }
  }
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
