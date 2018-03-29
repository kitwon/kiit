webpackJsonp([0xa3e965bf06ee],{294:function(n,s){n.exports={data:{markdownRemark:{html:'<h1>什么是闭包</h1>\n<p>记得刚开始用js的时候就听过闭包这个概念，一开始觉得只是一个语言特性，没有太深入了解，网上查资料的解释一般是：函数有权访问另一个函数作用域中变量的函数，最容易生成闭包的方式一般是函数里面套函数。</p>\n<blockquote>\n<p>当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域外执行。\n--- 你不知道的javascript（上卷）</p>\n</blockquote>\n<p>然后看个例子</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n\n\tfuntion <span class="token function">bar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token function">bar</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>如果按上面第一条的定义，这里一定是生成了闭包，但是<strong>确切的说并不是</strong>，这里最准确的说是<code class="language-text">bar</code>对<code class="language-text">a</code>的引用方式是词法作用域的查找规则，而这些只是<strong>闭包</strong>的一部分。然后再看清晰闭包的例子</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript">fucntion <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n\n\t<span class="token keyword">function</span> <span class="token function">bar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">return</span> bar<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> baz <span class="token operator">=</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span>；\n\n<span class="token function">baz</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 这就是闭包效果</span>\n</code></pre>\n      </div>\n<!-- more -->\n<p>在这例子中，<code class="language-text">bar</code>也是在<code class="language-text">foo</code>的作用域内，但是不是直接执行，而是作为返回值返回。\n<code class="language-text">foo()</code>执行后，返回值<code class="language-text">bar</code>赋值给<code class="language-text">baz</code>并执行<code class="language-text">baz()</code>，在这里，<code class="language-text">bar()</code>显然可以正常执行，它在自己定义的词法作用域<strong>以外</strong>的地方。</p>\n<p>在<code class="language-text">foo()</code>执行之后，按js的垃圾回收机制，应该会对其进行回收，而闭包的神奇之处就是可以阻止这事情发生，因此<code class="language-text">baz()</code>在执行的时候依然可以访问<code class="language-text">a</code>。在此一看，原来平时写的大多数代码都是闭包啊。</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n\n\t<span class="token keyword">function</span> <span class="token function">bar</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token function">baz</span><span class="token punctuation">(</span>bar<span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">function</span> <span class="token function">baz</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\tfn <span class="token operator">&amp;&amp;</span> <span class="token function">fn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 这里也是闭包</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h1>闭包与变量</h1>\n<p>要说明闭包，for循环也是一个很好的例子</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">timer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">,</span> i <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>正常情况下，我们会预期的认为这段会每秒输出1～10，但实际，这段代码会<strong>每秒输出10次11</strong>。</p>\n<p>首先<strong>11</strong>是那里来的，这个循环应该是在<code class="language-text">i=11</code>的时候符合终止条件，所以代码输出的是循环结束时<strong>i</strong>的最终值。</p>\n<p>细想一下，答案其实显而易见，<strong>setTimeout</strong>会推到栈底部执行，所以会在循环结束后才开始执行，所以每次都是输出<strong>11</strong>。但是什么问题造成这样的结果呢。</p>\n<p>虽然<strong>setTimeout</strong>都是在每个迭代时候分别定义的，但是根据作用域原理，其实几个函数都是都是<strong>保存在一个封闭的作用域中</strong>，因此它们引用都是同一个<strong>来自全局的i</strong>。</p>\n<p>所以解决方法也很简单，我们需要每次循环都新建一个作用域，然后把迭代的值传入作用域中，所以我们可以用<strong>IIFE</strong>（上一篇作用域有介绍，IIFE是一个匿名函数，每次调用都会创建作用域）来解决</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">timer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>j<span class="token punctuation">)</span>\n\t\t<span class="token punctuation">}</span><span class="token punctuation">,</span> j <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 换成ES6中的let也可以</span>\n<span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">timer</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>\n\t<span class="token punctuation">}</span><span class="token punctuation">,</span> i <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<h1>模块</h1>\n<p>闭包除了平时实现的回调功能外，还可以实现另外一个强大的功能，<strong>模块</strong>。\n旧的模块实现方式，如jQuery就可以使用闭包实现</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> $ <span class="token operator">=</span> jQuery <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">Module</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>\n\n\t<span class="token keyword">function</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">function</span> <span class="token function">identify1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">function</span> <span class="token function">identify2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\tconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>id<span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">function</span> <span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">public</span><span class="token punctuation">.</span>identify <span class="token operator">=</span> identify2<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">var</span> <span class="token keyword">public</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n\t\tdoSomething<span class="token punctuation">:</span> doSomething<span class="token punctuation">,</span>\n\t\tidentify<span class="token punctuation">:</span> identify1<span class="token punctuation">,</span>\n\t\tchange<span class="token punctuation">:</span> change\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">return</span> <span class="token keyword">public</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token string">\'hello\'</span><span class="token punctuation">)</span>\n\n$<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// 2</span>\n$<span class="token punctuation">.</span><span class="token function">identify</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// hello</span>\n$<span class="token punctuation">.</span><span class="token function">change</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n$<span class="token punctuation">.</span><span class="token function">identify</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// HELLO</span>\n</code></pre>\n      </div>\n<p>如果不用单例的话不用<strong>IIFE</strong>即可，通过在模块内保留对公共API的引用，可以从<strong>内部</strong>对模块实例进行修改，包括添加，删除，修改属性或者方法。</p>\n<h2>现代的模块机制</h2>\n<p>现在大部分的模块加载器本质上都是将这种模块定义封装进API中，如下代码</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> Module <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">Manager</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">var</span> modules <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n\t<span class="token keyword">function</span> <span class="token function">define</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> deps<span class="token punctuation">,</span> impl<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> deps<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t\t<span class="token comment">// 在modules中寻找名字为deps[i]的模块</span>\n\t\t\tdeps<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> modules<span class="token punctuation">[</span>deps<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n\t\t<span class="token punctuation">}</span>\n\t\t<span class="token comment">// 将依赖的模块作为arguments传入module中</span>\n\t\tmodules<span class="token punctuation">[</span>name<span class="token punctuation">]</span> <span class="token operator">=</span> impl<span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span>impl<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">function</span> <span class="token function">require</span><span class="token punctuation">(</span>name<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> modules<span class="token punctuation">[</span>name<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">return</span> <span class="token punctuation">{</span>\n\t\tdefine<span class="token punctuation">:</span> define<span class="token punctuation">,</span>\n\t\trequire<span class="token punctuation">:</span> require\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>这段代码核心在<code class="language-text">module[name] = impl.apply(impl, deps)</code>中，模块都按名字保存在<code class="language-text">modules</code>变量中，每次都能根据获取相关模块。下面看看使用方式。</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript">Module<span class="token punctuation">.</span><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'foo\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">function</span> <span class="token function">hello</span><span class="token punctuation">(</span>who<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> <span class="token string">\'Hello \'</span> <span class="token operator">+</span> who<span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">return</span> <span class="token punctuation">{</span>\n\t\thello<span class="token punctuation">:</span> hello\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nModule<span class="token punctuation">.</span><span class="token function">define</span><span class="token punctuation">(</span><span class="token string">\'bar\'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string">\'foo\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t<span class="token keyword">function</span> <span class="token function">awsome</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n\t\t<span class="token keyword">return</span> foo<span class="token punctuation">.</span><span class="token function">hello</span><span class="token punctuation">(</span><span class="token string">\'kit\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\t<span class="token punctuation">}</span>\n\n\t<span class="token keyword">return</span> <span class="token punctuation">{</span>\n\t\tawsome<span class="token punctuation">:</span> awsome\n\t<span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token keyword">var</span> foo <span class="token operator">=</span> Module<span class="token punctuation">.</span><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'foo\'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n\tbar <span class="token operator">=</span> Module<span class="token punctuation">.</span><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'bar\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\nfoo<span class="token punctuation">.</span><span class="token function">hello</span><span class="token punctuation">(</span><span class="token string">\'kit\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Hello kit</span>\nbar<span class="token punctuation">.</span><span class="token function">awsome</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token comment">// HELLO KIT</span>\n</code></pre>\n      </div>\n<h1>总结</h1>\n<p>从上面可以知道，平时写的js大部分代码都使用了闭包，通过了解闭包和作用域的运行方式，能够减少平时使用的出现的错误。也能通过闭包，使用js实现模块化等其他更多的功能。</p>',frontmatter:{date:"June 14, 2017",path:"/post/js-closures",title:"深入学习javascript-闭包"},headings:[{depth:1,value:"什么是闭包"},{depth:1,value:"闭包与变量"},{depth:1,value:"模块"},{depth:2,value:"现代的模块机制"},{depth:1,value:"总结"}]}},pathContext:{prev:{title:"webpack2新特性&迁移",date:"2017-06-24",category:["前端工具"],tags:["webpack"],path:"/post/webpack2"},next:{title:"用python写一个简单爬虫",date:"2017-06-11",category:null,tags:null,path:"/post/python-crawler"}}}}});
//# sourceMappingURL=path---post-js-closures-12b38941e1a725ea4270.js.map