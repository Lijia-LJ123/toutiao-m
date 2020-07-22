<template>
         <van-button
           v-if="isFollowed"
            :loading='loading'
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
          >已关注</van-button>
          <van-button
            v-else
            :loading='loading'
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
          >关注</van-button>

</template>

<script>
import { addFollow, deleteFollow } from '@/api/user';
export default {
  name: 'FollowUser',
  // 自定义v-model的数据名称，和父组件没有关系
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed' // 默认是input
  },
  props: {
    //   接收父组件传递过来的状态和id
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  data () {
    return {
      // 展示关注按钮的loading状态,
      loading: false
    };
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    // 关注、取消关注
    async onFollow () {
      // 展示关注按钮的loading状态
      // 解决当网络比较慢时，用户多次点击，重复提交的情况
      this.loading = true;
      try {
        const authorId = this.userId;
        if (this.isFollowed) {
          // 如果已关注，点击则取消关注
          await deleteFollow(authorId);
          this.$toast.success('取消关注');
        } else {
          // 否则添加关注
          await addFollow(authorId);
          this.$toast.success('已关注');
        }
        // 更新视图
        // this.is_followd = !this.is_followd;
        // 直接使用子组件更新视图的状态时，每当父组件重新渲染，该值将会被覆盖，
        // 所以应该传递给父组件，让父组件去修改
        this.$emit('update-is_followed', !this.isFollowed);
      } catch (err) {
        console.log(err);
        let message = '操作失败，请重试！';
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己';
        }
        this.$toast(message);
      }
      // 关闭按钮的loading状态
      this.loading = false;
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
</style>
