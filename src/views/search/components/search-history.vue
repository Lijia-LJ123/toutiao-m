<template>
    <div class="search-history">
         <van-cell title="搜索历史"  >
               <!-- 如果为true，显示 -->
             <div v-if="isDeleteShow">
                  <span @click="$emit('clear-search-history')">全部删除</span> &nbsp;&nbsp;
                  <span @click="isDeleteShow=false">完成</span>
             </div>
             <!-- 如果为false，隐藏 -->
             <van-icon v-else name="delete" @click="isDeleteShow=true" />
         </van-cell>
          <van-cell @click="onHistoryClick(item,index)" :title="item"  v-for="(item,index) in searchHistories" :key="index" >
               <van-icon name="close" v-if='isDeleteShow'  />
         </van-cell>
    </div>
</template>

<script>
// import { getSearchHistories } from '@/api/search.js';
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  components: {},
  data () {
    return {
      //     控制删除按钮的显示与隐藏
      isDeleteShow: false
    };
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    onHistoryClick (item, index) {
      // 如果是删除状态，执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1);
        // 此时我们会发现，当通过splice进行删除时，父组件searchIndex会删除相应的记录
        // 但是，如果点击全部删除，不会删除父组件的全部记录
        //   通知父组件，让父组件去删除
      } else {
        // 否则执行搜索操作
        //   子组件把值传递给父组件进行搜索
        this.$emit('search', item);
      }
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
</style>
