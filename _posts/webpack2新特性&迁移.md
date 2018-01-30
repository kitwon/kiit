---
path: post/webpack2
title: webpack2新特性&迁移
date: 2017-06-24 11:38:53
category:
- 前端工具
tags:
- webpack
---

webpack2已经发布了好一段时间了。但是因为之前工作的关系没有好好研究一下，后面工作应该会用得上，而且趁着这段时间有空，还有在熟悉vim，就顺便拿这来练练手了。

# 从webpack1中迁移
官方已经给出了详细的[迁移指南](https://webpack.js.org/guides/migrating/)，改动并不是很大，但是优化却蛮多的，如编译速度，代码优化等。如果你的项目正在用webpack，那么这个新版本还是挺值得迁移的。

## 配置文件
如果升级webpack之后直接运行命令的话应该会看到一片红的，可以看出配置项有改动，下面整理一下经常使用地方的改动。

### `module.loaders`变成`module.rules`
旧的`module.loader`被`module.rules`取代，后者允许配置`loader`更多选项，具体查看文档[module.rules](https://webpack.js.org/configuration/module/#module-rules)

```javascript
// ...
mdoule: {
    rules: [
        {
            test: /\.css$/,
            use: [
                { loader: 'style-loader' },
                {
                    loader: 'css-loader',
                    options: { module: true }
                }
            ]
        },
        {
            test: /\.jsx$/,
            loader: 'babel-loader',
            options: {
                // ...
            }
        }
    ]
}
// ...
```

<!-- more -->

```javascript
// ...
module: {
    rules: {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
    }
}
// ...
```

除上面两项外还有
* 现在指定loader的时候不能再省略`-loader`后缀。具体原因参阅[#2968](https://github.com/webpack/webpack/issues/2986)
* `json-loader`不需再手动添加。
* loader默认的resolve配置是相对于`context`配置项的。
* 取消了`module.preLoaders`以及`module.postLoaders`。

### `UglifyPlugin`改动
* `UglifyPlugin`的`sourceMap`现在的默认值的`false`而不是`true`。
* `UglifyJsPlugin`的`compress.warnings`配置项现在默认为`false`而不是`true`。

### `ExtractTextWebpackPlugin`
插件变化主要体现在语法上，又原来的单个参数传变成了对象，现在的配置方式如下
```javascript
// ExtractTextPlugin.extract
module: {
    rules: [
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader',
            publicPath: '/dist'
        })
    ]
}

// new ExtractTextPlugin({options})
plugins: [
    new ExtractTextPlugin({
        filename: 'bundle.css',
        disabled: true,
        allChunks: true
    })
]
```

### CLI中配置使用自定义参数
在webpack1中可以用`process.argv`获取自定义参数，但是在webpack2中这行为被禁止了，替代地提供了一个接口`env`去获取自定义参数
```javascript
module.export = function(env) {
    var customStuff = env.customStuff;

    // ...
    return config;
};
```

## 主要变更

### ES6模块
webpack2现在增加对ES6的模块化的原生支持，意味着现在能够直接识别`import`和`export`了，不需要先转成CommonJS模块的格式。
支持原生`import`带来的影响就是支持异步加载模块，webpack1使用异步模块的时候如下
```javascript
require.ensure(['a'], function(a) {
    a.doSomething()
}, 'chunkName')
```

webpack2的`import`会返回一个`promise`对象
```javascript
import('a').then(function(a) {
    a.doSomething()
})
```

而且现在**chunk加载失败能被Promise捕捉到**，那就意味着我们能够在组件加载失败的时候采取相应的操作。

另外现在`import`还支持动态表达式。

```javascript
function route(path, query) {
    return import('/routes/${path}/route').then(route => new route.Route(query);
    })
}
```

# 总结
用着*vim-mode*，写完这篇已经完全头皮发麻了，完全熟悉估计不知道还要多久呢。回正题，·从官方文档来看，改动的地方的确不多，迁移成本应该是比较低的，至于要不要迁移我觉得还是见仁见智吧，如果新版的优点好处大于迁移的成本的话各位应该可以放心去改动你的配置文件了。总的来说webpack2有以下几个优点
* 编译速度提高
* 编译文件大小相对减少了
* 支持promise
* 能捕捉到chunk加载失败

## 参考
* [Migrating from v1 to v2](https://webpack.js.org/guides/migrating/)
* [升级到 webpack2](http://www.tuicool.com/articles/aieAnan)
* [webpack2 的 tree-shaking 好用吗？](http://imweb.io/topic/58666d57b3ce6d8e3f9f99b0)
