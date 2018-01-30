---
title: 深入学习javascript-类
date: 2017-07-20 14:47:47
categeoies:
- javascirpt
tags:
- 编程
- javascript
---

# 类理论
类／继承描述了一种代码的组织结构形式，这个理论在软件设计中一直作为一个主导的角色。通过学习类理论，能为更好地学习js中的设计模式和对js中原型链的理解打下基础。

类是在软件中对真实世界问题领域的建模方法。如一个经常看见的交通例子。**汽车**可以被看作**交通工具中的一种**，所以在软件开发时可以定义一个`Vehicle`类，`Vehicle`中包含推进器（引擎）、载人能力等方法。定义`Car`时，只要声明它继承或者拓展`Vehicle`这个基础定义就行了，其他交通工具如船、飞机也可以继承`Vehicle`。**这就是类的实例化与继承**。

类的另外一个核心概念是**多态**，这个概念是说夫类的通用行为可以被子类更特殊的行为重写。

javascript中也有类中的`new`和`instanceof`，还有ES6中的`class`关键字，但这些并不是说明js中有**类**的。javascript中只是为了满足类的设计需求而提供一些类似的语法。

## js中实现类复制(混入)
javascript中的对象机制并不会自动执行复制行为，简单来说javascript中只有对象，并不存在可以实例的类。一个对象并不会复制一个对象，只会把它关联起来(prototype)。

<!-- more -->

### 显式混入
显示混入在其他库或者框架中一般被称为`extend`，在这方便理解会使用`mixin`。
```javascript
// 前面的Vehicle和car的例子
function mixin(sourceObj, targetObj) {
  for(var i in sourceObj) {
    if(!(i in targetObj)) {
      targetObj[i] = sourceObj[i];
    }
  }

  return targetObj;
}

var Vehicle = {
  engines: 1,
  ignition: function() {
    console.log('Turning on my engines.');    
  },
  drive: function() {
    this.ignition();
    console.log('Steering and moving forward.');
  }
}

var Car = mixin(Vehicle, {
  wheels: 4,
  drive: function() {
    Vehicle.drive.call(this);
    console.log('Rolling on all' + this.wheels + 'wheels!');
  }
})
```

还有一种显示混入的变体叫**寄生继承**
```javascript
function Vehicle() {
  this.engines = 1;
}
Vehicle.prototype.ignition = function() {
  console.log('Turning on my engines.');
}
Vehicle.prototype.drive = function() {
  this.ignition();
  console.log('Steering and moving forward.');
}

// 寄生类 car
function Car() {
  var car  = new Vehicle();

  car.wheels = 4;
  var vehDrive = car.drive;

  car.drive = function() {
    Vehicle.call(this);
    console.log('Rolling on all' + this.wheels + 'wheels!');
  }

  return car;
}

var myCar = new Car();
myCar.drive();
```

### 隐式混入
隐式混入就是改变在一个函数体内执行另外另一个函数的方法。
```javascript
var foo = {
  cool: function() {
    this.count = this.count ? this.count++ : 1;
    console.log(this.count);
  }
}

foo.cool(); // 1

var bar = {
  cool: function() {
    foo.cool.call(this);
  }
}

bar.cool(); // 1, 数据不共享
```

# prototype-原型
JS中，当试图引用对象属性时候就会触发`[[GET]]`操作，如果在对象属性中没有找到，就会使用对象的`[[prototype]]`链。JS大部分复杂类型都是`object`，所以`[[prototype]]`“尽头”应该是`Object.prototype`，里面包含了许多原生方法，如`toString`或`valueOf`。

## 如何工作
JS和其他OO语言并不同，JS中并没有类作为对象的抽象模式，JS中只有对象，所以当new一个对象时候，并不是复制一个类函数，而是将目标对象的`prototype`关联到新对象的`prototype`中。

# 小结
`prototype`部分书本总结得比较清楚，想知道更多细节的同学可以参考**you dont know javascript**的5.1-5.4章节。
* 访问对象时候都会触发对象的[[GET]]操作，如果没有找到属性的话会继续找[[Prototype]]链。
* 普通对象的原型链顶端都是`Object.prototype`
* `new`调用函数时只会关系到对象，而不会复制