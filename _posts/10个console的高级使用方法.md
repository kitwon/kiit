---
path: /post/10tips-for-console
title: 10个console的高级使用方法
date: 2018-03-19 10:07:34
category:
- 前端
---

> 原文译自[10 Tips for Javascript Debugging Like a PRO with Console](https://medium.com/appsflyer/10-tips-for-javascript-debugging-like-a-pro-with-console-7140027eb5f6) - Yotam Kadishay

在日常开发里，我们经常需要使用`console`调试我们的代码，但是使用仅仅是用来打印参数数据。在这篇文章中，将会介绍如何一些`console`的高级用法去更好的做调试工作和定位问题。

我们都知道`console`的几个常用的方法

```javascript
console.log('hello world'); // 打印信息或者数据
console.info(‘Something happened…’); // 和console log一样
console.warn(‘Something strange happened…’); // 打印警告信息
console.error(‘Something horrible happened…’); // 打印错误信息
```

除这些简单的使用外，下面几个`console`的用法希望能帮助你更好的调试你的应用。

<!-- more -->

## Tip #1 console.trace()

如果你想知道日志的函数执行位置，使用`console.trace()`可以打印栈堆跟踪信息。

![trace](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/trace.png)

## Tip #2 console.time() && console.timeEnd()

如果你想知道某段程序的执行时间，可以使用`console.time()`和`console.timeEnd()`打印时间间隔。

![time](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/time.png)

## Tip #3 console.memory()

如果遇到一个相当棘手的性能问题，或者在寻找一个内存泄露的位置，可以尝试使用`console.memory(// property, not a function)`查看栈大小信息。
![memory](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/memory.png)

## Tip #4 console.profile(‘profileName’) & console.profileEnd(‘profileName’)

这个不是标准里面的方法，但是浏览器支持比较广泛。你可以使用这两个方法让浏览器的性能面板记录start至end的性能数据。使用这两个函数，能够更精准地定位你想要获取的数据。

## Tip #5 console.count("STUFF I COUNT")

在一些经常重复调用的代码中，使用`console.count()`可以记录该函数的执行次数。
![count](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/count.png)

## Tip #6 console.assert(false, “Log me!”)

当需要条件判断打印日志时候，可以使用`console.assert(condition, msg)`代替if-else。当`condition` 为false的时候就会打印出信息。
⚠️在Node.js中使用会抛出断言错误。

![assert](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/assert.png)

## Tip  #7 console.group(‘group’) & console.groupEnd(‘group’)

在一些写很多`console.log()`的情况下，你可能需要将日志分组。这时候就可以使用`console.group(name)` 去将日志分组，使用这个函数后，日志就会按层级打印。使用`console.groupEnd()`就能结束掉当前分组，在同级重新新建一个分组。

![group](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/group.png)

## Tip #8 字符串替换

使用`console`的时候可以使用字符串替换去合并变量，引用类型有下面几个**(%s = string, %i = integer, %o = object, %f = float)**

![substitutions](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/substitutions.png)

## Tip #9 console.clear()

当代码里面很多`console`的时候，你可能会需要`console.clear()`清理一下前面的log

![clear](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/clear.png)

## Tip #10 console.table()

好东西留到最后。使用`console.table()`，可以把对象打印成一个好看的表格。

![table](http://kiit-1253813979.file.myqcloud.com/10tips-for-console/table.png)

希望这几个能让你平时的调试工作能更高效和有趣。
