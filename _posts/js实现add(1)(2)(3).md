---
path: post/add-chain
title: js实现add(1)(2)(3)
date: 2017-05-28 14:25:44
tags:
category:
- javascript
---

之前在YY面试的时候遇到过的一题: 实现add(1)(2)(3)，返回6，注意可拓展性。
当时第一反应就是用递归实现
```javascript
function add(x) {
	var fn = function(y) {
		return add(x + y);
	}

	return fn;
}

console.log(add(1)(2)(3))
```

这样写是可以实现调用方式，但是怎么`return x`呢，回来想还是一脸懵逼，于是上网找了点其他人的实现方式，发现他们是重写了`object`的`valueOf`和`toString`的方法。然后再跑了一遍。
```javascript
function add(x) {
	var fn = function(y) {
		return add(x + y);
	}

	fn.toString = function() {
		return x;
	}

	return fn;
}


// chrome  function 6
// firefox function add/fn
// node    { [Number: 6] toString: [Function], valueOf: [Function] }
console.log(add(1)(2)(3))

console.log(add(1)(2)(3).toString()) // 6
```

<!-- more -->

由此看出在不同客户端下返回的结果并不一样，并不是完美的结果，但是查阅了其他资料并没有其他十分好的解决办法，估计这道题的考查点是关于js深度的，比如原生对象里面的基本方法和`alert`, `console`会自动执行toString等方法。

另外，`valueOf`和`toString`方法其实是差不多的，返回的结果基本都是相同的，但是试了一下定义了两个不同的方法，发现总是会返回valueOf的值先，所以觉得toString应该是应用于valueOf的结果。
