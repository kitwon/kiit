webpackJsonp([0xd6ae3e0fd487],{304:function(n,a){n.exports={data:{markdownRemark:{html:'<p>webpack2已经发布了好一段时间了。但是因为之前工作的关系没有好好研究一下，后面工作应该会用得上，而且趁着这段时间有空，还有在熟悉vim，就顺便拿这来练练手了。</p>\n<h1>从webpack1中迁移</h1>\n<p>官方已经给出了详细的<a href="https://webpack.js.org/guides/migrating/">迁移指南</a>，改动并不是很大，但是优化却蛮多的，如编译速度，代码优化等。如果你的项目正在用webpack，那么这个新版本还是挺值得迁移的。</p>\n<h2>配置文件</h2>\n<p>如果升级webpack之后直接运行命令的话应该会看到一片红的，可以看出配置项有改动，下面整理一下经常使用地方的改动。</p>\n<h3><code class="language-text">module.loaders</code>变成<code class="language-text">module.rules</code></h3>\n<p>旧的<code class="language-text">module.loader</code>被<code class="language-text">module.rules</code>取代，后者允许配置<code class="language-text">loader</code>更多选项，具体查看文档<a href="https://webpack.js.org/configuration/module/#module-rules">module.rules</a></p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// ...</span>\nmdoule<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    rules<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        <span class="token punctuation">{</span>\n            test<span class="token punctuation">:</span> <span class="token regex">/\\.css$/</span><span class="token punctuation">,</span>\n            use<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n                <span class="token punctuation">{</span> loader<span class="token punctuation">:</span> <span class="token string">\'style-loader\'</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>\n                <span class="token punctuation">{</span>\n                    loader<span class="token punctuation">:</span> <span class="token string">\'css-loader\'</span><span class="token punctuation">,</span>\n                    options<span class="token punctuation">:</span> <span class="token punctuation">{</span> module<span class="token punctuation">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>\n                <span class="token punctuation">}</span>\n            <span class="token punctuation">]</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        <span class="token punctuation">{</span>\n            test<span class="token punctuation">:</span> <span class="token regex">/\\.jsx$/</span><span class="token punctuation">,</span>\n            loader<span class="token punctuation">:</span> <span class="token string">\'babel-loader\'</span><span class="token punctuation">,</span>\n            options<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n                <span class="token comment">// ...</span>\n            <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// ...</span>\n</code></pre>\n      </div>\n<!-- more -->\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// ...</span>\nmodule<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    rules<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        test<span class="token punctuation">:</span> <span class="token regex">/\\.less$/</span><span class="token punctuation">,</span>\n        use<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">\'style-loader\'</span><span class="token punctuation">,</span> <span class="token string">\'css-loader\'</span><span class="token punctuation">,</span> <span class="token string">\'less-loader\'</span><span class="token punctuation">]</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n<span class="token comment">// ...</span>\n</code></pre>\n      </div>\n<p>除上面两项外还有</p>\n<ul>\n<li>现在指定loader的时候不能再省略<code class="language-text">-loader</code>后缀。具体原因参阅<a href="https://github.com/webpack/webpack/issues/2986">#2968</a></li>\n<li><code class="language-text">json-loader</code>不需再手动添加。</li>\n<li>loader默认的resolve配置是相对于<code class="language-text">context</code>配置项的。</li>\n<li>取消了<code class="language-text">module.preLoaders</code>以及<code class="language-text">module.postLoaders</code>。</li>\n</ul>\n<h3><code class="language-text">UglifyPlugin</code>改动</h3>\n<ul>\n<li><code class="language-text">UglifyPlugin</code>的<code class="language-text">sourceMap</code>现在的默认值的<code class="language-text">false</code>而不是<code class="language-text">true</code>。</li>\n<li><code class="language-text">UglifyJsPlugin</code>的<code class="language-text">compress.warnings</code>配置项现在默认为<code class="language-text">false</code>而不是<code class="language-text">true</code>。</li>\n</ul>\n<h3><code class="language-text">ExtractTextWebpackPlugin</code></h3>\n<p>插件变化主要体现在语法上，又原来的单个参数传变成了对象，现在的配置方式如下</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// ExtractTextPlugin.extract</span>\nmodule<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    rules<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n        test<span class="token punctuation">:</span> <span class="token regex">/\\.css$/</span><span class="token punctuation">,</span>\n        loader<span class="token punctuation">:</span> ExtractTextPlugin<span class="token punctuation">.</span><span class="token function">extract</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n            fallbackLoader<span class="token punctuation">:</span> <span class="token string">\'style-loader\'</span><span class="token punctuation">,</span>\n            loader<span class="token punctuation">:</span> <span class="token string">\'css-loader\'</span><span class="token punctuation">,</span>\n            publicPath<span class="token punctuation">:</span> <span class="token string">\'/dist\'</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">]</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// new ExtractTextPlugin({options})</span>\nplugins<span class="token punctuation">:</span> <span class="token punctuation">[</span>\n    <span class="token keyword">new</span> <span class="token class-name">ExtractTextPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n        filename<span class="token punctuation">:</span> <span class="token string">\'bundle.css\'</span><span class="token punctuation">,</span>\n        disabled<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>\n        allChunks<span class="token punctuation">:</span> <span class="token boolean">true</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">]</span>\n</code></pre>\n      </div>\n<h3>CLI中配置使用自定义参数</h3>\n<p>在webpack1中可以用<code class="language-text">process.argv</code>获取自定义参数，但是在webpack2中这行为被禁止了，替代地提供了一个接口<code class="language-text">env</code>去获取自定义参数</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript">module<span class="token punctuation">.</span><span class="token function-variable function">export</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span>env<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">var</span> customStuff <span class="token operator">=</span> env<span class="token punctuation">.</span>customStuff<span class="token punctuation">;</span>\n\n    <span class="token comment">// ...</span>\n    <span class="token keyword">return</span> config<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h2>主要变更</h2>\n<h3>ES6模块</h3>\n<p>webpack2现在增加对ES6的模块化的原生支持，意味着现在能够直接识别<code class="language-text">import</code>和<code class="language-text">export</code>了，不需要先转成CommonJS模块的格式。\n支持原生<code class="language-text">import</code>带来的影响就是支持异步加载模块，webpack1使用异步模块的时候如下</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript">require<span class="token punctuation">.</span><span class="token function">ensure</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">\'a\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    a<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">\'chunkName\'</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>webpack2的<code class="language-text">import</code>会返回一个<code class="language-text">promise</code>对象</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">\'a\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    a<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>而且现在<strong>chunk加载失败能被Promise捕捉到</strong>，那就意味着我们能够在组件加载失败的时候采取相应的操作。</p>\n<p>另外现在<code class="language-text">import</code>还支持动态表达式。</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">route</span><span class="token punctuation">(</span>path<span class="token punctuation">,</span> query<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">\'/routes/${path}/route\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>route <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">route<span class="token punctuation">.</span>Route</span><span class="token punctuation">(</span>query<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h1>总结</h1>\n<p>用着<em>vim-mode</em>，写完这篇已经完全头皮发麻了，完全熟悉估计不知道还要多久呢。回正题，·从官方文档来看，改动的地方的确不多，迁移成本应该是比较低的，至于要不要迁移我觉得还是见仁见智吧，如果新版的优点好处大于迁移的成本的话各位应该可以放心去改动你的配置文件了。总的来说webpack2有以下几个优点</p>\n<ul>\n<li>编译速度提高</li>\n<li>编译文件大小相对减少了</li>\n<li>支持promise</li>\n<li>能捕捉到chunk加载失败</li>\n</ul>\n<h2>参考</h2>\n<ul>\n<li><a href="https://webpack.js.org/guides/migrating/">Migrating from v1 to v2</a></li>\n<li><a href="http://www.tuicool.com/articles/aieAnan">升级到 webpack2</a></li>\n<li><a href="http://imweb.io/topic/58666d57b3ce6d8e3f9f99b0">webpack2 的 tree-shaking 好用吗？</a></li>\n</ul>',frontmatter:{date:"June 24, 2017",path:"/post/webpack2",title:"webpack2新特性&迁移"},headings:[{depth:1,value:"从webpack1中迁移"},{depth:2,value:"配置文件"},{depth:3,value:"变成"},{depth:3,value:"改动"},{depth:3,value:null},{depth:3,value:"CLI中配置使用自定义参数"},{depth:2,value:"主要变更"},{depth:3,value:"ES6模块"},{depth:1,value:"总结"},{depth:2,value:"参考"}]}},pathContext:{prev:{title:"深入学习javascript - this",date:"2017-06-27",category:null,tags:null,path:"/post/js-this"},next:{title:"深入学习javascript-闭包",date:"2017-06-14",category:null,tags:null,path:"/post/js-closures"}}}}});
//# sourceMappingURL=path---post-webpack-2-dbf429feab03698dc11b.js.map