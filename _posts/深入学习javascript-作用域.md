---
path: scoped
date: 2017-05-31T23:11:26.000Z
title: 深入学习javascript--作用域
---

# 前言
使用js已经有一段时间了，一开始觉得js只是一门玩具语言，用来做做前端交互效果。但是随着越来越深入，慢慢发现js的其他优点：灵活的自由的代码编写带来多种多样的设计方式，令人慢慢着迷。但是很多时候都感觉只是停留在如何使用js实现相关的功能，偶尔遇到一些特殊的情况或者需要深度优化的点，就会感到惘然，为了打破这尴尬情况，打算开始读相关的一些书籍来分析js更深层的设计还有使用方式，从而“达到知其然且知其所以然”。

# 作用域是什么
JS中每个函数都有自己的执行环境，在执行环境中能够储存变量中的值，并且能在之后对值进行访问或者修改。换句话说，规定变量储存在哪里，程序要如何找到这些变量，这套规则就称为**作用域**。



## 理解作用域执行过程
如在`var a = 2`执行过程中，分别有引擎、编译器、作用域三个参与了这次过程。

首先，编译器会将这段程序分解成词法单元，然后将词法单元解析成一个树结构。
1. 遇到var a，编译器会在**作用域**中查找是有已经存在有该名称的变量。如果是，编译器会忽略这一声明，继续编译；否则，会要求作用域在当前作用域集合中声明一个新变量，并命名为a。
2. 接下来，编译器会为**引擎**生成运行时所需的代码，代码用来处理`a = 2`这个赋值操作。引擎运行时会首先询问**作用域**当前作用集合是否有一个`a`的变量。如果是，**引擎**就会使用这个变量；如果不是，引擎会继续查找该变量。如果**引擎**找到`a`变量，就会赋值2。否则，**引擎**会抛出一个异常。

**总结**：变量赋值分别有两个动作，**编译器**会在当前**作用域**中声明一个变量（如果之前没有声明过），然后在运行时引擎会在**作用域**中查找该变量，如果能找到就对变量进行赋值。

<!-- more -->

### LSH和RSH查询
定义一个变量`var a = 2`，或者执行一个简单的函数`console.log(2)`中，会同时或者单独出现**LSH**或者**RSH**查询。其实在作用域执行过程中，第一步就是LSH查询，第二步就是RSH查询，简单点来说
* LSH查询就是找到变量的容器本身
* RSH查询就是找到容器的原值

```javascript
// var a就是LSH
// a = 2就是RSH
var a = 2;

// 这里的a其实就是做了一个RSH查询
console.log(a)
```

为什么需要理解这两个概念呢，因为在变量没有声明的情况下，这两种查询的行为是不一样的。

```javascript
function foo(a) {
	console.log(a + b);
	b = a;
}

foo(2);
```

在第一次对b做RSH查询时候是无法找到该变量，所以引擎在这时候就会报出一个`ReferenceError`的错误。第二个b也还没有声明，但是引擎并没有报错，因为这里先做了LSH查询，所以可以知道，LSH查询如果未找到变量，会在全局中定义一个变量b（非严格模式下），再做RSH查询。引擎还有一个`TypeError`的错误，在试图对一个非函数类型的值执行函数调用，或者引用`null`, `undefined`类型值中的属性时候，就会报这个错误。

## 提升
很多时候都会认为javascript代码是由上到下一行一行执行的，但实际上并不完全正确，有一种特殊情况会导致这个假设是错误的。
```javascript
a = 2;

var a;

console.log(a);  // 2
```

还有另外一段
```javascript
console.log(a); // undefined

var a = 2;
```

当js执行一个`var a = 2`的时候，这里并不是我们看到的一个声明，而是`var a`, `a = 2`两个声明，`var a`会在编译阶段执行，`a = 2`则会在执行阶段执行。所以第二段代码就很容易解释通了，代码执行顺序应该如下
```javascript
var a;

console.log(a);

a = 2;
```
而这个函数声明自动移动到顶部，就叫做**提升**。

提升操作会出现在**每个作用域**中，看以下代码
```javascript
foo();

function foo() {
	console.log(a);
	var a = 2;
}
```
实际执行如下
```javascript
function foo() {
	var a;
	console.log(a);
	a = 2;
}

foo();
```
可以看到，函数声明会被提升到最顶部，但是函数表达式却不会被提升
```
foo(); // TypeError
bar(); // ReferenceError

var foo = function bar() {
	...
}
```
在这里要注意，把foo分配到具名函数下，但是具名函数下也无法在所在作用域中运行。上面函数的执行方式应该如下
```javascript
var foo;

foo(); // TypeError

bar(); // ReferenceError

foo = function() {
	var bar = ... self ...
}
```

### 函数优先
从上面可以知道定义变量和声明函数都会触发提升，但是如果在重复声明的代码下，会出现什么情况呢
```javascript
foo(); // 1

var foo;

function foo() {
	console.log(1);
}

foo = function() {
	console.log(2);
}
```
这里会出现**1**而不是**2**！因为函数会首先被提升，再到变量，所以执行顺序应该如下
```javascript
function foo() {
	console.log(1);
}

foo();

foo = function() {
	console.log(2);
}
```

在一个普通的块( { ... } 的代码)，函数也会提升，如下代码
```javascript
var a = true;

if(a) {
	function foo() {
		...
	}
}else {
	function bar() {
		...
	}
}
```
这里的`foo`和`bar`都不会按判断来声明函数，所以在判断声明函数并不可靠。

## 作用域嵌套
当一个块或者函数嵌套在另一个块或者函数中，就称为作用域嵌套。在当前作用域没有找到某个变量时，**引擎**就会在外层的作用域继续查找，直到找到该变量，或者抵达最外层（全局）作用域为止。
```javascript
function foo(a) {
	// b在函数中尚未定义，所以在上一个作用域中查找
	// 在全局中找到变量b，赋值
	console.log(a + b);
}

var b = 2;

foo(2); // 4
```

# 函数作用域
每个函数都有自己的执行环境，或者说函数有自己作用域。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而函数执行之后，栈将其环境弹出，把控制权返回之前的执行环境。函数作用域内的变量访问正是又这个执行机制控制着。而通过这一机制，能实现隐藏作用域中变量或者函数，规避同名标识符之间的冲突。

```javascript
function foo() {
	function bar(a) {
		// i会从for块中找到变量容器，然后执行赋值
		i = 3;
		console.log(a + i);
	}

	for(var i = 0; i <= 10; i++) {
		// 执行bar后会给i重新赋值3，满足i<=10，函数死循环
		bar(i * 2);
	}
}
```

这时候只需要在bar内部修改`i = 3`为`var i = 3`，将i变为`bar`中的本地变量即可。除了新建一个函数去隐藏变量，还能通过匿名函数的特性去实现隐藏变量，社区中也称为**IIFE**。

```javascript
var a = 2;

(function() {
	var a = 3;
	console.log(a); // 3
})()

console.log(a); // 2
```
还能当作函数调用传参
```javascript
var a = 2;

(function(global) {
	var a = 3;

	console.log(a); // 3
	console.log(global.a); // 2
})(window)
```
通过隐藏变量活着函数，能实现**全局命名空间**或者**JS模块化**(后面会讨论到)。

# 块作用域
在JS中块作用域并不常见，但是某些代码却经常会被误以为是块作用域，所以很容易造成理解上的错误，例如下面的常用代码
```javascript
for(var i = 0; i < 10; i++) {
	console.log(i);
}

if(true) {
	var foo = 'bar';
}

console.log(i, foo); // 10 bar
````
上面代码的`i`和`foo`其实都在外部作用域中定义的，而不是在代码块中定义的变量，所以平时在这些代码中定义变量应该是距离使用的地方越近越好。

## 延长作用域链(块作用域)
* with语句。with从对象中创建出来的对象只在with声明中有效。
```javascript
function foo() {
	var qs = "?bar=true";

	with(location) {
		// href实际是location.href，只能在with内部使用
		var url = href + qs;
	}

	return url;
}
```

* try/catch中的catch分句会创造一个块作用域，声明的错误对象变量仅在catch内部有效。
```javascript
try {
	undefined(); // 强制执行一个错误操作
} catch(err) {
	console.log(err);
}

console.log(err); // ReferenceError
```

## let/const
在ES6中，引入了let和const，提供了除var以外的另一种声明变量的方式。用let/const声明的变量会绑定在所在的所用域中（通常是{ ... }内部，换句话说，let/const能劫持所在作用域。
```javascript
// 修改下上面的循环例子
for(let i = 0; i < 10; i++) {
	console.log(i);
}

console.log(i); // ReferenceError
```

const在使用方法上跟len是一样，只是创建的值是固定的（常量）。后面任何修改值的操作都会报错。**(注：const实际保证的并不是常量不能改变，而是变量的内存地址不能改变，所以对于复杂的类型object，也只能保证对象的指针地址是固定的，但是对象内部的数据结构则不能固定)**
```javascript
const foo = {};

foo.bar = 'bar';
console.log(foo.bar); // bar

foo = {}; // TypeError
```

# 总结
通过学习js中的作用域运行方式，了解变量在执行环境的声明周期，以及哪部分代码能访问其中的变量。能为后面学习**闭包**还有实现模块化打下基础。以下是关于作用域的几点总结：
* 函数局部环境不仅有访问函数作用域的变量的权限，而且还有权访问其包含(父)环境的变量。
* 除全局、函数作用域外，还有比较少用的块作用域。
