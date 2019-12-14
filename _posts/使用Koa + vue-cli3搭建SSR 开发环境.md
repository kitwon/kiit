---
path: /post/ssr-with-koa-and-vue
title: 使用Koa + vue-cli3搭建SSR 开发环境
date: 2019-07-27 11:00:00
category:
- 前端
tags:
- koa
- ssr
- vue-cli3
---

阅读此文前建议先阅读下官方提供的文档[Vue SSR指南](https://ssr.vuejs.org/zh/)，并对以下工具有一定了解。
>  [Vue CLI](https://cli.vuejs.org/) — Vue脚手架，生成vue应用模板
>
>  [Vue SSR指南](https://ssr.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-ssr-%EF%BC%9F)  — 官方SSR教程及工具使用教程
>
> [Webpack](https://webpack.js.org/) — 前端构建工具
>
> [Koa](https://koajs.com/)  — 基于nodejs开发的网络框架

[👉🏻完整项目地址](https://github.com/kitwon/vue-ssr-boilerplate)

## Why do this
现在社区有很多如[Nuxt.js](https://zh.nuxtjs.org/)等框架或者插件，为什么还需要自己开发一个呢。首先自己开发能对工程细节有更好的控制，自定义程度更高，比如我需要在路由里面做一个优化点，或者需要结合redis做组件缓存。其次自己搭建能对框架有着更深入的理解，出现问题也能从容应对。

<!-- more -->

## 开始编码前
本文不会一步步讲如何重新搭建，只会挑取一些核心的地方进行分析，其他详情请自行查阅文档。

开发前我们需要确认一下开发环境里需要包含的功能：
1. 使用Vue-cli3生成项目(可选)
2. 使用koa启动web服务
3. 启动web服务时需要同时watch server bundle和client bundle
4. 支持HMR(热更新)

## 🛠 配置Webpack
因为是选择vue-cli3创建应用，所以这里我们需要配置`vue.config.js`。⚠️ 由于我在开发的时候选择了**TypeScript**，所有相关的代码请各位自行跳过。

配置Webpack有以下几点关键的地方:
* 区分客户端和服务的构建环境
* 删除SSR中不需要的插件
* 构建服务端bundle时候需要单独设置cache-loader文件夹及缓存指纹。

首先是删除插件，因为默认的webpack配置带有一些插件是ssr用不上的，如hmr和preload等，我们需要先删除。并且需要在配置文件中使用[cross-env](https://www.npmjs.com/package/cross-env)区分环境。

```javascript
const chainWbpack = (config) => {
	// 区分环境
	const target = process.env.SSR_TARGET;
  const isProd = process.env.NODE_ENV === 'production';
  const isServer = target === 'server';

  // 删除不需要的插件
  config.plugins.delete('hmr');
  config.plugins.delete('preload');
  config.plugins.delete('prefetch');
  config.plugins.delete('progress');
  if (!isProd) config.plugins.delete('no-emit-on-errors');

  // HTML
  // 生存模式下关闭HTML压缩
  if (isProd) {
    config.plugin('html').tap((args) => {
      args[0].minify.removeComments = false;
      return args;
    });
  }
}
```

然后继续在`vue.config.js`继续添加以下代码，分别对**Server Bundle**和**Client Bundle**构建进行配置

```javascript
const chainWbpack = (config) => {
  // ...other config
  //
	// 根据构建环境区分webpack入口文件
	config.entry('app').clear()
    .add(`./src/entry-${target}.ts`).end();

	if (isServer) {
    // 服务端bundle配置
    config.output.libraryTarget('commonjs2');
    config.node.clear();
    config.externals(nodeExternals({ whitelist: [/\.css$/, /\?vue&type=style/] }));
    config.target('node');
    config.optimization.splitChunks(false).minimize(false);
    config.plugins.delete('friendly-errors');
    config.plugin('ssr-server').use(VueSSRServerPlugin);
    config.plugin('loader').use(WebpackBar, [{ name: 'Server', color: 'orange' }]);

    // Change cache directory for server-side
    // Server bundle 单独分离cache文件夹
    config.module.rule('vue').use('cache-loader').tap((options) => {
      options.cacheIdentifier += '-server';
      options.cacheDirectory += '-server';
      return options;
    });

    config.module.rule('vue').use('vue-loader').tap((options) => {
      options.cacheIdentifier += '-server';
      options.cacheDirectory += '-server';
      options.optimizeSSR = isServer;
      return options;
    });
  } else {
    config.plugin('ssr-client').use(VueSSRClientPlugin);
    config.plugin('loader').use(WebpackBar, [{ name: 'Client', color: 'green' }]);
    config.devtool(!isProd ? '#cheap-module-source-map' : undefined);

    config.module.rule('vue').use('vue-loader').tap((options) => {
      options.optimizeSSR = false;
      return options;
    });
  }
}
```

除Webpack配置外，入口部分代码配置请参照官方文档中的[编写通用代码](https://ssr.vuejs.org/zh/guide/universal.html)、[源码结构](https://ssr.vuejs.org/zh/guide/structure.html)、[路由和代码分割](https://ssr.vuejs.org/zh/guide/routing.html)、[数据预取和状态](https://ssr.vuejs.org/zh/guide/data.html)几章。

## ⚙️ Server配置
服务里核心代码主要有以下3个地方
* `server/ssr.ts` —— 实例渲染方法及路由配置
* `server/scripts/webpack.ts` —— 获取Webpack配置
* `server/scripts/dev-server.ts` —— 开发环境下Webpack服务

### 渲染Vue实例
SSR中的实例渲染从[官方文档中Bundle Renderer](https://ssr.vuejs.org/zh/guide/bundle-renderer.html)可知，一个Bundle Renderer主要包含以下3部分
* Template —— 页面html模板
* Server bundle —— 服务端渲染核心资源
* Client manifest —— 客户端依赖资源

但是由于有开发环境的加入，上方资源获取由原本的文件获取变成从webpack进程中获取，核心部分代码如下

```typescript
// server/ssr.ts
// Wrap renderToString into the Promise
// renderToString使用Promise封装
export default function createRouter(app) {
	// some code
  //
  // core 核心代码
  let renderer;
  if (isProd) {
      // 生产模式下直接获取bundle并渲染
      const template = fs.readFileSync(config.ssr.template, 'utf-8');
      const serverBundle = require(config.ssr.server);
      const clientManifest = require(config.ssr.client);

      renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
      });
    } else {
      // 开发模式下从webpack中获取bundle
      // setupDevServer返回Promise，onUpdate回调获取render
      readyPromise = setupDevServer({
        server: app,
        templatePath: config.ssr.template,
        onUpdate: ({ serverBundle, options }) => {
          renderer = createBundleRenderer(serverBundle, options);
        }
      });
    }
}
```

### Dev Server
从上方可知，DevServer中会暴露一个`function setupDevServer(options): Promise<any> {}`的方法，并在onUpdate回调中获取bundle。从`createBundleRenderer`的方法中知道我们需要启动两个 Webpack实例去构建bundle，从中推断出devServer中的功能应有以下几个：

1. 获取client和server的 Webpack配置
2. 服务中需要启动两个 Webpack实例，等待构建后resolve bundle files
3. 构建client bundle时候加入HMR

获取Webpack配置只需通过修改两次环境变量并执行`service.resolveWebpackConfig`获取两份配置并暴露出去。API 请参考vue-service的源码，备注中有地址。

```typescript
// server/scripts/webpack.ts
/* eslint import/no-extraneous-dependencies: 0 */
import { join } from 'path';

/**
 * Refer to the source code from cli-service
 * https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/PluginAPI.js#L137
 */
const Service = require('@vue/cli-service/lib/Service');

const service = new Service(join(__dirname, '../..'));
service.init(process.env.NODE_ENV || 'development');

process.env.SSR_TARGET = 'client';
const clientConfig = service.resolveWebpackConfig();
process.env.SSR_TARGET = 'server';
const serverConfig = service.resolveWebpackConfig();

export {
  clientConfig,
  serverConfig
};
```

DevServer的逻辑也不复杂，里面主要有以下几个核心内容：

1. setupDevServer返回一个Promise，构建完成时候resolve，router中需要根据这个状态返回结果。
2. 核心`update()`方法，当webpack构建成功时候执行这个回调方法，然后把构建生成的包返回出去
3. client compiler中添加HMR热更新插件
4. server compiler中把outputFileSystem修改为**memory-fs**，把构建的内容写入到内存里面

```typescript
// server/scripts/dev-server.ts
//
export default function setupDevServer(
  { server, templatePath, onUpdate }: DevOptions
): Promise<any> {
  // 1. 返回一个promise
  return new Promise(async (resolve, reject) => {
    // ...
    //
    // 2. 构建成功回调，resolve也在这一步完成 #53
    // HMR update callback
    const update = () => {
      if (serverBundle && clientManifest) {
        resolve();
        onUpdate({
          serverBundle,
          options: {
            template,
            clientManifest
          }
        });
      }
    };

    // ...
    // 3. 添加热更新插件，构建入口加上HMR的文件 #73
    clientConfig.entry.app = ['webpack-hot-middleware/client', ...clientConfig.entry.app];
    //
    // 设置webpack开发中间件 #77
    const clientCompiler = webpack(clientConfig);
    const middleware = await koaWebpack({
      compiler: clientCompiler,
      devMiddleware: {
        publicPath: clientConfig.output.publicPath,
        stats: 'none',
        logLevel: 'error',
        index: false
      }
    });

    // 添加热更新中间件 #120
    server.use(e2k(webpackHotMiddleware(clientCompiler, { heartbeat: 5000 })));

    // ...
    // 3. Server compiler outputFileSystem修改为memory-fs #125
    const serverCompiler = webpack(serverConfig);
    const serverMfs = new MFS();
    serverCompiler.outputFileSystem = serverMfs;
  }
}
```

## 🖊Conclusion
通过对SSR dev开发环境的搭建能对服务端渲染的功能更为了解，但是更多的优化如critical css的提取，组件缓存等功能还需要优化，另外SSR是服务器密集型的功能，更多的优化点还是要结合业务和实战去实践的。

希望这篇文章对你搭建SSR环境或者选型中有帮助。Thanks ❤️
