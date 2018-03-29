webpackJsonp([35048144772290],{290:function(e,a){e.exports={data:{markdownRemark:{html:'<p>这次做的是一个类似teambition的团队协作类项目，因为上级反映交互和视觉方面都没有达到要求，以前的代码也没有用模块化和用node做一些自动化的工作，旧代码是基本改不了的，所以就没看以前的代码，直接看着交互跟设计稿就开撸了。\n库选择基本没有什么选择了，angular版本不稳定，pass，react 和 vue之间为什么选后者呢，一方面受公司政治因素影响，另一方面vue文档有中文，template的写法对新手也比较友好，考虑到后期人员配置就选择vue了。\n重构了4个大模块，改版用时大概一个半月，测试时间一周左右，期间没有什么比较大卡进度的问题。下面通过对项目的构建，组织，测试等工作做下记录以及分析。</p>\n<h1>项目构建</h1>\n<p>项目创建是使用vue-cli创建的，模版则是使用我自己维护的<a href="https://github.com/kitwon/vue-mpa">vue-mpa</a>多页模板创建的单页应用🤩(出于对自己的支持，对模版bug的测试，以及切换为单页应用也方便)。除了官方基本的功能外，项目还加入了打包完成后自动删除并拷贝到后台项目文件夹，自动生成jsp模板等一些自动化功能。</p>\n<!-- more -->\n<h2>代码分割</h2>\n<p>SPA一个比较重要的点就是如何做代码分割了。代码分割涉及到几个方面：</p>\n<ol>\n<li><a href="https://router.vuejs.org/zh-cn/advanced/lazy-loading.html">路由分割</a>官方已经有很好的解决方案了。除文档基本说明外，还使用了<a href="https://doc.webpack-china.org/api/module-methods/#import-"><code class="language-text">webpackChunkName</code></a>对组件进行模块合并，减少文件请求。</li>\n<li>一些比较大的库例如<code class="language-text">momentjs</code>、<code class="language-text">lodash</code>代码提取。虽然<code class="language-text">webpack</code>里面提供了<code class="language-text">commonChunkPlugin</code>，但是这个插件只对入口文件进行分析和代码提取，而组件里面的一些库则使用了<a href="https://github.com/asfktz/autodll-webpack-plugin">autodll-webpack-plugin</a>，对一些依赖库进行提取和合并操作，并配合<code class="language-text">html-webpack-plugin</code>配合自动注入，生成页面模板。</li>\n</ol>\n<p>另外，引入了<a href="https://github.com/webpack-contrib/webpack-bundle-analyzer">BundleAnalyzerPlugin</a>，对module进行图形化的分析。进行各种优化后，<code class="language-text">vendor</code>和入口文件维持在600k左右，gzip后在130k左右，其他模块gzip后基本在<strong>20-50kb</strong>左右。</p>\n<h2>代码风格及限制</h2>\n<p>由于项目使用webpack和node构建，所以可以使用<code class="language-text">eslint</code>等工具去做提交前代码规范检查，另外还使用了<code class="language-text">editorconfig</code>和<a href="https://github.com/prettier/prettier"><code class="language-text">prettier</code></a>去编辑器的设置和统一代码格式化。另外提一下，<a href="https://github.com/prettier/prettier"><code class="language-text">prettier</code></a>可以通过配置项统一多种代码的格式化，因为在node端运行，所以可以做提交前的代码格式化。\n在各种工具配合下，基本可以做到代码风格的统一。</p>\n<p>此外，css方面没有使用csslint，但是普及了一下<a href="http://getbem.com/"><strong><code class="language-text">BEM</code></strong></a>，样式方面的统一情况也收到不错的成效。</p>\n<h1>开发阶段</h1>\n<p>vue在开发时候的好处就体现出来了，没写过项目的同事基本都能把页面写出来，但是对于一些参数传递、父子组件相互调用会需要一点时间去熟悉。但是在开发流程中基本没有出现什么断链的情况。</p>\n<h2>组件化</h2>\n<p>在公司期间接触过几个项目，项目结构都比较凌乱，并没有把组件化的优势发挥出来，很多页面都是重新写几遍。所以这项目开始做之前，就普及了一下react生态圈里面的几个组件概念。</p>\n<ol>\n<li><strong>container component(接入型组件)</strong>。负责主要业务逻辑，组装数据，提供业务方法。</li>\n<li><strong>exhibition component(展示型组件)</strong>。负责数据展示工作，大部分是业务组件，数据进，页面出这样，没有复杂功能。</li>\n<li><strong>interactive component(交互型组件)</strong>。复用性比较强的组件，如<code class="language-text">dialog</code>、<code class="language-text">toast</code>等组件。</li>\n<li><strong>functional component(功能型组件)</strong>。这种组件一般都是作为一种扩展，抽象机制存在，没有渲染动作，例如vue中的<code class="language-text">router-view</code>，<code class="language-text">transition</code>等。</li>\n</ol>\n<p>了解大概组成后，一般都会把组件拆分得比较细，基本组件代码维持在<strong>300行代码</strong>左右，这样做得好处就是，业务变动时候需要改动的地方就比较少，但是组件对每个模块的影响相对的就变大了，但是这个可以通过<strong>测试</strong>去解决的。</p>\n<h2>动态接口地址</h2>\n<p>项目中接口跟静态资源会动态改变，所以需要取后台返回的值去拼接，页面静态资源可以自己写一个模板然后去拼接，接口可以取页面的变量，但是打包到项目的时候，发现路由分割的代码资源地址不对，由于代码是动态分割的，所以地址应该是取<code class="language-text">config</code>里面的资源地址，所以导致加载失败。\n通过webpack文档跟stackoverflow里面相似案例，可以在动态引入js之前加入一个<a href="https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific-"><code class="language-text">__webpack_public_path__</code></a>配置项，动态获取异步模块的地址。具体代码如下：</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>env<span class="token punctuation">.</span>NODE_ENV <span class="token operator">===</span> <span class="token string">\'production\'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token comment">// variables就是动态的地址</span>\n  __webpack_public_path__ <span class="token operator">=</span> variables <span class="token operator">+</span> <span class="token string">\'/\'</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h2>测试</h2>\n<p>由于前期比较急，单元测试到了中后期才加上，直接导致了单元测试的覆盖率不够，正常情况下应该一写完代码就马上加上测试。测试这些前期费点时间，后期获益良多的工作，项目、团队越大就越能体现测试的重要性了。\n现在是使用<a href="https://facebook.github.io/jest/">Jest</a> + <a href="https://eddyerburgh.gitbooks.io/avoriaz/content/">Avariaz</a>的组合去做测试工作，后期会切换为<code class="language-text">Jest</code> + 官方提供的<a href="https://vue-test-utils.vuejs.org/zh-cn/">vue-test-utils</a>，两个<code class="language-text">API</code>相似，切换代价不大。</p>\n<h1>SSR</h1>\n<p>项目没有这部分的需求，就自己在有空时间折腾了一下，照着官方的SSR文档搭了出来，不过用<a href="http://koajs.com/"><code class="language-text">koa</code></a>代替了express（await、async写起来更爽一点）。直出的速度果然是不一样啊，不过也存在几个暂时还没空看的问题。</p>\n<ol>\n<li>按需直出页面设置，比如我需要A页面直出，B页面不直出，这操作还没找到怎么配置。</li>\n<li><code class="language-text">Route</code>函数式的跳转无效，比如按钮需要动态去定义跳转方式的，绑定了函数，但是SSR处理后点击无效。</li>\n<li>服务器性能测试。由于node是单线程的，没做过对应的项目，不知道流量大的时候怎么处理，有机会要了解下。</li>\n</ol>\n<h1>总结</h1>\n<p>项目进行过程除了上面动态绑定接口地址，开发过程还是比较顺利的，不过还有几个需要改进的地方</p>\n<ol>\n<li>虽然有做code review，但是大部分都是自己改进，可以多留点问题和提出多点意见给对<code class="language-text">vue</code>或者项目其他模块还不是很熟悉的同事去学习，共同进步。</li>\n<li>项目启动前对业务的了解不够清楚，导致后期才介入<code class="language-text">vuex</code>去改进一些模块，做了无用功。</li>\n<li>项目启动前和设计沟通不够，导致后期图标没有使用到<code class="language-text">iconfont</code>。不过后面也配合用按<code class="language-text">BE(Block-Modify)</code>的方式命名图标，写了个脚本去自动生成less文件。</li>\n</ol>',frontmatter:{date:"January 23, 2018",path:"/post/2017-review",title:"年底项目复盘"},headings:[{depth:1,value:"项目构建"},{depth:2,value:"代码分割"},{depth:2,value:"代码风格及限制"},{depth:1,value:"开发阶段"},{depth:2,value:"组件化"},{depth:2,value:"动态接口地址"},{depth:2,value:"测试"},{depth:1,value:"SSR"},{depth:1,value:"总结"}]}},pathContext:{prev:{title:"10个console的高级使用方法",date:"2018-03-19",category:["javascript"],tags:null,path:"/post/10tips-for-console"},next:{title:"构建60fps-web-app",date:"2017-09-13",category:["前端"],tags:["chrome","develop tool","javascript"],path:"/post/60fps-web-app"}}}}});
//# sourceMappingURL=path---post-2017-review-dce589ae981c0657b693.js.map