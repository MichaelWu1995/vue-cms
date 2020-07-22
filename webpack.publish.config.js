const path = require("path");

//1.导入在内存中生成页面的webpack 插件
const htmlWebpackPlugin = require("html-webpack-plugin");

//删除文件夹的插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

//导入压缩文件的插件
const TerserPlugin = require("terser-webpack-plugin");

const webpack = require("webpack");

//导入抽取css样式文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

//导入vue loader 插件
const VueLoaderPlugin = require("vue-loader/lib/plugin");

//导入压缩抽离出来的css文件的插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

//使用node 向外暴露配置对象，从而，让webpack运行的时候，加载指定的配置
//为什么使用node 语法？ 因为webpack 是基于node 构建的
module.exports = {
  mode: "production",
  entry: {
    app: path.join(__dirname, "./src/main.js"), //项目的主入口文件
  },

  output: {
    path: path.join(__dirname, "./dist"), //输出路径
    filename: "js/[name].js", //输出文件名
  }, //打包好的文件的数据配置

  plugins: [
    //插件配置节点
    new htmlWebpackPlugin({
      //创建一个实例对象
      template: path.join(__dirname, "./src/index.html"), //指定模版页面路径
      filename: "index.html", //指定内存中生成的的html 名称
      minify: {
        removeComments: true, //移除注释
        collapseWhitespace: true, //合并空白字符
        removeAttributeQuotes: true, //移除属性节点上的引号
      },
    }),

    new CleanWebpackPlugin(), //指定每次重新发布的时候要删除的文件夹

    //make sure to include the plugin
    new VueLoaderPlugin(),

    new webpack.DefinePlugin({
      //插件的作用：相当于在项目的全局配置了一些可用的变量， 将来我们引用的第三方包
      //比如vue, 会检查webpack 中有没有提供 process.env.NODE_ENV 字段， 如果有，
      //而且字段的名字为 “production”， 就表示生产发布环境，那么会移除不必要的 vue
      //警告功能，并做优化
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),

    new MiniCssExtractPlugin({
      filename: "css/[name]-[hash:8].css",
      chunkFilename: "css/[name]-[hash:8].css",
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vue: {
          name: "vue",
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router|vue-preview)[\\/]/,
          chunks: "all",
          priority: 10,
        },

        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: 5,
        },

        common: {
          name: "common",
          test: /[\\/]src[\\/]/,
          chunks: "all",
          priority: 3,
        },

        default: false,
      },
    },

    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,

        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
        },
      }),

      new OptimizeCSSAssetsPlugin({}),
    ],
  },

  module: {
    //用来配置非js 文件对应的loader
    rules: [
      //就是这些非js 文件和 loader 之间的对应关系
      {
        test: /\.(sa|sc|c|le)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../", //表示如果将来生成的样式中如果包含样式，则需要加入 ../ 前缀
            },
          },
          "css-loader",
          "sass-loader",
          "less-loader",
        ],
      }, //将样式表从js中抽离出来

      {
        test: /\.jpg|png|gif|bmp|jpeg$/,
        use: [
          {
            loader: "url-loader",
            options: {
              esModule: false,
              name: "images/[name]-[hash:8].[ext]",
              limit: 10,
            },
          },
        ],
      }, //配置处理样式表中图片的规则
      //可以使用？给url-loader 传递参数，其中，有一个固定的参数，叫做limit 表示图片的大小，需要给定一个数值
      //limit给定的数值是图片的大小，单位是字节
      { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ }, //添加转化js 文件的loader, 其中必须把node_modules目录设置为排除项，
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
