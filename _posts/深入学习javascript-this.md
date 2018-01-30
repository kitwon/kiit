---
path: post/js-this
date: 2017-06-27T15:20:02.000Z
title: 深入学习javascript - this
---

# 关于this

`this`应该是javascript中一个比较复杂的机制了，在日常工作中我们可能有意无意都会使用到这个机制，但是`this`的工作机制真正了解的可能只有皮毛，通过学习这一机制，能够提高对js代码的理解和阅读能力，还有对js程序设计模式有着更深的理解。

# this的指向
this是运行时进行绑定的，而不是编写时绑定的，它的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。

通过分析调用位置，就能知道this到底引用的是什么。所以，寻找调用位置就能弄清上面的问题，通过一个例子，就能很好地理解这个问题：
```javascript
function baz() {
  // 当前调用栈是 baz
  // 当前调用位置是全局作用域

  console.log('baz');
  bar(); // bar的调用位置
}

function bar() {
  // 当前的调用栈是 baz -> bar
  // 当前的调用位置是baz

  console.log('bar');
  foo();
}

function foo() {
  // 当前的调用栈是 baz -> bar -> foo
  // 当前的调用位置是bar

  console.log('foo');
}

baz();
```

<!-- more -->

# 绑定规则
除了像上面分析代码，还有一个最简单的方式就是分析调用工具。找到调用位置后，就能根据下面的4条规则来判断this如何绑定。

## 默认绑定
```javascript
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

从上面代码可以知道，`foo`的调用位置在全局中，不带任何修饰地调用，因此只能使用**默认绑定**。

在这里要注意一个细节，如果使用严格模式(strict mode)，那么全局对象将无法使用默认绑定。

## 隐式绑定
```javascript
function  foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

obj.foo(); // 2
```

从上代码可以看出`obj`，调用位置会使用`obj`上下文来引用函数，因此，可以说函数被调用时候`obj`对象“包含”它。当函数引用有上下文对象时，**隐式绑定** 规则会把函数引用调用中的`this`绑定到这个对象中。所以`this.a`与`obj.a`在此时是一样的。

对象属性应用链中只有最顶层或者说最后一层会影响调用位置。如下:
```javascript
function foo() {
  console.log(this.a);
}

var obj2 = {
  a: 42,
  foo: foo
}

var obj1 = {
  a: 2,
  obj2: obj2
}

obj1.obj2.foo(); // 42
```

### 隐式丢失
**隐式丢失** 就是隐式绑定的函数丢失绑定对象，然后应用**默认绑定**，从而把`this`绑定到全局对象或者`undefined`中，取决于是否严格模式。

```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

var bar = obj.foo; // 函数别名

var a = 'oops, global';

bar(); // opps, global
```

或者在传入回调函数的时候：
```javascript
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  fn();
}

var obj = {
  a: 2,
  foo: foo
}

var a = 'oops, global';

doFoo(obj.foo); // opps, global
```

传入函数就是一种隐式赋值，所以结果和上一个例子也是一样的。

## 显式绑定
使用`call`和`apply`方法对对象进行强制调用函数。
```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
}

foo.call(obj); // 2
```

`call`和`apply`在绑定的机制基本是一样的，就是传参不一样，`call`为单独的参数，`apply`为数组。

## 硬绑定
硬绑定为显式绑定的一个变种，能够解决丢失绑定的问题，先思考下面代码：
```javascript
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
}

var bar = function() {
  foo.call(obj);
}

bar();
setTimeout(bar, 100); // 2

// 硬绑定的bar不能再修改它的this
bar.call(window);
```

可以创建一个可以重复使用的硬绑定函数：
```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

// 辅助绑定函数
function bind(fn, obj) {
  return function() {
    return fn.apply(obj, arguments);
  }
}

var obj = {
  a: 2
};

var bar = bind(foo, obj);

var b = bar(3); // 2 3
console.log(b); // 5
```

其实在ES5中已经提供了原生的`Fucntion.prototype.bind`的方法，可以直接使用：
```javascript
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
}

var bar = foo.bind(obj);

var b = bar(3);
console.log(b);
```

## new绑定
JavaScript中的new并不想其他oo语言那样会实例化一个类，只是使用new操作符调用普通的函数，在这个调用也会对this进行绑定。
使用new调用函数时，会自动执行下面操作：
1. 创建（或者说构造）一个全新的对象。
2. 这个对象会被执行[[原型]]连接。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

看下面代码：
```javascript
function foo(a) {
  this.a = a;
}

var bar = new foo(2);

console.log(bar.a);
```

像这样普通的new调用`foo(...)`时，会构造一个新的对象并把它绑定到`foo(..)`调用中的this上。这个就称为new绑定。

# 绑定优先级
绑定优先级按照下面的顺序来判断：

1. 函数是否在new中调用(new绑定)？如果是的话this绑定的是新创建的对象。
```javascript
var bar = new foo();
```
2. 函数是否通过call、apply(显示绑定)或者硬绑定调用？如果是的话，this绑定的是指定的对象。
```javascript
var bar = foo.call(obj2);
```
3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this绑定的是哪个上下文对象。
```javascript
var bar = obj.foo();
```
4. 若果都不是的话，适用默认绑定，严格模式下绑定到`undefined`，否则就绑到全局对象。
```javascript
var bar = foo();
```

# 绑定例外
在某些场景下this的绑定用上面的规制是判断不了的，可能认为是其他绑定规则，实际引用的是[默认绑定](#默认绑定)规则。

## 被忽略的this
如果把`null`或者`undefined`作为this的绑定对象传入call、apply或者bind中，这些值在调用时会被忽略，实际应用的是默认规则。
```javascript
function fOO() {
  console.log(this.a);
}

var a = 2;

foo.call(null); // 2
```

这种情况虽然并不多见，但是使用apply展开数组或者适用`bind(...)`进行[柯里化](https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96)的时候会用到。
```javascript
function foo(a, b) {
  console.log('a: ' + a + 'b: ' + b);
}

foo.apply(null, [2, 3]); // a: 2, b: 3

// 适用bind(..) 进行柯里化
var bar = foo.bind(nul, 2);
bar(3); // a: 2, b: 3
```

**注意：很多时候新建一个空对象`var n = Object.creat(null)`代替`null`更为安全。**

## 间接引用
间接引用上面介绍[隐式丢失](#隐式丢失)的时候也有举过例子，调用间接引用的函数也会造成绑定例外。
```javascript
function foo() {
  console.log(this.a);
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2
```

## 软绑定
软绑定可以实现硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。具体使用方式如下：
```javascript
function foo() {
  console.log('name：' + this.name);
}

var obj = { name: 'obj' };
var obj2 = { name: 'obj2' };
var obj3 = { name: 'obj3' };

// 稍后实现softBind
var fooOBJ = foo.softBind(obj);

fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2

fooOBJ.call(obj3); // name: obj3

setTimeout(obj2.foo, 10); // name: obj 应用了软绑定
```
可以看到，软绑定的`foo()`可以手动将this绑定到`obj2`或者`obj3`上，但如果应用默认绑定，则会将this绑定到obj中。

`softBind`的实现方式如下:
```javascript
if(!Function.prototype.softBind) {
  Function.prototype.softBind = function(obj) {
    var fn = this;
    var curried = [].slice.call(arguments, 1);
    var bound = function() {
      return fn.apply(!this || this === (window || global) ? obj: this);

      curried.concat.apply(curried, arguments)
    };

    bound.prototype = Object.create(fn.prototype);
    return bound;
  }
}
```
这个函数首先检查调用时候的this，如果this绑定到全局或者undefined中，那就把指定的默认对象`obj`绑定到this，否则不修改this。**ES5中的bind()已经实现此部分功能**。

# 箭头函数
前面接受的[四条规则](#绑定优先级)可以包含所有正常函数。但是ES6中的**箭头函数**则无法使用这些规则。
```javascript
function foo() {
  return (a) => {
    // this继承foo
    console.log(this.a);
  };
}

var obj1 = {
  a: 2
};

var obj2 = {
  a: 3
};

var bar = foo.call(obj1);
bar.call(obj2); // 2，不是3
```
`foo()`内部的箭头函数会捕获调用`foo()`时的this。由于`foo()`的this绑定到`obj1`,`bar`的this也会绑定到`obj1`，箭头函数的绑定无法被修改。(new也不行)

在ES6出现之前我们经常写的一种模式与箭头函数是几乎相同的：
```javascript
function foo() {
    var self = this;
    setTimeout(function() {
        console.log(self.a);
    }, 100);
}

var obj = {
    a: 2
};

foo.call(obj); // 2
```

`var self = this`和箭头函数从本质来说是想取代this的机制，如果代码中大多数使用`var self = this;`，那么应该完全使用词法作用域或箭头函数，抛弃this风格的代码。相反，如果使用this，则可以上方的绑定机制。
