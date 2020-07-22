const path = require("path");

//1.导入在内存中生成页面的webpack 插件
const htmlWebpackPlugin = require("html-webpack-plugin");

//导入vueloaderplugin 组件
const VueLoaderPlugin = require("vue-loader/lib/plugin");

//使用node 向外暴露配置对象，从而，让webpack运行的时候，加载指定的配置
//为什么使用node 语法？ 因为webpack 是基于node 构建的
module.exports = {
  entry: path.join(__dirname, "./src/main.js"), //项目的入口文件
  output: {
    path: path.join(__dirname, "./dist"), //输出路径
    filename: "bundle.js", //输出文件名
  }, //打包好的文件的数据配置

  plugins: [
    //插件配置节点
    new htmlWebpackPlugin({
      //创建一个实例对象
      template: path.join(__dirname, "./src/index.html"), //指定模版页面路径
      filename: "index.html", //指定内存中生成的的html 名称
    }),

    //make sure to include the plugin
    new VueLoaderPlugin(),
  ],
  module: {
    //用来配置非js 文件对应的loader
    rules: [
      //就是这些非js 文件和 loader 之间的对应关系
      { test: /\.css$/, use: ["style-loader", "css-loader"] }, //test表示匹配, 创建处理css 文件的匹配规则
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] }, //创建配置处理less 文件规则
      { test: /\.scss$/, use: ["style-loader", "css-loader", "sass-loader"] }, //创建配置处理scss 文件规则
      {
        test: /\.jpg|png|gif|bmp|jpeg$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
              name: "[name].[ext]",
              limit: 10240,
            },
          },
        ],
      }, //配置处理样式表中图片的规则
      //可以使用？给url-loader 传递参数，其中，有一个固定的参数，叫做limit 表示图片的大小，需要给定一个数值
      //limit给定的数值是图片的大小，单位是字节
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      }, //添加转化js 文件的loader, 其中必须把node_modules目录设置为排除项，
      //这样在打包的时候，会忽略node_modules 目录下的所有js 文件;否则项目运行不起来
      { test: /\.vue$/, use: "vue-loader" },
      //解析vue组件的第三方loader
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: "url-loader",
      }, //处理样式文件中字体文件路径的问题
    ], //先加载'css-loader' ，然后把结果再传给 'style-loader'加载，最后'style-loader' 加载后的结果交给webpack 进行打包
  },
};
