---
path: /post/webpack-bundle-design
title: 使用Webpack设计一个所有项目适用的分包配置
date: 2019-09-06 09:04:00
category:
- 前端
tags:
- webpack
- 性能优化
---

本文是对[《设计一个无懈可击的浏览器缓存》](https://zhuanlan.zhihu.com/p/28113197?edition=yidianzixun&utm_source=yidianzixun&yidian_docid=0I3PuKjS)文章的延伸，其中应该有以下两个系列的文章：

1. Webpack生成能够持久缓存的分包配置
2. 使用Service Worker缓存资源支持离线访问

现在大部分现代的前端工程里应该都会使用Webpack去构建项目。虽然Webpack十分强大，但也十分复杂，在不同场景，不同技术里配置都不一样，而且里面还包含很多的专业术语。所以在此文里，希望能帮助你:

* 知道哪种种文件分割**file-splitting**策略最优于你的项目
* 如何进行文件分割

<!-- more -->

根据[Webpack术语表](https://webpack.js.org/glossary/)中可知，文件分割有两种不同的类型，两个虽然听起来差不多，但确是两种十分不一样的技术：

* **Bundle Splitting** -- 为SPA生成多个独立的包，以便于浏览器更好地缓存。
* **Code Splitting** -- 在Vue和React中一般用为路由分割，把代码分成多个小块，动态加载当前页面需要使用的内容。

在大型应用中，静态资源持久缓存带来的效果提升会十分明显，想象你有一个2M的应用，分割成10个200k的包，每次更新内容只是其中一个包，用户只需要请求200k的数据即可，而不用每次更新都请求2M的数据。对流量的节省提升也是巨大的。

Let's code.

## Bundle Splitting
⚠️ 在此文中**Bundle Splitting**都简称为包分割。

包分割的目的其实很简单，假如你用**Vue-cli**生成项目，那么构建出来的代码会有一个巨大的**vendor**包，假如用户每次访问都需要请求这个更新包，可想而知，每次都需要长时间的等待，和耗费巨大的流量。如果把这个包分成两个，用户每次访问只需下载更新的包，另一个则从浏览器缓存中获取。

( 在很多前端优化文章中经常会提要压缩资源，合并请求，这里的观点其实跟旧的优化方案有点相违背的，但是从HTTP1.1中已经有了[HTTP管线化]([https://zh.wikipedia.org/wiki/HTTP%E7%AE%A1%E7%B7%9A%E5%8C%96)，又或者[HTTP2中的多路复用](https://zh.wikipedia.org/wiki/HTTP/2)，能够在一次连接中发送多个请求，加上现代浏览器提供的[Preload\Prefetch](https://developers.google.com/web/fundamentals/performance/resource-prioritization)等技术，多个HTTP的请求的性能损耗在缓存中提供的性能提升应该是不值一提的 )

Let's talk with data. 下面我们会使用表格去对比优化前后的不同及优化后的收益，所以我们需要锁定在一个固定的场景中，以便测试和分析缓存的收益

* John在8周里每周都访问我们的网站
* 我们每周都需要发版更新网站
* 我们有一个任务列表页面需要每周迭代更新
*  在第四周我们添加了一个**npm package**
* 在第七周我们更新了所有**npm package**

## 基本配置
我们的项目是一个400KB左右的SPA，有一个`main.js`的入口文件，我们的Webpack配置看起来应该像以下这样的（下面的配置只显示主要配置）

```javascript
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resovle(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  }
}
```

构建出来的文件名应该和`index.mx4fd8c53.js`差不多，那串看不懂的东西就是上方ouput里面的`[contenthash]`，就是根据文件内容生产的哈希值，也就以为着每次更新内容，哈希值就会更新，浏览器就要重新下载这个 400KB 的文件。

那么每周的访问情况应该和下表一样

![table-1](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/webpack-bundle-design/table-1.png)

## 分割第三方vendor包
如果使用 [Vue-cli](https://cli.vuejs.org/) ，创建的项目，构建出来一般都有分为主入口问价，外加一个`vendor.js`的文件。

在Webpack 4分包配置做了很多简化，通过一些简单的配置项就可做包分割，而不用每次写一大堆function和正则去匹配包，pretty good👏🏻

回到主题，在webpack配置中加上`optimization.splitChunks.chunks = 'all'`就可以将所有`node_module`分割成`vendor.js`。

有了这个`vendor.js`包，我们的John同学每次访问时候就变成了下载两个200kb的包，但是每周更新的时候只需下载200k内容即可。

![table-2](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/webpack-bundle-design/table-2.png)

只有2.24M，节省了**23%**的流量，只需几行配置，这个数值还会随着时间增加而不断增加，我想这个数值对于各位看官已经有点吸引了是吧，毕竟更少的请求流量也代表着更快的访问速度。

我们还能进一步提升这个数值。

## Splitting out each package
上方的`vendor.js`其实是一个split all in one的状态，所以它也会遇到刚开始的问题，只要更新某个模块，就要全量更新。知道了问题，我们可以做的更好的，不是吗。

在这时，相信很多看官都能想到，把所有第三方依赖都分割开单独缓存. Right, 那么我们将把`vue`, `vue-router`, `moment`等分割开来:

```javascript
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resovle(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  plugins: [ new webpack.HashedModuleIdsPlugin() ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequest: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
            return `pkg.${packageName.replace('@', '')}`
          }
        }
      }
    }
  }
}
```

Webpack Guide中的[缓存](https://webpack.docschina.org/guides/caching/)有很好地解释为什么要使用上方配置，除此之外还有下面一些常规模块需要注意一下的：

* Webpack很多配置都与缓存相悖，像每个入口只能分割出3个文件，最小分割文件大小限制为30k(小文件都会打包在一起)。上方配置重新配置了这两部分内容。
* [`cacheGroups`](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups)配置项能告诉webpack怎么做包分割，基本配置就是抽出`node_modules`中所有第三方库，打包成`vendor.js`。一般使用该配置项时候key包名字，在这里我们使用了一个函数，匹配到`node_modules`包就返回对应包名字，例如`pkg.vue.m87df6g2.js`。
* 这样做还有一个好处就是，每次修改依赖包不需要手动去维护配置。

John依然要每周下载一个200kb的主包，还有在首次加载时候加载200kb的第三方依赖，但是后面就不需要重复下载这些依赖了。

![table-3](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/webpack-bundle-design/table-3.png)

对比**3.3M**的配置，这里足足减少了**45%**请求流量，that’s pretty cool.

我想我们还能把这个数值提高到**50%**以上🤔

## 继续分割我们主应用的代码
我们的`main.js`主包还是要每周下载的，从上方还提及到我们有一个任务列表页面需要每周更新，那么我们应该怎么把这个页面单独分割出来呢。

### 添加entry配置
添加TaskList入口配置，我们以上方的配置文件为例子，添加一个`TaskList`的配置：

```javascript
/** some code */
module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    TaskList: path.resolve(__dirname, 'src/pages/TaskList.js'),
    TaskDetail: path.resolve(__dirname, 'src/pages/TaskDetail.js')
  }
}
```

### 使用code splitting
在**SPA**中我们一般使我们的路由动态加载，简称路由分割，以`vue-router`为例，我们的路由配置应该如下：

```javascript
export default [
  {
    path: 'tasklist',
    name: 'TaskList',
    component: () => import('@/pages/TaskList')
  },
  {
    path: 'taskdetail',
    name: 'TaskDetail',
    component: () => import('@/pages/TaskDetail')
  }
]
```

Good, 现在webpack分离了`ProductList.js`和`ProductDetail`两个文件，我们的John同学又能少下载50kb的文件了。

Look like this.

![table-4](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/webpack-bundle-design/table-4.png)

**现在只有1.44M了！**

我们减少了John**57%**的下载文件大小，随着访问时间的增长这个值也会越来越大。

为什么代码分割这么重要，除了能单独缓存和减少文件请求大小外，更小的包也意味着**更快的脚本解析时间**，**更快的首屏渲染时间**。

## Summary
关于文件数量这里还要再插播一下，如果旧项目使用此配置时候，应该会生成很多零碎的文件，主要原因可能有以下几方面：

1. 项目积累太多无用依赖没有及时清理
2. css全部extract，全部样式都按组件粒度提取出来了，这里建议只提取公共和第三方的样式，具体可以参考[mini-css-extract-plugin的配置](https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-css-based-on-entry)

- - - -

最后我们总结一下要点：

* 将文件分割成多个更小的文件
* SPA中，减少入口文件第三方插件的数量，分散到各个模块中加载，这样能加快应用启动速度，减少首屏所需资源的数量。
* 使用**contentHash**避免每次构建生成新的文件id，便于浏览器缓存

**另外，多看文档 🌚**

### Reference
> [The 100% correct way to split your chunks with webpack](https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758)
> [Webpack](https://webpack.js.org/)
> [设计一个无懈可击的浏览器缓存](https://zhuanlan.zhihu.com/p/28113197?edition=yidianzixun&utm_source=yidianzixun&yidian_docid=0I3PuKjS)
