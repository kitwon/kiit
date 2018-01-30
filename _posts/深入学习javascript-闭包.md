---
path: closures
date: 2017-06-14T21:54:18.000Z
title: 深入学习javascript-闭包
---

# 什么是闭包
记得刚开始用js的时候就听过闭包这个概念，一开始觉得只是一个语言特性，没有太深入了解，网上查资料的解释一般是：函数有权访问另一个函数作用域中变量的函数，最容易生成闭包的方式一般是函数里面套函数。

> 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域外执行。
--- 你不知道的javascript（上卷）

然后看个例子
```javascript
function foo() {
	var a = 2;

	funtion bar() {
		console.log(a);
	}

	bar();
}

foo();
```
如果按上面第一条的定义，这里一定是生成了闭包，但是**确切的说并不是**，这里最准确的说是`bar`对`a`的引用方式是词法作用域的查找规则，而这些只是**闭包**的一部分。然后再看清晰闭包的例子

```javascript
fucntion foo() {
	var a = 2;

	function bar() {
		console.log(a)
	}

	return bar;
}

var baz = foo()；

baz(); // 这就是闭包效果
```

<!-- more -->

在这例子中，`bar`也是在`foo`的作用域内，但是不是直接执行，而是作为返回值返回。
`foo()`执行后，返回值`bar`赋值给`baz`并执行`baz()`，在这里，`bar()`显然可以正常执行，它在自己定义的词法作用域**以外**的地方。

在`foo()`执行之后，按js的垃圾回收机制，应该会对其进行回收，而闭包的神奇之处就是可以阻止这事情发生，因此`baz()`在执行的时候依然可以访问`a`。在此一看，原来平时写的大多数代码都是闭包啊。
```javascript
function foo() {
	var a = 2;

	function bar() {
		console.log(a);
	}

	baz(bar);
}

function baz(fn) {
	fn && fn(); // 这里也是闭包
}
```

# 闭包与变量
要说明闭包，for循环也是一个很好的例子
```javascript
for(var i = 1; i <= 10; i++) {
	setTimeout(function timer() {
		console.log(i)
	}, i * 1000)
}
```
正常情况下，我们会预期的认为这段会每秒输出1～10，但实际，这段代码会**每秒输出10次11**。

首先**11**是那里来的，这个循环应该是在`i=11`的时候符合终止条件，所以代码输出的是循环结束时**i**的最终值。

细想一下，答案其实显而易见，**setTimeout**会推到栈底部执行，所以会在循环结束后才开始执行，所以每次都是输出**11**。但是什么问题造成这样的结果呢。

虽然**setTimeout**都是在每个迭代时候分别定义的，但是根据作用域原理，其实几个函数都是都是**保存在一个封闭的作用域中**，因此它们引用都是同一个**来自全局的i**。

所以解决方法也很简单，我们需要每次循环都新建一个作用域，然后把迭代的值传入作用域中，所以我们可以用**IIFE**（上一篇作用域有介绍，IIFE是一个匿名函数，每次调用都会创建作用域）来解决
```javascript
for(var i = 1; i <= 10; i++) {
	(function(j) {
		setTimeout(function timer() {
			console.log(j)
		}, j * 1000)
	})(i)
}

// 换成ES6中的let也可以
for(let i = 1; i <= 10; i++) {
	setTimeout(function timer() {
		console.log(i)
	}, i * 1000)
}
```

# 模块
闭包除了平时实现的回调功能外，还可以实现另外一个强大的功能，**模块**。
旧的模块实现方式，如jQuery就可以使用闭包实现
```javascript
var $ = jQuery = (function Module(id) {
	var a = 2;

	function doSomething() {
		console.log(a);
	}

	function identify1() {
		console.log(id);
	}

	function identify2() {
		console.log(id.toUpperCase());
	}

	function change() {
		public.identify = identify2;
	}

	var public = {
		doSomething: doSomething,
		identify: identify1,
		change: change
	}

	return public;
})('hello')

$.doSomething() // 2
$.identify() // hello
$.change()
$.identify() // HELLO
```

如果不用单例的话不用**IIFE**即可，通过在模块内保留对公共API的引用，可以从**内部**对模块实例进行修改，包括添加，删除，修改属性或者方法。

## 现代的模块机制
现在大部分的模块加载器本质上都是将这种模块定义封装进API中，如下代码
```javascript
var Module = (function Manager() {
	var modules = {};

	function define(name, deps, impl) {
		for(var i = 0; i < deps.length; i++) {
			// 在modules中寻找名字为deps[i]的模块
			deps[i] = modules[deps[i]];
		}
		// 将依赖的模块作为arguments传入module中
		modules[name] = impl.apply(impl, deps);
	}

	function require(name) {
		return modules[name];
	}

	return {
		define: define,
		require: require
	}
})()
```
这段代码核心在`module[name] = impl.apply(impl, deps)`中，模块都按名字保存在`modules`变量中，每次都能根据获取相关模块。下面看看使用方式。
```javascript
Module.define('foo', [], function() {
	function hello(who) {
		return 'Hello ' + who;
	}

	return {
		hello: hello
	}
})

Module.define('bar', ['foo'], function(foo) {
	function awsome() {
		return foo.hello('kit').toUpperCase();
	}

	return {
		awsome: awsome
	}
})

var foo = Module.require('foo'),
	bar = Module.require('bar');

foo.hello('kit'); // Hello kit
bar.awsome() // HELLO KIT
```

# 总结
从上面可以知道，平时写的js大部分代码都使用了闭包，通过了解闭包和作用域的运行方式，能够减少平时使用的出现的错误。也能通过闭包，使用js实现模块化等其他更多的功能。
