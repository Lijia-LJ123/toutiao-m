// PostCSS配置文件
module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 CSS 样式规则前缀

    // VueCLI 内部已经配置了 autoprefixer 插件
    // 所以又配置了一次，所以产生冲突了
    // 把autoprefixer配置给屏蔽掉，再次在终端重新运行时就不会有警告
    // autoprefixer: {
    //     // 配置要兼容到的环境信息
    //     browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },

    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem
    'postcss-pxtorem': {
      // rootValue表示根元素的大小，它会根据元素大小进行单位转换
      // 如果是基于lib-flexible的rem适配方案，应该是设置为你的设计稿的十分之一
      //      如设计稿宽度是750，则应该设置为75

      // 因为 Vant 是基于 375 写的，所以如果你设置为 75 的话，Vant 的样式就小了一半。

      // rootValue支持两种参数类型：数字、函数
      // rootValue: 37.5,

      // rootValue(obj) {
      //     // console.log(obj);
      //     // console.log(obj.file);
      //     return obj.file.indexOf('vant') !== -1 ? 37.5 : 75

      // },

      // 或者
      rootValue ({ file }) {
        // {file}是es6语法，表示参数解析
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转换的 CSS 属性
      // * 表示所有属性都要转换
      propList: ['*'],
      // 配置不要转换样式文件中的字号
      exclude: 'github-markdown'
    }
  }
};
