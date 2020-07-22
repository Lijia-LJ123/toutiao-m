<template>
    <div class="layout-container">
        <!-- 子路由占位符 -->
        <router-view></router-view>

        <!-- 标签导航栏 -->
        <van-tabbar class="layout-tabbar" route>
            <van-tabbar-item to='/'>
                <i slot="icon"  class="toutiao toutiao-shouye"></i>
                首页
            </van-tabbar-item>
            <van-tabbar-item to='/qa'>
                <i slot="icon"  class="toutiao toutiao-wenda"></i>
                问答
            </van-tabbar-item>
            <van-tabbar-item to='/video'>
                <i slot="icon"  class="toutiao toutiao-shipin"></i>
                视频
            </van-tabbar-item>
            <van-tabbar-item to='/my'>
                <i slot="icon"  class="toutiao toutiao-wode"></i>
                <span>{{$store.state.user?"我的":"未登录"}}</span>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  props: {},
  components: {},
  data () {
    return {
      active: 0
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created () {},
  mounted () {}
};
</script>

<style scoped lang="less">
.layout-container {
  padding-bottom: 100px;
  .layout-tabbar {
    font-size: 20px;
    .toutiao {
      font-size: 40px;
    }
  }
}
</style>
