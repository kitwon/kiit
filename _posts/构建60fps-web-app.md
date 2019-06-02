---
path: /post/60fps-web-app
title: 构建60fps-web-app
date: 2017-09-13 10:22:02
category:
- 前端
tags:
- chrome
- develop tool
- javascript
---

> 这篇文章大概5500字体左右，可能需要浪费5-10分钟去阅读。

----

> 现在javascript性能已经足够快了，但是很多时候我们的web app还是会出现卡顿的情况。这时候我们首先会想到是去优化我们的js代码，比如将for循环改为while，但其实这些微粒度的优化其实对性能提示是皮毛。看完google的[render performance](https://developers.google.com/web/fundamentals/performance/rendering/)对前端渲染优化有了一个新的认识。

## 几个重要概念

### 60fps与设备刷新率

目前大多数设备的刷新率都是60fps。玩游戏的都知道，如果当前刷新率在30-60fps，游戏运行会基本流畅，而少于60fps就会出现卡顿的状况了。web app基本也是如此，如果浏览器渲染帧突然下降，或者帧数低的情况，就出现程序运行卡的情况了。

其中每个帧的预算时间仅比 16 毫秒多一点 (1 秒/ 60 = 16.66 毫秒)。但实际上，浏览器有整理工作要做，因此您的所有工作需要在 10 毫秒内完成。如果无法符合此预算，帧率将下降，并且内容会在屏幕上抖动。 此现象通常称为卡顿，会对用户体验产生负面影响。

<!-- more -->

### pixel pipeline

影响浏览器渲染有很多因素，但是下面这5个关键的地方是我们可以控制的，也是像素至屏幕管道中关键的地方。
![pixel pipeline](http://kiit-1253813979.cosgz.myqcloud.com/%25E6%259E%2584%25E5%25BB%25BA60fps-web-app/pixel-pipline.jpg)

* Javascript。 js中的动画效果和一些dom操作。
* 样式计算(style)。 css匹配器的计算过程。例如`.nav__item > .slot`。
* 布局(layout)。dom元素应用了规则之后，浏览器就会对其进行大小及位置的计算，这时候就会触发布局，而布局由于改变dom大小及位置，所以对其他元素也会造成影响。
* 绘制(paint)。绘制就是填充像素的过程。大部分像素相关如文字、图片、阴影等都会触发绘制。绘制一般在层(layer)上面完成。
* 合成。层的概念一般都出现在设计上面，但是浏览器中也有层的概念，所以有时候我们一些错误的操作或者属性都会使层的渲染顺序出现错误。

## 关键渲染行为

从服务器返回一个html开始，可以分为以下几步(这里英文的过程分别对应开发工具中**performance**面板的表示

1. 解析html，生成dom树，这里显示为**Parser Html**
2. 然后根据页面的样式，将dom和css进行结合，此过程为**Recalculate Style**
3. 最后就生成渲染树，`display: none`或`:after`等伪元素都不会出现在渲染树上
4. 浏览器知道哪个css规则应用哪个dom元素后，就开始计算布局(计算元素占用多少空间，出现在什么位置)，此过程是**layout**
5. 确定位置后浏览器就开始对dom的样式及内容进行渲染，称为**paint**
6. dom渲染的时候，可能还会有图片资源，浏览器这时候就会将这些内容解码成内存，称为**Image Decode + Resize**
7. **paint**开始的操作都是在同一个层面中执行，但其实浏览器还会创建多个图层，并且对这些图层进行单独的绘制，这个过程称为**Composite Layers**
8. 这些操作在CPU中进行，执行完后上传到GPU中，最后显示到屏幕上

### 触发layout、paint的关键操作

我们知道一帧中就包含了上面的操作，但并不是所有改变网页外观操作都会触发上面的行为。回到**pipeline**，看看什么操作会分别触发什么行为。(下面会用数字代表对应图片上的位置)
![pixel pipeline](http://kiit-1253813979.cosgz.myqcloud.com/%25E6%259E%2584%25E5%25BB%25BA60fps-web-app/pixel-pipline.jpg)

* 第一种，通过css或者js进行了外观的更改(1)，这时浏览器就要重新计算元素的样式(2)，如果还更改了布局属性，元素的大小改变，必定会影响其他元素的位置，这时就要重新布局(3)，然后受影响的区域就需要重新绘制(4)，最后将所有东西合成在一起(5)。
* 第二种，仅改变绘制属性(1)，例如背景、文字颜色、阴影等(2)，由于这些操作没有改变布局，所以会跳过(3)，直接进行(4)(5)的操作。
* 第三种，通过改变样式(1)(2)，但是样式并没有对(3)(4)进行改动，所以会直接执行(5)的操作，例如`cursor: pointer`等属性。

## 优化程序

通过上面的介绍，我们知道影响帧数的主要是上面的几个渲染行为，但是要怎么知道是什么更改操作使帧数下降，就需要**develop tool**的帮助。

### performance panel

性能分析面板是chrome中开发者工具自带的一个功能，我们能在上面看到录制实践中，**pipeline**的具体运行情况。
![performance panel](http://kiit-1253813979.cosgz.myqcloud.com/%25E6%259E%2584%25E5%25BB%25BA60fps-web-app/performance.jpg)

1. 在(1)**overview**中，我们可以看到程序中大概的性能状况，fps、cpu、网络使用情况，还有对应的截图。一般情况，看到**cpu**部分一大片一大片的颜色就证明你的程序需要优化了。
2. (2)中的**main**部分，可以看到主进程中的活动，所有时间点执行的操作及渲染行为都能在这个部分找到，主要的性能分析也是围绕这里展开，一半看到**飙红**的地方就证明那里是要下手的地方。
3. (3)中则是对某个浏览器行为进行统计分析，能看到详细调用树和渲染层，找代码和**layer tree**都是(3)中。

由于网上教程大部分的教程都用较低的版本，所以很多教程中的面板都找不到，比如**painter**就需要开启**advance paint insturmentation**，所以教程中找不到就需要google一下或者看下[goole的官方教程](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/)。具体的使用方法就不赘述，反正看见**飙红就是要优化了**。

有工具之后，就可以针对具体的东西进行优化了，根据**pipeline**，我们其实可以知道优化点是哪几个了，javascript, style & layout, paint & composite。下面一个个分析下优化点。

### javascript

由于javascript在**pipeline**中，所以在渲染过程中执行javascript代码必定会造成卡顿，俗称的帧丢失。在渲染过程中需要执行js代码的操作最常见的例子就是**用js去操作动画**，还有**在浏览过程中做一些数据拉取及组装数据的操作**。所以针对这些问题，我们需要使用一些新的api去改进我们的app。

**1.使用[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)代替setTimeout和setInterval去执行动画。**
一开始我们就说到帧数的概念，一个app想要不卡顿，必须达到60fps每秒的速度才能保证，减去浏览器自己的行为，每帧留给javascript执行的时间大概剩下10ms左右。或许不断调用setTimeout或者setIntervarl可以自定义函数执行时间，但是由于javascript是单线程，活着其他堆在栈中的代码会突然插入，导致函数执行中断。这时候raf就能解决这个问题了。具体使用方法可以自行查看[文档](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)。

**2.使用[web worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker)去进行一些多线程的操作。**
使用web worker后，浏览器会另起一个线程，所以就不会妨碍主线程中的pipeline了。我们可以在一些加载列表的场景中使用，比如用户在浏览，但是你想用这些时间去load一些数据回来，然后渲染页面，这时候worker会执行ajax，也不会妨碍到主线程执行。

### style & layout

样式和布局也是帧里面的一部分，复杂的选择器或者某些js操作触发了强制布局，都会使性能下降，下面可以用这几个方法避免这些问题。
**1.操作数量多的dom时，减少选择器的复杂度。**
通常做项目的时候，我们一般都是操作少数的dom，但是某些特殊情况下可能要操作上千个dom(当然这不太现实)，这时候保持选择器的简洁就相当重要了，一个多级选择器计算时间足以超出10ms，所以，保持css中选择器的简洁是十分重要的。

**2.避免布局反复FSL**
什么是布局反复，一帧的流程应该是按照**pipeline**的执行顺序去执行的，但是某些错误的javascript读写操作就很容易造成布局反复，如下代码

```javascript
var elms = document.getElementByTagName('p')
var block = ducoment.getElementById('block')

for (let i = 0; i < elms.length; i++) {
  var height = block.offsetHeight
  elms[i].style.height = height
}
```

在这段代码中，由于属性的读取操作`offsetHeight`会触发layout布局，然后下面设置高度的属性会触发style修改样式，两个在一个循环中就会造成布局反复，从而造成性能的损失。在**performance panel**中，缩小范围，如果看见layout中有红色的小三角，那么就是触发了FSL了，点进详情就能看到代码运行的地方在哪里了。

### paint & composite

绘制和合成是一个相对比较复杂的流程，大多数样式更改都会触发这个过程，但是如果是大批量的元素或者一个复杂的动画绘制，在主线程中必定会造成性能问题。在这里就引入图层这个概念，由于浏览器的呈现器不在主线程中，所以图层会单独绘制，然后再和树进行合成。但如果层多的话，合成时间也会加长，所以使用层和限制层的数量也是需要注意的问题。

#### 怎么看到网页的分层

具体看[教程](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#paint-profiler)
进去搜**View paint profiler**

1. Enable advanced paint instrumentation.(这个选项在上图面板一，点击右上角的小齿轮)
2. Select a Paint event in the Main section.(教程里面看图)

#### 怎么生成层

1. 社区中比较常见的`transform: translate3d(0, 0, 0)`、`transform: translateZ(0)`。虽然会有一些性能的浪费，但是好像是现在比较好的解决方法了。
2. 使用css新属性[`will-change: transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)，浏览器支持度一般般。

能够看完整篇的同学估计耐性都不错。通过一些基本的介绍，基本可以了解怎么查看和修复app的渲染性能问题了，不过使用现代的开发框架如**react**、**vue**、**angular**都很少会出现**FSL**的问题了，因为很大部分的**layout**动作都直接被`rerender`，但是一些比较旧的用dom操作些的APP或多或少都会出现上面的问题。大家可以看看自己的APP有没有达到要求。不说了，我去改代码了。
