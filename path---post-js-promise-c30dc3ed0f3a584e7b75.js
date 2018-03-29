webpackJsonp([3143617686903],{296:function(e,n){e.exports={data:{markdownRemark:{html:"<p>老前端都知道，js分为同步(sync)和异步(async)两种模式，同步简单来说就是排队，一个接着一个。异步则是函数执行完后执行它的回调函数，而下一个函数不等上一个函数完成就开始执行。使用回调函数能解决大部分的异步问题，但是回调一多就很容易掉进‘回调地狱’，为了解决这个问题，<a href=\"https://promisesaplus.com/\">promise</a>（CommonJS工作组提出的一种规范）给我们提供了一种更为优雅的解决方式。</p>\n<p>下面，我们会尝试实现一个promise，通过实现这个demo，能更好地理解promise的运行方式，使平时在使用的时候更加熟练，也能从实现原理中进行深入探讨，从而达到“知其然且知其所以然”。</p>\n<h1>初步构建一个Promise</h1>\n<p>我们看下平时使用promise处理异步函数时候的使用方式，从调用方法看下大概用什么方式去实现</p>\n<pre><code class=\"language-javascript\">// 例1\nfunction getAsyncData() {\n    return new Promise(function(resolve, reject) {\n        setTimeout(function() {\n            resolve('promise done!')\n        }, 1000)\n    })\n}\n\ngetAsyncData().then(function(result) {\n    console.log(result);\n}).then(function() {\n    console.log('done too!');\n})\n</code></pre>\n<!-- more -->\n<p><code>getAsyncData</code>函数中返回一个promise对象，然后通过<code>then</code>方法执行函数的回调，然后尝试实现一下这个基本的功能</p>\n<pre><code class=\"language-javascript\">// promise.js\nvar Primose = function(fn) {\n    var callbacks = [];\n\n    this.done = function(onFulfilled) {\n        this.callbacks.push(onFulfilled)\n\n        // 支持链式调用\n        return this;\n    }\n\n    function resolve(value) {\n        // push到队列的最底端，保证链式代码执行完后再执行方法\n        setTimeout(function() {\n            while(callbacks[0]) {\n                callbacks.shift()()\n            }\n        }, 0)\n    }\n\n    fn(resolve)\n}\n</code></pre>\n<p>到这里就完成了promise的基础功能，然后执行一下看下有没有达到预期情况:</p>\n<pre><code class=\"language-bash\">$ node promise\npromise done!\ndone too!\n</code></pre>\n<p>乍看一下，怎么有点像lazyman(js中比较有名的题目，可以自行百度一下) ，看来平时多读书还是有好处的（手动滑稽）v</p>\n<h1>引入状态</h1>\n<p>这里我们可以先看下<a href=\"https://promisesaplus.com/#requirements\">promise状态规范</a></p>\n<p>promise必需在pending, fulfilled或者reject三个状态中的一个</p>\n<ul>\n<li>\n<p>当promise在pending状态中</p>\n<ul>\n<li>可以变为fulfilled或者reject状态</li>\n</ul>\n</li>\n<li>\n<p>当promise在fulfilled中</p>\n<ul>\n<li>不能过渡为其他状态</li>\n<li>必需返回一个值，并且不能改变</li>\n</ul>\n</li>\n<li>\n<p>当promise在reject中</p>\n<ul>\n<li>不能过渡为其他状态</li>\n<li>必需返回一个失败原因，并且不能改变</li>\n</ul>\n</li>\n</ul>\n<p>从这里可以看出，我们需要添加一个<code>status</code>变量保存状态，并且随着代码执行更新状态。</p>\n<pre><code class=\"language-javascript\">var Promise = function(fn) {\n    var state = 'pending',\n        value = null,\n        callbacks = [];\n\n    this.then = function(onFulfilled) {\n        if(state === 'pending') {\n            callbacks.push(onFulfilled);\n            return this;\n        }\n\n        onFulfilled(value);\n        return this;\n    }\n\n    function resolve(newValue) {\n        state = 'fulfilled';\n        value = newValue;\n\n        setTimeout(function() {\n            while(callbacks[0]) {\n                callbacks.shift()(value)\n            }\n        }, 0)\n    }\n\n    fn(resolve)\n}\n</code></pre>\n<h1>串行promise</h1>\n<p>在执行promise的时候，经常会在<code>then</code>的方法里面执行另外一个promise，<em>串联执行promise应该是promise里面最有趣并且是最核心的功能了</em>。</p>\n<p>串行promise指执行完一个异步函数达到fulfilled状态后，接着执行下一个promise，例如</p>\n<pre><code class=\"language-javascript\">// 接着例1\n\ngetAsyncData()\n    .then(getAsyncData2)\n    .then(function(data) {\n        console.log(data + 'done too!');\n    })\n\nfunction getAsyncData2(result) {\n    return new Promise(function(resolve, reject) {\n        setTimeout(function() {\n            resolve(result + 'next promise done!')\n        }, 1000)\n    })\n}\n</code></pre>\n<p>要实现这个功能，首先，我们，之前的<code>then</code>方法是直接把<code>this</code>返回出去，所以实现链式调用，执行起来的时候也扛扛的，没毛病，但如果then中执行下一个promise，这时候按上面的代码，应该是直接就return一个promise出去的，走不了下一步，所以<code>then</code>方法应该需要处理一下，promise的执行方式应该要变为：</p>\n<ol>\n<li>执行代码，将所有方法push到<code>callbacks</code>数组里面</li>\n<li>如果<code>then</code>中是一个promise，把剩下的<code>callbacks</code>提交到这个promise中执行</li>\n<li>再循环第一步</li>\n</ol>\n<pre><code class=\"language-javascript\">var Promise = function(fn) {\n    var state = 'pending',\n        // value = null,\n        callbacks = [];\n\n    this.then = function(onFulfilled) {\n        switch(state) {\n            case 'pending':\n                callbacks.push(onFulfilled)\n                return this;\n                break;\n            case 'fulfilled':\n                onFulfilled()\n                return this;\n                break;\n        }\n    }\n\n    function resolve(newValue) {\n        var value = newValue;\n        var temp = null;\n\n        setTimeout(function() {\n            state = 'fulfilled';\n            do {\n                temp = callbacks.shift()(value)\n                // 顺序执行数组，如果是resolve返回value\n                // 如果是promise则把后面的then方法提交到下个promise中执行\n                if(temp instanceof Promise) {\n                    while(callbacks[0]) {\n                        temp.then(callbacks.shift())\n                    }\n                    return;\n                }else {\n                    value = temp;\n                }\n            }while(callbacks[0])\n        }, 0)\n    }\n    fn(resolve)\n}\n</code></pre>\n<h1>添加reject功能</h1>\n<p>因为不确定then方法中是否会添加reject的处理，所以选用了一个比较笨的方法，加一个<code>errDerrers</code>的数组，每次执行不管有没有方法<code>then</code>都<code>push</code>到数组里面，<code>resolve</code>一个方法就<code>shift</code>一个，跟成功的回调一样，当reject的时候，判断下当前的方法是不是一个可执行函数，如果是的话则执行。至于catch的方法按这个思路暂时没想到，后面想到再更新。修改的地方都有添加注释。</p>\n<pre><code class=\"language-javascript\">var Promise = function(fn) {\n    var state = 'pending',\n        // value = null,\n        error = null,\n        errDeffers = [],\n        callbacks = [];\n\n    this.then = function(onFulfilled, rejected) {\n        switch(state) {\n            case 'pending':\n                callbacks.push(onFulfilled);\n                // 每次执行then都push一次\n                errDeffers.push(rejected);\n                return this;\n                break;\n            case 'fulfilled':\n                onFulfilled()\n                return this;\n                break;\n            // reject的话直接执行\n            case 'rejected':\n                rejected(error);\n                return this;\n                break;\n        }\n    }\n\n    this.catch = function(rejected) {\n        if(errDeffer === null) {\n            errDeffer = rejected;\n            return;\n        }\n    }\n\n    function resolve(newValue) {\n        var value = newValue;\n        var temp = null;\n\n        setTimeout(function() {\n            state = 'fulfilled';\n            do {\n                temp = callbacks.shift()(value);\n                errDeffers.shift();\n                // 顺序执行数组，如果是resolve返回value\n                // 如果是promise则把后面的then方法提交到下个promise中执行\n                if(temp instanceof Promise) {\n\n                    while(callbacks[0]) {\n                        // 成功的时候也要更新一下errDeffers数组\n                        temp.then(callbacks.shift(), errDeffers.shift())\n                    }\n\n                    return;\n                }else {\n                    value = temp;\n                }\n            }while(callbacks[0])\n        }, 0)\n    }\n\n    // reject方法\n    // 判断rejected是否一个函数，是的话执行，不是的话抛出一个错误\n    // reject也要提交到栈的最底端执行\n    function reject(err) {\n        setTimeout(function() {\n            state = 'rejected';\n            error = err;\n            var rejected = errDeffers.shift();\n\n            if(Object.prototype.toString.call(rejected) !== '[object Function]') {\n                throw new Error('Uncaught promise error!');\n                return;\n            }\n\n            rejected(error);\n        }, 0)\n    }\n\n    fn(resolve, reject)\n}\n</code></pre>\n<h1>总结</h1>\n<p>找资料的时候看到<a href=\"http://tech.meituan.com/promise-insight.html\">美团技术团队博客的实现方式</a>采用了另外一种解决方式解决串行promise，后面接着研究下，有兴趣也可以自行看下。\n实现promise应该有下面几个要点：</p>\n<ol>\n<li>函数的顺序执行</li>\n<li>处理好状态（这部分感觉我的方法跟promiseA的状态要求有点偏差）</li>\n<li>链式调用\n这个例子只是根据promise的执行方式实现大概的功能，后面或许会根据promise规范去实现一个比较规范的demo。</li>\n</ol>\n<h2>参考</h2>\n<ul>\n<li><a href=\"https://promisesaplus.com/#requirements\">Promises/A+</a></li>\n<li><a href=\"http://tech.meituan.com/promise-insight.html\">剖析 Promise 之基础篇</a></li>\n<li><a href=\"http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html\">Javascript异步编程的4种方法</a></li>\n</ul>",frontmatter:{date:"May 17, 2017",path:"/post/js-promise",title:"Promise的简单实现"},headings:[{depth:1,value:"初步构建一个Promise"},{depth:1,value:"引入状态"},{depth:1,value:"串行promise"},{depth:1,value:"添加reject功能"},{depth:1,value:"总结"},{depth:2,value:"参考"}]}},pathContext:{prev:{title:"js实现add(1)(2)(3)",date:"2017-05-28",category:["javascript"],tags:null,path:"/post/add-chain"},next:{title:"前端单元测试&Mocha指北",date:"2017-05-16",category:["前端"],tags:null,path:"/post/unit-test"}}}}});
//# sourceMappingURL=path---post-js-promise-c30dc3ed0f3a584e7b75.js.map