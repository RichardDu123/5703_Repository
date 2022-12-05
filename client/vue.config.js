const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const path = require('path')
let productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const cdn = {
  css: ['https://unpkg.com/element-plus/dist/index.css'],
  js: ['https://unpkg.com/vue@3', 'https://unpkg.com/element-plus']
}
module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'element-plus': 'ElementPlus'
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  chainWebpack: config => {
    if (process.env.use_analyzer) { // 添加分析工具
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    //gzip压缩
    if (process.env.NODE_ENV === 'production') {
      config.plugin("CompressionPlugin").use('compression-webpack-plugin', [{
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8
      }])
    }
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn
      return args
    })
    config.optimization.splitChunks({
      cacheGroups: {
        common: {
          name: 'chunk-common', // 打包后的文件名
          chunks: 'initial', // 
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 1,
          reuseExistingChunk: true
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 2,
          reuseExistingChunk: true,
          enforce: true
        },
        antDesignVue: {
          name: 'chunk-eth',
          test: /[\\/]node_modules[\\/]@ethereumjs[\\/]/,
          chunks: 'initial',
          priority: 3,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    })
  },
  //引入less全局变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.join(__dirname, './src/assets/less/mixins.less')],
    },
  },
}
