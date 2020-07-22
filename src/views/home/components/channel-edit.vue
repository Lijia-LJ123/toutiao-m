<template>
    <div class="channel-edit">
        <!-- 频道编辑区域 -->
        <van-cell title="我的频道" :border='false' >
            <van-button slot="default" class="edit-btn" round plain type="danger" size='mini' @click="isEditShow=!isEditShow">{{isEditShow?'完成':'编辑'}}</van-button>
        </van-cell>

        <van-grid class="my-item" :gutter="10">
            <van-grid-item
                class="channel-item"
                v-for='(channelItem,index) in myChannels'
                :key='index'
                @click="onMyChannelClick(channelItem,index)"
                >
                <span class="text" :class="{active:active===index}" slot="text">{{channelItem.name}}</span>
                <!-- 通过插槽自定义删除图标 -->
                <van-icon v-show="isEditShow && !fixedChannels.includes(channelItem.id)" slot="icon" name="close" />
            </van-grid-item>

        </van-grid>

        <!-- 频道推荐区域 -->
        <van-cell title="频道推荐" :border='false'></van-cell>

        <van-grid class="recommend-item" :gutter="10">
            <van-grid-item
            @click="onAddChannel(channel)"
                icon='plus'
                class="channel-item"
                v-for="channel in recommendChannels"
                :key="channel.id"
                 :text="channel.name" />
        </van-grid>
    </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/article';
import { mapState } from 'vuex';
import { setItem } from '@/utils/storage.js';
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  components: {},
  data () {
    return {
      // 所有频道
      allChanndels: [],
      // 控制编辑状态
      isEditShow: false,
      // 固定频道不允许删除
      fixedChannels: [0]
    };
  },
  computed: {
    // 获取用户
    ...mapState(['user']),
    //   封装计算属性，筛选数据
    // 所有频道-用户频道=推荐频道
    // 计算属性会观测内部依赖数据的变化
    // 如果内部数据发生变化，则计算属性会重新执行
    recommendChannels () {
      // 方法一：
      //   const channels = [];
      //   //   遍历所有频道
      //   this.allChanndels.forEach(channel => {
      //     // find遍历用户频道，找出满足条件的，即所有频道与用户频道相同的
      //     const ret = this.myChannels.find(myChannel => {
      //       return myChannel.id === channel.id;
      //     });
      //     // 如果我的频道中没有该频道项，则添加到空数组中
      //     if (!ret) {
      //       channels.push(channel);
      //     }
      //   });
      //   //   最后把计算结果返回
      //   return channels;

      // 方法二：
      return this.allChanndels.filter(channel => {
        return !this.myChannels.find(myChannels => {
          return myChannels.id === channel.id;
        });
      });
      // return this.allChanndels.filter(
      //   a => !this.myChannels.some(b => b.id == a.id)
      // );

      // console.log(arrC);

      // 方法三
      //   return this.allChanndels.filter(
      //     x => !this.myChannels.map(y => y.id).includes(x.id)
      //   );
    }
  },
  watch: {},
  created () {
    this.loadAllChannels();
  },
  methods: {
    // 加载所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels();
        // console.log(data);
        this.allChanndels = data.data.channels;
        // console.log(this.allChanndels);
      } catch (err) {
        console.log(err);
      }
    },
    // 我的频道中 切换频道和删除频道
    onMyChannelClick (channelItem, index) {
      // 编辑状态，删除频道，非编辑，切换频道
      if (this.isEditShow) {
        // 1.判断是否为推荐 如果是推荐，则不删除
        // if (index === 0) return;
        if (this.fixedChannels.includes(channelItem.id)) return;

        // 2.执行删除操作
        // 如果删除的频道是高亮显示之前的，要把index-1

        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true);
        }
        this.myChannels.splice(index, 1);

        // 3.删除数据持久化
        this.deleteChannel(channelItem);
      } else {
        // 执行跳转
        // 子向父传值
        this.$emit('update-active', index, false);
      }
    },
    // 删除的数据持久化操作
    async deleteChannel (channelItem) {
      try {
        if (this.user) {
          // 已登录
          await deleteUserChannels(channelItem.id);
        } else {
          // 未登录，存储在本地
          setItem('TOUTIAO_CHANNELS', this.myChannels);
        }
      } catch (err) {
        console.log(err);
        this.$toast('删除频道失败，请稍后重试');
      }
    },
    // 添加频道
    async onAddChannel (channel) {
      console.log(channel);
      // 把点击的这个频道添加到我的频道中
      // 计算属性会观测内部依赖数据的变化
      // 如果内部数据发生变化，则计算属性会重新执行
      this.myChannels.push(channel); // 此时刷新，添加的频道会消失

      // 如果是已登录，则存储到后台服务器中，
      // 如果未登录，则存储到本地
      if (this.user) {
        // 已登录
        try {
          await addUserChannels({
            id: channel.id, // 频道的id
            seq: this.myChannels.length // 频道的序号，就是我的频道的长度
          });
          this.$toast('添加用户频道成功');
        } catch (err) {
          console.log(err);

          this.$toast('保存用户频道信息失败');
        }
      } else {
        //  未登录
        setItem('TOUTIAO_CHANNELS', this.myChannels);
      }
    }
  },
  mounted () {}
};
</script>

<style scoped lang="less">
.channel-edit {
  // 频道
  .van-cell__title {
    font-size: 32px;
    color: #333;
  }
  //   编辑
  .edit-btn {
    width: 130px;
    height: 50px;
    font-size: 26px;
    color: #f85a5a;
    border: 1px solid #f85a5a;
  }
  //   宫格
  .channel-item {
    width: 180px;
    height: 86px;
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
        white-space: nowrap;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  // // 关闭按钮
  /deep/ .van-icon-close {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 36px;
    color: #ccc;
  }

  //   频道推荐
  /deep/.recommend-item {
    .van-grid-item__content {
      display: flex;
      flex-direction: row;
      color: #222;
      .van-icon-plus {
        font-size: 24px;
      }
      .van-grid-item__text {
        font-size: 28px;
        margin-top: 0;
      }
    }
  }
}
</style>
