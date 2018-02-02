---
path: /post/unit-test
title: 前端单元测试&Mocha指北
date: 2017-05-16 16:05:36
category:
- 前端
---

# 什么是单元-测试?
- 单元就是相对独立的功能模块，例如一个函数或者一个类。一个完整的模块化的程序，都应该是有许多个单元构成，单元能完成自己的任务，然后与其他单元进行交互 ，从而完成整个程序的功能。
- 而测试，就是测试啦。

所以单元测试通俗点讲就是对程序每个独立的单元分别测试，保证构成程序的每个模块的正确性，从而保证整个程序的正确运行。

# 为什么要写单元测试？
单元测试在前端还是不太普及的，因为刚开始前端也是偏向‘UI’那一块的，但随着node的发展，越来越多非‘UI’的前端代码，一个团队也越来越多人参加开发，如果系统一复杂，又或者你的模块提交到npm上面的话，一出错基本就GG了。
又或者你这样想，测试是逃不掉的，要么在dev上测试，要么在prod上测试，怎么都得测试，而且每次提交都要测试，为什么不写自动测试呢。我也相信大多数程序员也有写完跑跑看的习惯，而单元测试的log都直接打印到console里面，也省去了很多编译，打包的时间，又能满足各位的心理需求（猥琐脸），一举两得啊。

<!--more-->

# 干了这杯 "Mocha"
mocha是一个js测试框架，除此外，类似的测试框架还有Jasmine、Karma、Tape等，至于为什么要介绍Mocha？因为我只懂这一个。
上代码前还要普及一下两个概念
- [BDD（Behavior Driven Development）](https://zh.wikipedia.org/wiki/%E8%A1%8C%E4%B8%BA%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91)
BDD意为行为驱动开发，是一种敏捷软件开发技术，具体内容大家可以参考wikipedia的解释。
- [Assertion 断言](https://zh.wikipedia.org/wiki/%E6%96%B7%E8%A8%80_(%E7%A8%8B%E5%BC%8F))
断言，就是判断代码的执行结果与预期是否一致，不一致就抛出错误，说得简单点就是判断程序的真假。

## 举个例子
```javascript
// add.js
function add(a, b) {
    return a + b
}
module.exports = add
```
通常测试脚本要与测试源码同名，比如add.js的测试脚本就是add.test.js
```javascript
// add.test.js
const add = require('./add.js')
const expect = require('chai').expect

describe('加法函数测试', function() {
    it('1 + 1 等于 2', function() {
        expect(add(1, 1)).to.be.equal(2)
    })
    it('返回值是Number', function() {
        expect(add(1, 1)).to.be.a('number')
    })
})
```
上面代码块就是测试脚本，可独立运行，测试脚本中应该包括一个或多个`describe`块，每个`describe`块应包括多个`it`块。
`describe`是测试套件，这个方法需要传两个参数，第一个为测试套件的名称`('加法函数测试')`，第二个是执行函数。
`it`块是测试用例，表示一个单独的测试，是测试的最小单位，第一个参数是测试用例的名称('1 + 1 等于 2')，第二个是执行函数。

然后在terminal下执行`mocha add.test.js`
```terminal
$ mocha add.test.js

   加法函数测试
     √ 1 + 1 等于 2
     √ 返回值是Number
   2 passing (12ms)
```

如果我们改变一下`add.js`
```javascript
// add.js
function add(a, b) {
    return a * b
}
module.exports = add
```
然后再执行一下`mocha add.test.js`
```terminal
$ mocha add.test.js

   加法函数测试
     √ 1 + 1 等于 2
     1) 返回值是Number
   1 passing (8ms)
   1 failing

   1) 加法函数测试 返回值是Number:
       AssertionError: expected 2 to equal 3
       + expected - actual

       -2
       +3

       at Context.it(add.test.js:6:27)
```
这里也可以很明显看出哪个测试用例报错、还有报错的位置，这样在开发的时候开发人员就能很容易定位错误。

# 小结
从上面一个简单的例子可以看出，利用mocha实现自动化测试是很简单的。虽然前期开发需要花一点时间去写单元测试，但是后面提供的便利性足以将其弥补。
