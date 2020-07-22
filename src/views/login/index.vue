<template>
    <div class="login-container">
        <!-- 导航栏 -->
       <van-nav-bar class="page-nav-bar" title="登录">
         <van-icon @click="$router.back()" slot="left" name="cross" />
       </van-nav-bar>
        <!-- 登录表单 -->
        <van-form ref="loginFormRef" @submit="onSubmit">
            <!-- 给van-filed组件配置rules验证规则，
            当表单提交的时候会自动触发表单验证
                验证通过，触发submit事件
                验证失败，不会触发
             type为number，input中就只能输入数字
                        maxlength='11',就只能输入11个数字
                    这俩属性，是HTML的属性-->
            <van-field
                v-model="user.mobile"
                name="mobile"
                placeholder="请输入手机号"
                :rules="userFormRules.mobile"
                type="number"
                maxlength='11'
            >

                <i slot="left-icon" class="toutiao toutiao-shouji"></i>
            </van-field>
            <van-field
                v-model="user.code"
                name="code"
                placeholder="请输入验证码"
                :rules="userFormRules.code"
                 type="number"
                maxlength='6'
            >
                <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
                <template #button>
                  <!-- 倒计时 -->
                  <van-count-down v-if="isCountDownShow" :time="1000*60" format=" ss s" @finish='isCountDownShow=false' />
                  <!-- 发送验证码 -->
                   <van-button v-else @click="onSendSms" native-type='button' class="send-sms-btn" round size="small" type="default">获取验证码</van-button>
                </template>
            </van-field>
            <div class="login-btn-wrap" >
                <van-button class="login-btn"  block type="info" native-type="submit">
                提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
// 按需导入
import { login, sendSms } from '@/api/user';
export default {
  name: 'LoginIndex',
  props: {},
  components: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false
    };
  },
  computed: {},
  watch: {},
  methods: {
    async onSubmit () {
      // 获取表单数据
      const user = this.user;

      // 展示加载提示
      // 组件中通过this.$toast来使用
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 是否禁止背景点击
        duration: 0
      });

      try {
        const res = await login(user);
        // console.log('登录成功', res);
        // 把获取到的token信息传递给user
        this.$store.commit('setUser', res.data.data);
        this.$toast.success('登录成功');

        // 登录成功后，跳转回原来的页面
        this.$router.back();
      } catch (err) {
        console.log(err);
        // console.log('err.response');

        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误');
          console.log('手机号或验证码错误', err);
        } else {
          this.$toast.fail('登录失败，请稍候重试');
          console.log('登录失败，请稍候重试', err);
        }
      }
    },
    // 发送验证信息
    async onSendSms () {
      console.log('onSendSms');

      // 校验手机号
      try {
        //   validate返回一个Promise对象
        await this.$refs.loginFormRef.validate('mobile');
        // console.log('手机格式正确');
      } catch (err) {
        return console.log('验证失败', err);
      }
      // 验证通过，倒计时显示
      this.isCountDownShow = true;
      // 请求发送验证码
      try {
        await sendSms(this.user.mobile);
        this.$toast.success('发送成功');
      } catch (err) {
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁了，请稍后重试');
        } else {
          this.$toast.fail('发送失败，请稍后重试');
        }
      }
    }
  },
  created () {},
  mounted () {}
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    padding: 0;
    color: #666;
    background-color: #ededed;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
