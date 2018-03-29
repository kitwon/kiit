webpackJsonp([25147250691872],{303:function(n,a){n.exports={data:{markdownRemark:{html:'<h1>什么是单元-测试?</h1>\n<ul>\n<li>单元就是相对独立的功能模块，例如一个函数或者一个类。一个完整的模块化的程序，都应该是有许多个单元构成，单元能完成自己的任务，然后与其他单元进行交互 ，从而完成整个程序的功能。</li>\n<li>而测试，就是测试啦。</li>\n</ul>\n<p>所以单元测试通俗点讲就是对程序每个独立的单元分别测试，保证构成程序的每个模块的正确性，从而保证整个程序的正确运行。</p>\n<h1>为什么要写单元测试？</h1>\n<p>单元测试在前端还是不太普及的，因为刚开始前端也是偏向‘UI’那一块的，但随着node的发展，越来越多非‘UI’的前端代码，一个团队也越来越多人参加开发，如果系统一复杂，又或者你的模块提交到npm上面的话，一出错基本就GG了。\n又或者你这样想，测试是逃不掉的，要么在dev上测试，要么在prod上测试，怎么都得测试，而且每次提交都要测试，为什么不写自动测试呢。我也相信大多数程序员也有写完跑跑看的习惯，而单元测试的log都直接打印到console里面，也省去了很多编译，打包的时间，又能满足各位的心理需求（猥琐脸），一举两得啊。</p>\n<!-- more -->\n<h1>干了这杯 "Mocha"</h1>\n<p>mocha是一个js测试框架，除此外，类似的测试框架还有Jasmine、Karma、Tape等，至于为什么要介绍Mocha？因为我只懂这一个。\n上代码前还要普及一下两个概念</p>\n<ul>\n<li><a href="https://zh.wikipedia.org/wiki/%E8%A1%8C%E4%B8%BA%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91">BDD（Behavior Driven Development）</a>\nBDD意为行为驱动开发，是一种敏捷软件开发技术，具体内容大家可以参考wikipedia的解释。</li>\n<li><a href="https://zh.wikipedia.org/wiki/%E6%96%B7%E8%A8%80_(%E7%A8%8B%E5%BC%8F)">Assertion 断言</a>\n断言，就是判断代码的执行结果与预期是否一致，不一致就抛出错误，说得简单点就是判断程序的真假。</li>\n</ul>\n<h2>举个例子</h2>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// add.js</span>\n<span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> a <span class="token operator">+</span> b\n<span class="token punctuation">}</span>\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> add\n</code></pre>\n      </div>\n<p>通常测试脚本要与测试源码同名，比如add.js的测试脚本就是add.test.js</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// add.test.js</span>\n<span class="token keyword">const</span> add <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'./add.js\'</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> expect <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'chai\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span>expect\n\n<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">\'加法函数测试\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">\'1 + 1 等于 2\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">expect</span><span class="token punctuation">(</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span>be<span class="token punctuation">.</span><span class="token function">equal</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">\'返回值是Number\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token function">expect</span><span class="token punctuation">(</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>to<span class="token punctuation">.</span>be<span class="token punctuation">.</span><span class="token function">a</span><span class="token punctuation">(</span><span class="token string">\'number\'</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>上面代码块就是测试脚本，可独立运行，测试脚本中应该包括一个或多个<code class="language-text">describe</code>块，每个<code class="language-text">describe</code>块应包括多个<code class="language-text">it</code>块。\n<code class="language-text">describe</code>是测试套件，这个方法需要传两个参数，第一个为测试套件的名称<code class="language-text">(&#39;加法函数测试&#39;)</code>，第二个是执行函数。\n<code class="language-text">it</code>块是测试用例，表示一个单独的测试，是测试的最小单位，第一个参数是测试用例的名称(\'1 + 1 等于 2\')，第二个是执行函数。</p>\n<p>然后在terminal下执行<code class="language-text">mocha add.test.js</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-terminal"><code class="language-terminal">$ mocha add.test.js\n\n   加法函数测试\n     √ 1 + 1 等于 2\n     √ 返回值是Number\n   2 passing (12ms)</code></pre>\n      </div>\n<p>如果我们改变一下<code class="language-text">add.js</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// add.js</span>\n<span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> a <span class="token operator">*</span> b\n<span class="token punctuation">}</span>\nmodule<span class="token punctuation">.</span>exports <span class="token operator">=</span> add\n</code></pre>\n      </div>\n<p>然后再执行一下<code class="language-text">mocha add.test.js</code></p>\n<div class="gatsby-highlight">\n      <pre class="language-terminal"><code class="language-terminal">$ mocha add.test.js\n\n   加法函数测试\n     √ 1 + 1 等于 2\n     1) 返回值是Number\n   1 passing (8ms)\n   1 failing\n\n   1) 加法函数测试 返回值是Number:\n       AssertionError: expected 2 to equal 3\n       + expected - actual\n\n       -2\n       +3\n\n       at Context.it(add.test.js:6:27)</code></pre>\n      </div>\n<p>这里也可以很明显看出哪个测试用例报错、还有报错的位置，这样在开发的时候开发人员就能很容易定位错误。</p>\n<h1>小结</h1>\n<p>从上面一个简单的例子可以看出，利用mocha实现自动化测试是很简单的。虽然前期开发需要花一点时间去写单元测试，但是后面提供的便利性足以将其弥补。</p>',frontmatter:{date:"May 16, 2017",path:"/post/unit-test",title:"前端单元测试&Mocha指北"},headings:[{depth:1,value:"什么是单元-测试?"},{depth:1,value:"为什么要写单元测试？"},{depth:1,value:'干了这杯 "Mocha"'},{depth:2,value:"举个例子"},{depth:1,value:"小结"}]}},pathContext:{prev:{title:"Promise的简单实现",date:"2017-05-17",category:["前端"],tags:["javascript"],path:"/post/js-promise"},next:{title:"使用nodejs写一个命令行程序",date:"2017-05-16",category:["前端"],tags:["nodejs","bash"],path:"/post/node-command-app"}}}}});
//# sourceMappingURL=path---post-unit-test-c64f905caa6c98c41291.js.map