webpackJsonp([0x7f52d78cffc5],{293:function(n,s){n.exports={data:{markdownRemark:{html:'<h1>类理论</h1>\n<p>类／继承描述了一种代码的组织结构形式，这个理论在软件设计中一直作为一个主导的角色。通过学习类理论，能为更好地学习js中的设计模式和对js中原型链的理解打下基础。</p>\n<p>类是在软件中对真实世界问题领域的建模方法。如一个经常看见的交通例子。<strong>汽车</strong>可以被看作<strong>交通工具中的一种</strong>，所以在软件开发时可以定义一个<code class="language-text">Vehicle</code>类，<code class="language-text">Vehicle</code>中包含推进器（引擎）、载人能力等方法。定义<code class="language-text">Car</code>时，只要声明它继承或者拓展<code class="language-text">Vehicle</code>这个基础定义就行了，其他交通工具如船、飞机也可以继承<code class="language-text">Vehicle</code>。<strong>这就是类的实例化与继承</strong>。</p>\n<p>类的另外一个核心概念是<strong>多态</strong>，这个概念是说夫类的通用行为可以被子类更特殊的行为重写。</p>\n<p>javascript中也有类中的<code class="language-text">new</code>和<code class="language-text">instanceof</code>，还有ES6中的<code class="language-text">class</code>关键字，但这些并不是说明js中有<strong>类</strong>的。javascript中只是为了满足类的设计需求而提供一些类似的语法。</p>\n<h2>js中实现类复制(混入)</h2>\n<p>javascript中的对象机制并不会自动执行复制行为，简单来说javascript中只有对象，并不存在可以实例的类。一个对象并不会复制一个对象，只会把它关联起来(prototype)。</p>\n<!-- more -->\n<h3>显式混入</h3>\n<p>显示混入在其他库或者框架中一般被称为<code class="language-text">extend</code>，在这方便理解会使用<code class="language-text">mixin</code>。</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token comment">// 前面的Vehicle和car的例子</span>\n<span class="token keyword">function</span> <span class="token function">mixin</span><span class="token punctuation">(</span>sourceObj<span class="token punctuation">,</span> targetObj<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token keyword">in</span> sourceObj<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>i <span class="token keyword">in</span> targetObj<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      targetObj<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> sourceObj<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> targetObj<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> Vehicle <span class="token operator">=</span> <span class="token punctuation">{</span>\n  engines<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span>\n  ignition<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Turning on my engines.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  drive<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">ignition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Steering and moving forward.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> Car <span class="token operator">=</span> <span class="token function">mixin</span><span class="token punctuation">(</span>Vehicle<span class="token punctuation">,</span> <span class="token punctuation">{</span>\n  wheels<span class="token punctuation">:</span> <span class="token number">4</span><span class="token punctuation">,</span>\n  drive<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    Vehicle<span class="token punctuation">.</span>drive<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Rolling on all\'</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>wheels <span class="token operator">+</span> <span class="token string">\'wheels!\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>还有一种显示混入的变体叫<strong>寄生继承</strong></p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">function</span> <span class="token function">Vehicle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span>engines <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\nVehicle<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">ignition</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Turning on my engines.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\nVehicle<span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">drive</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">ignition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Steering and moving forward.\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token comment">// 寄生类 car</span>\n<span class="token keyword">function</span> <span class="token function">Car</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">var</span> car  <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vehicle</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  car<span class="token punctuation">.</span>wheels <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span>\n  <span class="token keyword">var</span> vehDrive <span class="token operator">=</span> car<span class="token punctuation">.</span>drive<span class="token punctuation">;</span>\n\n  car<span class="token punctuation">.</span><span class="token function-variable function">drive</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    Vehicle<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">\'Rolling on all\'</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>wheels <span class="token operator">+</span> <span class="token string">\'wheels!\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n\n  <span class="token keyword">return</span> car<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">var</span> myCar <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Car</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nmyCar<span class="token punctuation">.</span><span class="token function">drive</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<h3>隐式混入</h3>\n<p>隐式混入就是改变在一个函数体内执行另外另一个函数的方法。</p>\n<div class="gatsby-highlight">\n      <pre class="language-javascript"><code class="language-javascript"><span class="token keyword">var</span> foo <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cool<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>count <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>count <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token operator">++</span> <span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">;</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nfoo<span class="token punctuation">.</span><span class="token function">cool</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1</span>\n\n<span class="token keyword">var</span> bar <span class="token operator">=</span> <span class="token punctuation">{</span>\n  cool<span class="token punctuation">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    foo<span class="token punctuation">.</span>cool<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\nbar<span class="token punctuation">.</span><span class="token function">cool</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1, 数据不共享</span>\n</code></pre>\n      </div>\n<h1>prototype-原型</h1>\n<p>JS中，当试图引用对象属性时候就会触发<code class="language-text">[[GET]]</code>操作，如果在对象属性中没有找到，就会使用对象的<code class="language-text">[[prototype]]</code>链。JS大部分复杂类型都是<code class="language-text">object</code>，所以<code class="language-text">[[prototype]]</code>“尽头”应该是<code class="language-text">Object.prototype</code>，里面包含了许多原生方法，如<code class="language-text">toString</code>或<code class="language-text">valueOf</code>。</p>\n<h2>如何工作</h2>\n<p>JS和其他OO语言并不同，JS中并没有类作为对象的抽象模式，JS中只有对象，所以当new一个对象时候，并不是复制一个类函数，而是将目标对象的<code class="language-text">prototype</code>关联到新对象的<code class="language-text">prototype</code>中。</p>\n<h1>小结</h1>\n<p><code class="language-text">prototype</code>部分书本总结得比较清楚，想知道更多细节的同学可以参考<strong>you dont know javascript</strong>的5.1-5.4章节。</p>\n<ul>\n<li>访问对象时候都会触发对象的[[GET]]操作，如果没有找到属性的话会继续找[[Prototype]]链。</li>\n<li>普通对象的原型链顶端都是<code class="language-text">Object.prototype</code></li>\n<li><code class="language-text">new</code>调用函数时只会关系到对象，而不会复制</li>\n</ul>',frontmatter:{date:"July 20, 2017",path:"/post/js-class",title:"深入学习javascript-类"},headings:[{depth:1,value:"类理论"},{depth:2,value:"js中实现类复制(混入)"},{depth:3,value:"显式混入"},{depth:3,value:"隐式混入"},{depth:1,value:"prototype-原型"},{depth:2,value:"如何工作"},{depth:1,value:"小结"}]}},pathContext:{prev:{title:"在vue项目中使用jest进行单元测试",date:"2017-08-18",category:["前端工具"],tags:["unit test","vue","javascript"],path:"/post/vue-jest-test"},next:{title:"深入学习javascript - this",date:"2017-06-27",category:null,tags:null,path:"/post/js-this"}}}}});
//# sourceMappingURL=path---post-js-class-e123a31b56605816f3a2.js.map