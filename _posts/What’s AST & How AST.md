---
path: /post/what-and-how-ast
title: What's AST & How AST
date: 2019-05-25 10:42:00
category:
- javascript
tags:
- babel
- AST
---

目前JavaScript开发者都会依赖很多如*Babel*、*Eslint*等工具去做开发，但会遇到一些小问题需要打下断点debugger一下的时候，这时我们就不知道这些工具里面是如何运作的，如何去做一个调试。 So，在此文章中我们会去学习这些工具内部是如何运作的。通过这篇文章，我们可以学习到：
1. 理解代码转换工具如Babel等是如何工作的。
2. 获得这些工具的调试能力。
3. 使用转换工具去重构现有代码。

下面我们会通过两个小例子去解释这些工具是如何运作的，以及如何编写转换语法的代码。

TODO:

* 使用Babel-Plugin转换JavaScript代码 —— Babel
* *code-mods*去重构现有的代码，如ES5 to ES6的代码 —— jscodeshift

<!-- more -->

## What’ AST
现在的构建工具Webpack、Babel、Uglifyjs等工具都是通过操控和分析*AST*去完成代码转换的工作。那么什么是*AST*呢？

AST译为抽象语法树，我们的源码在编译中会转为一组树数据结构，如`var foo = 'bar'`的树结构：

![demo1](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/what-and-how-ast/ast-demo.png)

图中会指出这一行函数里面属于什么类型，左边是什么方法，方法的值是什么等，然后会以*JSON*的样式输出整个文件里面的语法结构，从下图可以看出，每个节点都有*type*这个key，那么各位聪明看官应该可以猜到，假如我们需要操作AST，那么我们需要做的大概就是循环匹配类型，修改，输出等动作。


## How AST
知道了什么是AST，那么我们需要看构建工具是怎么工作，其实这些工具整个工作流程就是一个文件I/O的过程，里面可以分为4步：
* Parse (I) —— 分析语法树
* Traverse (I) —— 穿透代码（可以理解为循环语法树）
* Manipulate (O) —— 操控代码
* Generate code (O) —— 输出文件

其中*I*的部分很多工具都帮我们完成了，我们只需要关注*O*这一部分，我们需要匹配哪些代码，对他们做什么转换，怎么输出。

那么我们怎么知道我们需要匹配代码的类型是什么呢，或者整个文件的语法树是怎样的呢？我们可以在[AST explorer](https://astexplorer.net/)查看对应的语法树：

![demo-2](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/what-and-how-ast/ast-demo2.png)

点击对应的语法位置，就会跳到树的位置，以便查找对应的类型，比如这里我们点击*return*，树中就会显示类型为*ReturnStatement*，里面的argument就是*StringLiteral*，即`'bar'`。后面我们会常用这个工具去查对应的语法类型。

### Visitor
上面所说的进入、查找某个类型，实际是**访问**他们。Visitor是一个用于AST遍历的模式，简的来说所有工具都是用这个模式去获取和处理AST，处理方法也很简单，我们只需要告诉工具我关心的节点，然后传入一个回调函数。如下例子：

```javascript
// In:
// var foo = 'bar'
const myVisitor = {
  StringLiterial(path) {
    path.node.value = 'baz'
  }
}
// Out:
// var foo = 'baz'
```

## 使用Babel-Plugin转换JavaScript代码
下面我们会开发一个Babel-Plugin，插件功能是移除生产环境上面的debugger代码。假设我们项目里面有以下代码

```javascript
function isTruthy(x) {
  debugger;
  return Boolean(x);
}

console.log(isTruthy({}));
```

对应Plugin的代码也很简单，获取到对应节点然后执行回调函数，把对应的`debugger`代码remove就可以了。

```javascript
export default function(babel) {
  const { types: t } = babel;

  return {
    name: "ast-transform", // not required
    visitor: {
      DebuggerStatement(path) {
        path.remove();
      }
    }
  };
}
```

这部分操作我们可以在 [Ast Explorer](https://astexplorer.net/) 中操作，选择*Transform*中的*Babel V7*，然后把插件代码粘贴到下方箭头的位置就可以了，右下角就是转换完成的代码。

![demo-3](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/what-and-how-ast/ast-demo3.png)

从代码上面看逻辑其实不复杂，里面其实有固定的几步
1. 返回visitor对象
2. *指定文件内容中你关心的节点*
3. 操作节点

其中需要关注的内容就是*找到合适的节点type值*，这个我们可以通过上方提到的 [Ast explorer](https://astexplorer.net/) 去找到对应类型，把代码贴上去点击函数或者方法位置，done～🌝。

## 使用jscodeshift重构现有代码
很多时候我们需要重构现有项目的代码，但是Babel的功能是将ES next的代码转为现代浏览器支持的ES版本，这时候我们就需要一个纯碎一点的工具去做这个事情了，那么Facebook的 [jscodeshift](https://github.com/facebook/jscodeshift)是个很好的选择。

比如这里我们把旧代码里面的`var`转为`let`，我们有以下代码
```javascript
function isTruthy(x) {
  var bar = 1;
  var baz = 2;
  const foo = 3;
}
```

下面是处理的代码，这里我们用上面*How AST*提到的I/O工作流去分析下方的代码，分析内容请看注释

```javascript
export default function transformer(file, api) {
  const j = api.jscodeshift;

  // 分析语法树，转为AST，属于I中Parse阶段
  return j(file.source)
    // find和foreach分别为查找和循环node节点
    // 属于I重的Traverse阶段
    .find(j.VariableDeclaration, { kind: 'var' })
    .forEach(path => {
      // 找到匹配节点后对节点进行操控，属于O中的Manipulate阶段
    	const letStatement = j.variableDeclaration('let', path.value.declarations);
    	path.replace(letStatement);
    })
    // toSource告诉转换工具需要输出
    // 属于O中的Generate code阶段
    .toSource();
}
```

然后回到[jscodeshift](https://github.com/facebook/jscodeshift)，把*transform*改为*jscodeshft*。转换效果如下图。

![demo-4](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/what-and-how-ast/ast-demo4.png)

Well done🎉

## 资源
> [Babel · The compiler for next generation JavaScript](https://babeljs.io/) —— Babel
> [babel-handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)  —— babal插件开发教程
> [jscodeshift](https://github.com/facebook/jscodeshift)  —— Facebook推出的代码重构工具
> [AST explorer](https://astexplorer.net/) —— 在线查看、转换AST工具
