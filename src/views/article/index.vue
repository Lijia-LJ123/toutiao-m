<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }} </h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>

        <!-- 关注组件 -->
        <!-- $event获取到的是子组件传递过来的事件参数 -->
        <!-- 把关注的状态is_followed和文章的id传递给子组件 -->
        <!-- update-follow接收子组件传递过来的数据，父组件去修改 -->
        <!-- <follow-user
          class='follow-btn'
          :is-followed='article.is_followed'
          :user-id='article.aut_id'
          @update-is_follow='article.is_followed=$event'
          >
        </follow-user> -->
        <!-- 当我们传递给子组件的数据既要使用，还要修改时，使用v-model -->
        <!-- 传递value='article.is_followed'
        有一个@input='article.is_followed=$event'事件 -->
        <!-- 如果需要修改v-moel的规则名称，可以通过子组件的model属性来配置修改 -->
         <follow-user
          class='follow-btn'
          :user-id='article.aut_id'
          v-model="article.is_followed"
          >
        </follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div ref="contentRef" class="article-content markdown-body" v-html="article.content"></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表组件 -->
        <article-comment
          :source='article.art_id'
          @onload-success='totalCommentCount=$event.total_count'
          :list='commentList'
          @click-reply='onClickReply'
        ></article-comment>

          <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click='isPostShow=true'
          >写评论</van-button>
          <!-- 评论总数 -->
          <van-icon
            name="comment-o"
            :info="totalCommentCount"
            color="#777"
          />
          <!-- 收藏 -->
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id='article.art_id'
          ></collect-article>

          <!-- 点赞 -->
          <like-article
           class="btn-item"
          :article-id='article.art_id'
          v-model="article.attitude"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发表评论弹出层 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
          >
          <!-- 加载发表评论组件 -->
          <comment-post
            :target='article.art_id'
            @post-success='onPostSuccess'
            ></comment-post>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus===404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->

    </div>

    <!-- 回复评论弹框 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      :style="{ height: '90%' }" >
      <!-- 回复评论组件 -->
      <comment-reply></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article';
import { ImagePreview } from 'vant';
import FollowUser from '@/components/follow-user';
import CollectArticle from '@/components/collect-article';
import LikeArticle from '@/components/like-article';
import ArticleComment from './components/article-comment.vue';
import CommentPost from './components/comment-post.vue';
import CommentReply from './components/comment-reply.vue';
export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    ArticleComment,
    CommentPost,
    CommentReply
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态，
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0, // 评论总数
      isPostShow: false, // 控制发布评论的显示与隐藏
      commentList: [], // 评论列表
      isReplyShow: false // 控制回复评论弹框的显示与隐藏
    };
  },
  computed: {},
  watch: {},
  created () {
    // 初始调用
    this.loadArticle();
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true;
      try {
        const { data } = await getArticleById(this.articleId);
        // if (Math.random() > 0.5) {
        //   JSON.parse('fdkalgdjkal');
        // }
        // console.log(data);

        // 数据驱动影响视图这件事不是立即的
        this.article = data.data;
        // 初始化图片预览
        setTimeout(() => {
          this.previewImage();
        }, 10);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        console.log('抱歉请求出错', err);
      }
      // 无论成功或失败，关闭加载状态
      this.loading = false;
    },
    previewImage () {
      // 获取元素所有的img DOM节点
      const contentImg = this.$refs.contentRef; // 获取到的是div里面的所有内容
      const allImg = contentImg.querySelectorAll('img');
      // console.log(allImg);
      const images = [];
      allImg.forEach((item, index) => {
        images.push(item.src);
        // 给每一张图片注册点击事件
        item.onclick = () => {
          ImagePreview({
            images: images,
            // 起始位置
            startPosition: index
          });
        };
      });
    },
    onPostSuccess (data) {
      this.isPostShow = false;
      // 把评论添加到列表顶部
      this.commentList.unshift(data.new_obj);
    },
    onClickReply (comment) {
      console.log(comment);
      this.isReplyShow = true;
    }
  }
};
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    width: 100%;
    overflow-y: scroll;
    background-color: #fff;
    // word-break: break-all;
  }
  .loading-wrap {
    padding: 0px !important;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
