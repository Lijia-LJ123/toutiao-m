<template>
    <div class="home-container">
      <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" fixed>
          <van-button class="serach-btn" slot="title" to='/search' size='small' icon="search" type="info" round>搜索</van-button>
        </van-nav-bar>

        <!-- 频道列表 -->
        <!-- animated 是否开启切换标签内容时的转场动画 -->
        <!-- 通过swipeable属性可以开启滑动切换标签页  是否开启手势滑动切换 -->
        <van-tabs v-model="active"  class="channel-tabs" swipeable animated>
          <van-tab v-for='item in userChannels' :key='item.id' :title="item.name">
            <!-- 频道的文章列表 -->
            <article-list :channel='item' />
          </van-tab>
          <!-- 汉堡包按钮 -->
          <!-- 相当于一个占位符 -->
          <div slot="nav-right" class="placeholder"></div>
          <div slot="nav-right"  class="hamburger-btn" @click="isChannelEditShow=true">
            <i class="toutiao  toutiao-gengduo" ></i>
          </div>
        </van-tabs>

        <!-- 频道列表的编辑弹出层 -->
        <van-popup
           class="edit-channel-popup"
          v-model="isChannelEditShow"
          position="bottom"
          closeable
          close-icon-position="top-left"
          :style="{ height: '100%' }" >

            <!-- 频道编辑组件 -->
            <!-- 传递userChannels、active -->
            <channel-edit @update-active='onUpdateActive' :active='active'  :myChannels='userChannels'></channel-edit>
          </van-popup>
    </div>
</template>

<script>
import { getItem } from '@/utils/storage.js';
import { mapState } from 'vuex';
import { getUserChannels } from '@/api/user.js';
// 引入文章列表组件
import ArticleList from './components/article-list';
// 引入频道编辑组件
import ChannelEdit from './components/channel-edit';

export default {
  name: 'HomePage',
  props: {},
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0,
      // 用户频道列表
      userChannels: [],
      // 控制弹出层的显示与隐藏
      isChannelEditShow: false
    };
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadUserChannels();
  },
  methods: {
    async loadUserChannels () {
      try {
        // let channels = [];
        // 1. 如果用户已登录，则请求获取用户频道数据
        // if (this.user) {
        //   const { data } = await getUserChannels();
        //   channels = data.data.channels;
        //   // console.log(channels);
        // } else {
        //   //2.如果未登录，查看本地是否存储有频道列表，
        //   const localChannels = getItem('TOUTIAO_CHANNELS');
        //   // 3.如果存储有频道列表则使用，
        //   if (localChannels) {
        //     channels = localChannels;
        //   } else {
        //     //4.如果没有请求获取频道，则使用推荐列表为默认的列表
        //     const { data } = await getUserChannels();
        //     channels = data.data.channels;
        //   }
        // }

        // 优化
        let channels = [];
        const localChannels = getItem('TOUTIAO_CHANNELS');
        if (this.user || !localChannels) {
          // 如果用户登录，或者没有登录并且没有本地频道列表时  获取后端数据
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          channels = localChannels;
        }
        this.userChannels = channels;
      } catch (err) {
        this.$toast.info('频道列表获取失败！');
      }
    },
    // 定义子向父传值的事件函数
    // 当不传参时默认值为true
    onUpdateActive (index, isChannelEditShow = true) {
      // console.log(index);
      // 让当前点击的这个高亮显示
      this.active = index;
      // 点击后关闭当前按钮
      this.isChannelEditShow = isChannelEditShow;
    }
  },

  mounted () {}
};
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  /deep/ .van-nav-bar__title {
    max-width: unset; //不要设置
    // max-width: 100%;
  }
  .serach-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  // 样式只能作用于跟组件，我们想给子组件设置样式，就需要使用深度操作符：/deep/
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
      .van-tab {
        border-right: 1px solid #edeff3;
        min-width: 200px;
        font-size: 30px;
        color: #777777;
      }
      .van-tab--active {
        color: #333333;
      }
      .van-tabs__nav {
        padding-bottom: 0;
      }
      .van-tabs__line {
        width: 31px !important;
        height: 6px;
        bottom: 8px;
        background-color: #3296fa;
      }

      // 汉堡包
      .placeholder {
        width: 66px;
        height: 82px;

        // 代表此元素不参与flex  1 参与  0 不参与
        // 即除placeholder外的所有区域参与flex布局
        flex-shrink: 0;
      }
      .hamburger-btn {
        position: fixed;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 66px;
        height: 82px;
        background-color: #fff;
        opacity: 0.902;
        i.taobao {
          font-size: 33px;
        }
        &:before {
          content: '';
          position: absolute;
          left: 0;
          width: 1px;
          height: 100%;
          background-image: url(~@/assets/gradient-gray-line.png);
          background-size: contain;
        }
      }
    }
  }

  .edit-channel-popup {
    padding-top: 100px;
    box-sizing: border-box;
  }
}
</style>
