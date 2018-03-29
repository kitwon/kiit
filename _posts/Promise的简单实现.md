---
path: /post/js-promise
title: Promise的简单实现
date: 2017-05-17 21:54:08
category:
- 前端
tags:
- javascript
---

老前端都知道，js分为同步(sync)和异步(async)两种模式，同步简单来说就是排队，一个接着一个。异步则是函数执行完后执行它的回调函数，而下一个函数不等上一个函数完成就开始执行。使用回调函数能解决大部分的异步问题，但是回调一多就很容易掉进‘回调地狱’，为了解决这个问题，[promise](https://promisesaplus.com/)（CommonJS工作组提出的一种规范）给我们提供了一种更为优雅的解决方式。

下面，我们会尝试实现一个promise，通过实现这个demo，能更好地理解promise的运行方式，使平时在使用的时候更加熟练，也能从实现原理中进行深入探讨，从而达到“知其然且知其所以然”。



# 初步构建一个Promise
我们看下平时使用promise处理异步函数时候的使用方式，从调用方法看下大概用什么方式去实现
```javascript
// 例1
function getAsyncData() {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve('promise done!')
		}, 1000)
	})
}

getAsyncData().then(function(result) {
	console.log(result);
}).then(function() {
	console.log('done too!');
})
```

<!-- more -->

`getAsyncData`函数中返回一个promise对象，然后通过`then`方法执行函数的回调，然后尝试实现一下这个基本的功能
```javascript
// promise.js
var Primose = function(fn) {
	var callbacks = [];

	this.done = function(onFulfilled) {
		this.callbacks.push(onFulfilled)

		// 支持链式调用
		return this;
	}

	function resolve(value) {
		// push到队列的最底端，保证链式代码执行完后再执行方法
		setTimeout(function() {
			while(callbacks[0]) {
				callbacks.shift()()
			}
		}, 0)
	}

	fn(resolve)
}
```
到这里就完成了promise的基础功能，然后执行一下看下有没有达到预期情况:
```bash
$ node promise
promise done!
done too!
```
乍看一下，怎么有点像lazyman(js中比较有名的题目，可以自行百度一下) ，看来平时多读书还是有好处的（手动滑稽）v

# 引入状态
这里我们可以先看下[promise状态规范](https://promisesaplus.com/#requirements)

promise必需在pending, fulfilled或者reject三个状态中的一个
* 当promise在pending状态中
	* 可以变为fulfilled或者reject状态
* 当promise在fulfilled中
	* 不能过渡为其他状态
	* 必需返回一个值，并且不能改变
* 当promise在reject中
	* 不能过渡为其他状态
	* 必需返回一个失败原因，并且不能改变


从这里可以看出，我们需要添加一个`status`变量保存状态，并且随着代码执行更新状态。
```javascript
var Promise = function(fn) {
	var state = 'pending',
		value = null,
		callbacks = [];

	this.then = function(onFulfilled) {
		if(state === 'pending') {
			callbacks.push(onFulfilled);
			return this;
		}

		onFulfilled(value);
		return this;
	}

	function resolve(newValue) {
		state = 'fulfilled';
		value = newValue;

		setTimeout(function() {
			while(callbacks[0]) {
				callbacks.shift()(value)
			}
		}, 0)
	}

	fn(resolve)
}
```

# 串行promise
在执行promise的时候，经常会在`then`的方法里面执行另外一个promise，*串联执行promise应该是promise里面最有趣并且是最核心的功能了*。

串行promise指执行完一个异步函数达到fulfilled状态后，接着执行下一个promise，例如
```javascript
// 接着例1

getAsyncData()
	.then(getAsyncData2)
	.then(function(data) {
		console.log(data + 'done too!');
	})

function getAsyncData2(result) {
	return new Promise(function(resolve, reject) {
		setTimeout(function() {
			resolve(result + 'next promise done!')
		}, 1000)
	})
}
```

要实现这个功能，首先，我们，之前的`then`方法是直接把`this`返回出去，所以实现链式调用，执行起来的时候也扛扛的，没毛病，但如果then中执行下一个promise，这时候按上面的代码，应该是直接就return一个promise出去的，走不了下一步，所以`then`方法应该需要处理一下，promise的执行方式应该要变为：
1. 执行代码，将所有方法push到`callbacks`数组里面
2. 如果`then`中是一个promise，把剩下的`callbacks`提交到这个promise中执行
3. 再循环第一步

```javascript
var Promise = function(fn) {
	var state = 'pending',
		// value = null,
		callbacks = [];

	this.then = function(onFulfilled) {
		switch(state) {
			case 'pending':
				callbacks.push(onFulfilled)
				return this;
				break;
			case 'fulfilled':
				onFulfilled()
				return this;
				break;
		}
	}

	function resolve(newValue) {
		var value = newValue;
		var temp = null;

		setTimeout(function() {
			state = 'fulfilled';
			do {
				temp = callbacks.shift()(value)
				// 顺序执行数组，如果是resolve返回value
				// 如果是promise则把后面的then方法提交到下个promise中执行
				if(temp instanceof Promise) {
					while(callbacks[0]) {
						temp.then(callbacks.shift())
					}
					return;
				}else {
					value = temp;
				}
			}while(callbacks[0])
		}, 0)
	}
	fn(resolve)
}
```

# 添加reject功能
因为不确定then方法中是否会添加reject的处理，所以选用了一个比较笨的方法，加一个`errDerrers`的数组，每次执行不管有没有方法`then`都`push`到数组里面，`resolve`一个方法就`shift`一个，跟成功的回调一样，当reject的时候，判断下当前的方法是不是一个可执行函数，如果是的话则执行。至于catch的方法按这个思路暂时没想到，后面想到再更新。修改的地方都有添加注释。
```javascript
var Promise = function(fn) {
	var state = 'pending',
		// value = null,
		error = null,
		errDeffers = [],
		callbacks = [];

	this.then = function(onFulfilled, rejected) {
		switch(state) {
			case 'pending':
				callbacks.push(onFulfilled);
				// 每次执行then都push一次
				errDeffers.push(rejected);
				return this;
				break;
			case 'fulfilled':
				onFulfilled()
				return this;
				break;
			// reject的话直接执行
			case 'rejected':
				rejected(error);
				return this;
				break;
		}
	}

	this.catch = function(rejected) {
		if(errDeffer === null) {
			errDeffer = rejected;
			return;
		}
	}

	function resolve(newValue) {
		var value = newValue;
		var temp = null;

		setTimeout(function() {
			state = 'fulfilled';
			do {
				temp = callbacks.shift()(value);
				errDeffers.shift();
				// 顺序执行数组，如果是resolve返回value
				// 如果是promise则把后面的then方法提交到下个promise中执行
				if(temp instanceof Promise) {

					while(callbacks[0]) {
						// 成功的时候也要更新一下errDeffers数组
						temp.then(callbacks.shift(), errDeffers.shift())
					}

					return;
				}else {
					value = temp;
				}
			}while(callbacks[0])
		}, 0)
	}

	// reject方法
	// 判断rejected是否一个函数，是的话执行，不是的话抛出一个错误
	// reject也要提交到栈的最底端执行
	function reject(err) {
		setTimeout(function() {
			state = 'rejected';
			error = err;
			var rejected = errDeffers.shift();

			if(Object.prototype.toString.call(rejected) !== '[object Function]') {
				throw new Error('Uncaught promise error!');
				return;
			}

			rejected(error);
		}, 0)
	}

	fn(resolve, reject)
}
```

# 总结
找资料的时候看到[美团技术团队博客的实现方式](http://tech.meituan.com/promise-insight.html)采用了另外一种解决方式解决串行promise，后面接着研究下，有兴趣也可以自行看下。
实现promise应该有下面几个要点：
1. 函数的顺序执行
2. 处理好状态（这部分感觉我的方法跟promiseA的状态要求有点偏差）
3. 链式调用
这个例子只是根据promise的执行方式实现大概的功能，后面或许会根据promise规范去实现一个比较规范的demo。

## 参考
* [Promises/A+](https://promisesaplus.com/#requirements)
* [剖析 Promise 之基础篇](http://tech.meituan.com/promise-insight.html)
* [Javascript异步编程的4种方法](http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html)
