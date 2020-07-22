<template>
    <div class="my-container">

       <!-- 已登录头部 -->
      <div class="header user-info" v-if="user">
        <div class="base-info">
          <div class="info-left">
            <van-image class="avatar" round :src="userInfo.photo" fit='cover' />
            <span class="left-text">{{userInfo.name}}</span>
          </div>
          <div class="info-right">
             <van-button size="mini" round>编辑资料</van-button>
          </div>
        </div>
        <div class="data-stats">
            <div class="data-item">
              <span class="count">{{userInfo.art_count}}</span>
              <span class="text">头条</span>
            </div>
            <div class="data-item">
              <span class="count">{{userInfo.follow_count}}</span>
              <span class="text">关注</span>
            </div>
            <div class="data-item">
              <span class="count">{{userInfo.fans_count}}</span>
              <span class="text">粉丝</span>
            </div>
            <div class="data-item">
              <span class="count">{{userInfo.like_count}}</span>
              <span class="text">获赞</span>
            </div>
        </div>
      </div>

     <!-- 未登录头部 -->
      <div class="header not-login" v-else>
        <div class="login-btn" @click="$router.push('/login')">
          <img class="mobile-img" round src="~@/assets/mobile.png" />
          <span class="mobile-text">登录 / 注册</span>
        </div>
      </div>

      <!-- 宫格导航 -->
      <van-grid class="grid-nav" clickable  :column-num="2">
        <van-grid-item class="grid-item">
          <i slot="icon" class="toutiao toutiao-shoucang"></i>
          <span slot="text" class="text">收藏</span>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <i slot="icon" class="toutiao toutiao-lishi"></i>
          <span slot="text" class="text">历史</span>
        </van-grid-item>
      </van-grid>

      <!-- 消息通知和小智同学 -->
      <div class="cell-nav">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>

      <!-- 退出按钮 -->
      <van-cell class="logout-cell" @click="onLoginOut"  title="退出登录" v-if="user" />
    </div>
</template>

<script>
// 映射user数据
import { mapState } from 'vuex';

// 导入getUserInfo
import { getUserInfo } from '@/api/user.js';

export default {
  name: 'MyPage',
  props: {},
  components: {},
  data () {
    return {
      // 获取用户自己信息
      userInfo: {}
    };
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 初始化的时候，如果用户登录了，才请求获取当前的用户信息
    if (this.user) {
      this.loadUserInfo();
    }
  },
  methods: {
    // 退出登录
    onLoginOut () {
      this.$dialog
        .confirm({
          title: '确认退出？',
          message: '弹窗内容'
        })
        .then(() => {
          // 确认执行then
          this.$store.commit('setUser', null);
        })
        .catch(() => {
          // 取消执行catch
          console.log('取消执行这里');
        });
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo();
        console.log(data);
        this.userInfo = data.data;
      } catch (err) {
        console.log(err);
        this.$toast.fail('获取数据失败！');
      }
    }
  },

  mounted () {}
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .mobile-text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .info-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 1px solid #fff;
          margin-right: 23px;
        }
        .left-text {
          font-size: 30px;
          color: #fff;
        }
      }
      .info-right {
      }
    }
    .data-stats {
      height: 131px;
      display: flex;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      .tubiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }

  .cell-nav {
    margin-top: 5px;
  }

  .logout-cell {
    text-align: center;
    color: #e17569;
    margin-top: 5px;
  }
}
</style>
