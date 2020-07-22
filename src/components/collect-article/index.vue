<template>
        <van-icon
        :name="value?'star' : 'star-o'"
        :class="{collected:value}"
        :loading='loading'
        @click="onCollect"
      />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article';
export default {
  name: 'CollectArticle',
  props: {
    // v-model默认的名字
    //  value代表is_collected的值
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  data () {
    return {
      loading: false
    };
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    async onCollect () {
      this.loading = true;
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId);
        } else {
          // 没有收藏，收藏
          await addCollect(this.articleId);
        }
        this.$emit('input', !this.value);
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏');
      } catch (err) {
        this.$toast.fail('操作失败，请重试');
      }
      this.loading = false;
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
