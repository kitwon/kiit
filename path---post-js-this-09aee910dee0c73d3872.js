webpackJsonp([71868548653867],{295:function(n,o){n.exports={data:{markdownRemark:{html:'<h1>关于this</h1>\n<p><code>this</code>应该是javascript中一个比较复杂的机制了，在日常工作中我们可能有意无意都会使用到这个机制，但是<code>this</code>的工作机制真正了解的可能只有皮毛，通过学习这一机制，能够提高对js代码的理解和阅读能力，还有对js程序设计模式有着更深的理解。</p>\n<h1>this的指向</h1>\n<p>this是运行时进行绑定的，而不是编写时绑定的，它的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。</p>\n<p>通过分析调用位置，就能知道this到底引用的是什么。所以，寻找调用位置就能弄清上面的问题，通过一个例子，就能很好地理解这个问题：</p>\n<pre><code class="language-javascript">function baz() {\n  // 当前调用栈是 baz\n  // 当前调用位置是全局作用域\n\n  console.log(\'baz\');\n  bar(); // bar的调用位置\n}\n\nfunction bar() {\n  // 当前的调用栈是 baz -> bar\n  // 当前的调用位置是baz\n\n  console.log(\'bar\');\n  foo();\n}\n\nfunction foo() {\n  // 当前的调用栈是 baz -> bar -> foo\n  // 当前的调用位置是bar\n\n  console.log(\'foo\');\n}\n\nbaz();\n</code></pre>\n<!-- more -->\n<h1>绑定规则</h1>\n<p>除了像上面分析代码，还有一个最简单的方式就是分析调用工具。找到调用位置后，就能根据下面的4条规则来判断this如何绑定。</p>\n<h2>默认绑定</h2>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nvar a = 2;\n\nfoo(); // 2\n</code></pre>\n<p>从上面代码可以知道，<code>foo</code>的调用位置在全局中，不带任何修饰地调用，因此只能使用<strong>默认绑定</strong>。</p>\n<p>在这里要注意一个细节，如果使用严格模式(strict mode)，那么全局对象将无法使用默认绑定。</p>\n<h2>隐式绑定</h2>\n<pre><code class="language-javascript">function  foo() {\n  console.log(this.a);\n}\n\nvar obj = {\n  a: 2,\n  foo: foo\n}\n\nobj.foo(); // 2\n</code></pre>\n<p>从上代码可以看出<code>obj</code>，调用位置会使用<code>obj</code>上下文来引用函数，因此，可以说函数被调用时候<code>obj</code>对象“包含”它。当函数引用有上下文对象时，<strong>隐式绑定</strong> 规则会把函数引用调用中的<code>this</code>绑定到这个对象中。所以<code>this.a</code>与<code>obj.a</code>在此时是一样的。</p>\n<p>对象属性应用链中只有最顶层或者说最后一层会影响调用位置。如下:</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nvar obj2 = {\n  a: 42,\n  foo: foo\n}\n\nvar obj1 = {\n  a: 2,\n  obj2: obj2\n}\n\nobj1.obj2.foo(); // 42\n</code></pre>\n<h3>隐式丢失</h3>\n<p><strong>隐式丢失</strong> 就是隐式绑定的函数丢失绑定对象，然后应用<strong>默认绑定</strong>，从而把<code>this</code>绑定到全局对象或者<code>undefined</code>中，取决于是否严格模式。</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nvar obj = {\n  a: 2,\n  foo: foo\n}\n\nvar bar = obj.foo; // 函数别名\n\nvar a = \'oops, global\';\n\nbar(); // opps, global\n</code></pre>\n<p>或者在传入回调函数的时候：</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nfunction doFoo(fn) {\n  fn();\n}\n\nvar obj = {\n  a: 2,\n  foo: foo\n}\n\nvar a = \'oops, global\';\n\ndoFoo(obj.foo); // opps, global\n</code></pre>\n<p>传入函数就是一种隐式赋值，所以结果和上一个例子也是一样的。</p>\n<h2>显式绑定</h2>\n<p>使用<code>call</code>和<code>apply</code>方法对对象进行强制调用函数。</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nvar obj = {\n  a: 2\n}\n\nfoo.call(obj); // 2\n</code></pre>\n<p><code>call</code>和<code>apply</code>在绑定的机制基本是一样的，就是传参不一样，<code>call</code>为单独的参数，<code>apply</code>为数组。</p>\n<h2>硬绑定</h2>\n<p>硬绑定为显式绑定的一个变种，能够解决丢失绑定的问题，先思考下面代码：</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nvar obj = {\n  a: 2\n}\n\nvar bar = function() {\n  foo.call(obj);\n}\n\nbar();\nsetTimeout(bar, 100); // 2\n\n// 硬绑定的bar不能再修改它的this\nbar.call(window);\n</code></pre>\n<p>可以创建一个可以重复使用的硬绑定函数：</p>\n<pre><code class="language-javascript">function foo(something) {\n  console.log(this.a, something);\n  return this.a + something;\n}\n\n// 辅助绑定函数\nfunction bind(fn, obj) {\n  return function() {\n    return fn.apply(obj, arguments);\n  }\n}\n\nvar obj = {\n  a: 2\n};\n\nvar bar = bind(foo, obj);\n\nvar b = bar(3); // 2 3\nconsole.log(b); // 5\n</code></pre>\n<p>其实在ES5中已经提供了原生的<code>Fucntion.prototype.bind</code>的方法，可以直接使用：</p>\n<pre><code class="language-javascript">function foo(something) {\n  console.log(this.a, something);\n  return this.a + something;\n}\n\nvar obj = {\n  a: 2\n}\n\nvar bar = foo.bind(obj);\n\nvar b = bar(3);\nconsole.log(b);\n</code></pre>\n<h2>new绑定</h2>\n<p>JavaScript中的new并不想其他oo语言那样会实例化一个类，只是使用new操作符调用普通的函数，在这个调用也会对this进行绑定。\n使用new调用函数时，会自动执行下面操作：</p>\n<ol>\n<li>创建（或者说构造）一个全新的对象。</li>\n<li>这个对象会被执行[[原型]]连接。</li>\n<li>这个新对象会绑定到函数调用的this。</li>\n<li>如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。</li>\n</ol>\n<p>看下面代码：</p>\n<pre><code class="language-javascript">function foo(a) {\n  this.a = a;\n}\n\nvar bar = new foo(2);\n\nconsole.log(bar.a);\n</code></pre>\n<p>像这样普通的new调用<code>foo(...)</code>时，会构造一个新的对象并把它绑定到<code>foo(..)</code>调用中的this上。这个就称为new绑定。</p>\n<h1>绑定优先级</h1>\n<p>绑定优先级按照下面的顺序来判断：</p>\n<ol>\n<li>\n<p>函数是否在new中调用(new绑定)？如果是的话this绑定的是新创建的对象。</p>\n<pre><code class="language-javascript">var bar = new foo();\n</code></pre>\n</li>\n<li>\n<p>函数是否通过call、apply(显示绑定)或者硬绑定调用？如果是的话，this绑定的是指定的对象。</p>\n<pre><code class="language-javascript">var bar = foo.call(obj2);\n</code></pre>\n</li>\n<li>\n<p>函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this绑定的是哪个上下文对象。</p>\n<pre><code class="language-javascript">var bar = obj.foo();\n</code></pre>\n</li>\n<li>\n<p>若果都不是的话，适用默认绑定，严格模式下绑定到<code>undefined</code>，否则就绑到全局对象。</p>\n<pre><code class="language-javascript">var bar = foo();\n</code></pre>\n</li>\n</ol>\n<h1>绑定例外</h1>\n<p>在某些场景下this的绑定用上面的规制是判断不了的，可能认为是其他绑定规则，实际引用的是<a href="#%E9%BB%98%E8%AE%A4%E7%BB%91%E5%AE%9A">默认绑定</a>规则。</p>\n<h2>被忽略的this</h2>\n<p>如果把<code>null</code>或者<code>undefined</code>作为this的绑定对象传入call、apply或者bind中，这些值在调用时会被忽略，实际应用的是默认规则。</p>\n<pre><code class="language-javascript">function fOO() {\n  console.log(this.a);\n}\n\nvar a = 2;\n\nfoo.call(null); // 2\n</code></pre>\n<p>这种情况虽然并不多见，但是使用apply展开数组或者适用<code>bind(...)</code>进行<a href="https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96">柯里化</a>的时候会用到。</p>\n<pre><code class="language-javascript">function foo(a, b) {\n  console.log(\'a: \' + a + \'b: \' + b);\n}\n\nfoo.apply(null, [2, 3]); // a: 2, b: 3\n\n// 适用bind(..) 进行柯里化\nvar bar = foo.bind(nul, 2);\nbar(3); // a: 2, b: 3\n</code></pre>\n<p><strong>注意：很多时候新建一个空对象<code>var n = Object.creat(null)</code>代替<code>null</code>更为安全。</strong></p>\n<h2>间接引用</h2>\n<p>间接引用上面介绍<a href="#%E9%9A%90%E5%BC%8F%E4%B8%A2%E5%A4%B1">隐式丢失</a>的时候也有举过例子，调用间接引用的函数也会造成绑定例外。</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(this.a);\n}\n\nvar a = 2;\nvar o = { a: 3, foo: foo };\nvar p = { a: 4 };\n\no.foo(); // 3\n(p.foo = o.foo)(); // 2\n</code></pre>\n<h2>软绑定</h2>\n<p>软绑定可以实现硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。具体使用方式如下：</p>\n<pre><code class="language-javascript">function foo() {\n  console.log(\'name：\' + this.name);\n}\n\nvar obj = { name: \'obj\' };\nvar obj2 = { name: \'obj2\' };\nvar obj3 = { name: \'obj3\' };\n\n// 稍后实现softBind\nvar fooOBJ = foo.softBind(obj);\n\nfooOBJ(); // name: obj\n\nobj2.foo = foo.softBind(obj);\nobj2.foo(); // name: obj2\n\nfooOBJ.call(obj3); // name: obj3\n\nsetTimeout(obj2.foo, 10); // name: obj 应用了软绑定\n</code></pre>\n<p>可以看到，软绑定的<code>foo()</code>可以手动将this绑定到<code>obj2</code>或者<code>obj3</code>上，但如果应用默认绑定，则会将this绑定到obj中。</p>\n<p><code>softBind</code>的实现方式如下:</p>\n<pre><code class="language-javascript">if(!Function.prototype.softBind) {\n  Function.prototype.softBind = function(obj) {\n    var fn = this;\n    var curried = [].slice.call(arguments, 1);\n    var bound = function() {\n      return fn.apply(!this || this === (window || global) ? obj: this);\n\n      curried.concat.apply(curried, arguments)\n    };\n\n    bound.prototype = Object.create(fn.prototype);\n    return bound;\n  }\n}\n</code></pre>\n<p>这个函数首先检查调用时候的this，如果this绑定到全局或者undefined中，那就把指定的默认对象<code>obj</code>绑定到this，否则不修改this。<strong>ES5中的bind()已经实现此部分功能</strong>。</p>\n<h1>箭头函数</h1>\n<p>前面接受的<a href="#%E7%BB%91%E5%AE%9A%E4%BC%98%E5%85%88%E7%BA%A7">四条规则</a>可以包含所有正常函数。但是ES6中的<strong>箭头函数</strong>则无法使用这些规则。</p>\n<pre><code class="language-javascript">function foo() {\n  return (a) => {\n    // this继承foo\n    console.log(this.a);\n  };\n}\n\nvar obj1 = {\n  a: 2\n};\n\nvar obj2 = {\n  a: 3\n};\n\nvar bar = foo.call(obj1);\nbar.call(obj2); // 2，不是3\n</code></pre>\n<p><code>foo()</code>内部的箭头函数会捕获调用<code>foo()</code>时的this。由于<code>foo()</code>的this绑定到<code>obj1</code>,<code>bar</code>的this也会绑定到<code>obj1</code>，箭头函数的绑定无法被修改。(new也不行)</p>\n<p>在ES6出现之前我们经常写的一种模式与箭头函数是几乎相同的：</p>\n<pre><code class="language-javascript">function foo() {\n    var self = this;\n    setTimeout(function() {\n        console.log(self.a);\n    }, 100);\n}\n\nvar obj = {\n    a: 2\n};\n\nfoo.call(obj); // 2\n</code></pre>\n<p><code>var self = this</code>和箭头函数从本质来说是想取代this的机制，如果代码中大多数使用<code>var self = this;</code>，那么应该完全使用词法作用域或箭头函数，抛弃this风格的代码。相反，如果使用this，则可以上方的绑定机制。</p>',frontmatter:{date:"June 27, 2017",path:"/post/js-this",title:"深入学习javascript - this"},headings:[{depth:1,value:"关于this"},{depth:1,value:"this的指向"},{depth:1,value:"绑定规则"},{depth:2,value:"默认绑定"},{depth:2,value:"隐式绑定"},{depth:3,value:"隐式丢失"},{depth:2,value:"显式绑定"},{depth:2,value:"硬绑定"},{depth:2,value:"new绑定"},{depth:1,value:"绑定优先级"},{depth:1,value:"绑定例外"},{depth:2,value:"被忽略的this"},{depth:2,value:"间接引用"},{depth:2,value:"软绑定"},{depth:1,value:"箭头函数"}]}},pathContext:{prev:{title:"深入学习javascript-类",date:"2017-07-20",category:null,tags:null,path:"/post/js-class"},next:{title:"webpack2新特性&迁移",date:"2017-06-24",category:["前端工具"],tags:["webpack"],path:"/post/webpack2"}}}}});
//# sourceMappingURL=path---post-js-this-09aee910dee0c73d3872.js.map