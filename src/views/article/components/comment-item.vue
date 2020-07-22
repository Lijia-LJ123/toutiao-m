<template>
 <van-cell class="comment-item">
   <van-image
     slot="icon"
     class="avatar"
     round
     fit="cover"
     :src="comment.aut_photo"
   />
   <div slot="title" class="title-wrap">
     <div class="user-name">{{comment.aut_name}}</div>
     <van-button
       class="like-btn"
       :icon="comment.is_liking?'good-job':'good-job-o'"
       :class="{liked:comment.is_liking}"
       :loading='commentLoading'
        @click='onCommentLike'
     >{{comment.like_count>0?comment.like_count:'赞'}}</van-button>
   </div>
   <div slot="label">
     <p class="comment-content">{{comment.content}}</p>
     <div class="bottom-info">
       <span class="comment-pubdate">{{comment.pubdate| relativeTime}}</span>
       <van-button
         class="reply-btn"
         round
         @click="$emit('click-reply',comment)"
       >回复 {{comment.reply_count}}</van-button>
     </div>
   </div>
 </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comments.js';
export default {
  name: 'CommentItem',
  components: {},
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      commentLoading: false
    };
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onCommentLike () {
      this.commentLoading = true;
      try {
        if (this.comment.is_liking) {
          // 如果已点赞，则取消点赞
          await deleteCommentLike(this.comment.com_id);
          // 点赞数减1
          this.comment.like_count--;
        } else {
          // 如果没有点赞，则点赞
          await addCommentLike(this.comment.com_id);
          // 点赞数加1
          this.comment.like_count++;
          this.$toast('点赞成功');
        }
        // 更新视图
        this.comment.is_liking = !this.comment.is_liking;
      } catch (err) {
        console.log(err);
        this.$toast('点赞失败');
      }
      this.commentLoading = false;
    }
  }
};
</script>

<style scoped lang="less">
.comment-item {
  display: flex;
  justify-content: space-between;
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .van-cell__title {
    flex: 1;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .van-button--normal {
    padding: 0;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
    &.liked {
      color: #e5645f;
    }
  }
}
</style>
