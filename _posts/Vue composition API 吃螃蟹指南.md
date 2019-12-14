---
path: /post/vue-composition-api
title: Vue composition API 吃螃蟹指南
date: 2019-10-21 10:18:00
category:
- 前端
tags:
- Vue
---

本文是Vue中3新的Composition API简单介绍及使用指南，具体内容可以自行阅读官方提供的[RFC](https://vue-composition-api-rfc.netlify.com/#summary)。

附上分享PPT
> vue-composition-api slides — https://slides.com/kitwang/vue-composition-api/fullscreen

## Motivation
所有API都不是偶然设计出来的，所以作者的设计的时候必定有他的含义，我们先看看文档中提到的两个设计动机。

* 逻辑复用及代码整理
* 更好的Typescript支持

像Vue这种现代框架已经很好解决了组件复用这一问题了，但是随着时间推移，你会发现组件里面的状态和逻辑也越来越多，越来越难维护，以一个普通的搜索组件为例，使用普通的语法就像下面的代码那样，用`data`定义组件的state，在`methods`里面定义组件的方法，看起来就像下面

<!-- more -->

```javascript
export default {
  name: 'SearchComponent',
  data() {
    return {
      🔍
    }
  },
  methods: {
    🔍
  }
}
```

我们可能还需要一个过滤搜索条件的方法

```javascript
export default {
  name: 'SearchComponent',
  data() {
    return {
      🔍
      📑
    }
  },
  methods: {
    🔍
    📑
  }
}
```

可以看到，处理同样逻辑的方法被划分在`data`和`methods`里面，我们可以回想一下除此之外定义一个组件有多少个组件选项。

* components
* props
* data
* computed
* methods
* lifecycle methods

处理一个逻辑，状态及方法就可能分离在这6个地方，维护时间一长了，很有可能看到这种千行代码的组件了。（Put some demo）

使用 **Composition API** 的话会变成什么样子呢，还是以上方搜索组件举例

```javascript
function 🔍() { // Search state & methods }
function 📑() { // Sort state & methods }

export default {
  name: 'SearchComponent',
  setup() {
    🔍
    📑
  }
}
```

组件状态及方法单独分离出来了！下面我们接着看一下如何用`setup`代替以前的方法。

## How

我们还是以上面搜索组件为例，我们先转化成较为真实的代码

```html
<template>
  <div class="search">
    <form>
      <input v-model="searchValue" type="text" />
      <button @click="search"></button>
    </form>

    <ul class="result">
      <li class="result__item" v-for="item in filterData" :key="item.id">
        {{ item.name }}
      </li>
    </ul>

    <span v-if="loading">loading</span>
  </div>
</template>

<script>
export default {
  data() {
    searchValue: '',
    loading: true,
    searchResult: []
  },
  computed: {
    filterData() {
      return searchResult.filter(i => i.id > 3)
    }
  },
  methods: {
    async search() {
      this.loading = true
      const { data } = await fetch('/search', body: this.searchValue.trim())
      this.searchResult = data.toJSON()
      this.loading = false
    }
  },
  mounted() {
    // Get initial data
    this.search()
  }
}
</script>
```

逻辑不复杂，只有一个简单的搜索方法和一个过滤数据的computed方法，组件挂载的时候执行下搜索方法初始化列表数据。我们看一下这部分代码在 **Composition API**下是怎么工作的。

```html
<template>
  <div class="search">
    <form>
      <input v-model="state.searchValue" type="text" />
      <button @click="search"></button>
    </form>

    <ul class="result">
      <li class="result__item" v-for="item in filterData" :key="item.id">
        {{ item.name }}
      </li>
    </ul>

    <span v-if="state.loading">loading</span>
  </div>
</template>

<script>
import { reactive, computed, onMounted, toRef } from 'vue'

export default {
  setup() {
    // Initial State
    const state = reactive({
      searchValue: '',
      loading: true,
      searchResult: []
    })

    // Computed
    const filterData = computed(() => state.searchResult.filter(i => i.id > 3))

    // Methods
    async function search() {
      state.loading = true;
      const { data } = await fetch('/search', body: this.searchValue.trim())
      state.searchResult = data.toJSON()
      state.loading = false;
    }

    // Lifecircle hook
    onMounted(() => {
      search()
    })

    return { ...toRef(state), filterData, search }
  }
}
</script>
```

从这里我们可以看到两个明显的变化：

1. 组件从原本的**选项配置**变成了**函数定义**
2. 由于1中的改变，组件也不需要使用`this`去指定当前组件执行的上下文

这是组件逻辑复用重要的一步。

## 逻辑分离和复用

上方简单介绍了如何使用新的API去重构我们的组件，但是还没真正的感受到它的魅力，我们继续拿上方重写好的组件继续改造，把逻辑抽离出来进行复用。我们一开始就知道组件中有**搜索**和**过滤搜索条件**两部分重要功能，所以我们目标就是把这两部分逻辑抽离出来。

```javascript
// Search logic
function useSearch() {
  const searchValue = ref('')
  const searchResult = ref([])
  const loading = ref(true)

  function search() {
    loading.value = true;
    const { data } = await fetch('/search', body: this.searchValue.trim())
    searchResult.value = data.toJSON()
    loading.value = false;
  }

  onMounted(() => search());

  return { searchValue, searchResult, loading, search }
}

// Filter logic
function useFilterSearchResult(searchResult) {
  const filterData = computed(() => searchResult.value.filter(i => i.id > 3))
  return { filterData }
}

// Component Instance
export default {
  setup() {
    const search = useSearch()
    return { ...search, ...useFilterSearchResult(search.searchResult) }
  }
}
```

从这里我们已经完全将组件中的状态都独立出来了，到此已经大概将**Composition API**运行方式及使用方式大概介绍完毕了，我们知道了如何把组件的状态单独分开维护，以及使用这些如何使用这些API去组合所有状态及方法。

## 缺点
聊完 **Composition API** 的优点，那么我们来聊下它的缺点。Vue中的是使用**依赖追踪**的方式去通知变更的，所以在开发Vue组件的时候我们只需要用`this.x = y`重新赋值某个状态，DOM Tree就会自动响应变更。这是Vue的优势，但在`Composition API`中就变了一个**需要重点关注的点**，如果使用不好，甚至会变成缺点。

我是可以从试着从Vue的实现原理去查找此原因。Vue2中是使用[`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)，而Vue3则使用了[`Proxy`](http://es6.ruanyifeng.com/#docs/proxy)，但无论使用哪种方法，我们在访问和设置某个`state`的时候实际是调用了他们**getter/setter**的方法，但是这个state作为一个**返回值**或者**参数**的时候，它实际是作为一个**值**传递到了另外要给方法中，所以他的**getter/setter**将会丢失，数据无法响应。这是什么意思呢，我们可以看到下面的例子

我们先建立一个获取鼠标坐标的hook

```javascript
function useMousePostion() {
  const pos = reactive({
    x: 0,
    y: 0
  })

  onMount(() => {
    // Add Event Listener
  })

  return pos
}

// comsuming component
export default {
  setup() {
    const { x, y } = useMousePosition()

    // 响应丢失
    return { x, y }

    // 响应丢失
    return { ...useMousePositon() }

    // It's work
    return {
      pos: useMousePosition()
    }
  }
}
```

这是为什么呢？这涉及到Javascript里面的一些基础知识 **引用传递及值传递**

### 引用传递及值传递

思考下面的代码

```javascript
function changeStuff(a, b, c) {
  a = a * 10
  b.item = 'changed'
  c = { item: 'changed' }
}

var num = 10
var obj1 = { item: 'unchanged' }
var obj2 = { item: 'unchanged' }

changeStuff(num, obje1, obj2)
console.log(num)
console.log(obj1.item)
console.log(obj2.item)
```

```shell
10
changed
unchanged
```

这说明Javascript中参数传递是以值传递的方式进行传递的，而传递的内容是**它自己本身的引用值**

用官方提供的图表示可能更为直观（左为引用传递，右为值传递）

![pass-by-reference-vs-pass-by-value-animation](https://kiit-1253813979.cos.ap-guangzhou.myqcloud.com/vue-composition-api/pass-by-reference-vs-pass-by-value-animation.gif)

所以上面响应丢失的问题就可以解释了

```javascript
export default {
  setup() {
    // 这里只取了useMousePosition返回值的引用值
    // 而值里面的getter/setter丢失
    const { x, y } = useMousePosition()

    // 响应丢失
    return { x, y }

    // 响应丢失
    // 同上
    return { ...useMousePositon() }

    // It's work
    // 这里的pos实际是useMousePositon里面的pos的值
    // 所以pos.x与pos.y的属性依旧存在
    return {
      pos: useMousePosition()
    }
  }
}
```

## 怎么解决这些问题

### 使用官方提供的API

看上面的代码，官方有提供有两种方式解决这个问题，我们修改一下`useMousePosition`，首先是`toRefs`

```javascript
function useMousePostion() {
  const pos = reactive({
    x: 0,
    y: 0
  })

  onMount(() => {
    // Add Event Listener
  })

  return toRefs(pos)
}

// comsuming component
export default {
  setup() {
    // Work!
    const { x, y } = useMousePosition()
    return { x, y }

    // Work
    return { ...useMousePositon() }
  }
}
```

另外一个是使用`ref`去初始化state

```javascript
function useMousePostion() {
  const x = ref(0)
  const y = ref(0)

  onMount(() => {
    document.body.addEventListener('mousemove', (e) => {
      x.value = e.x
      y.value = e.y
    })
    // Add Event Listener
  })

  return { x, y }
}

export default {
  setup() {
    // Work!
    const { x, y } = useMosuePosition()
    return { x, y }

    // Work!
    return { ...useMousePostion() }
  }
}
```

### 使用Typesciprt

使用Typescript能严格控制函数参数的类及以及确定函数返回值，结合 **Composition** 会发生怎样的化学反应呢，我们看以下代码，还是刚才的`useMousePosition`例子

```typescript
function useMosuePosition1():  {
  const pos = reactive({
    x: 0,
    y: 0
  })

  return pos
}

function useMousePostion2() {
  const x = ref(0)
  const y = ref(9)

  return { x, y }
}

export default {
  setup() {
    // Code IntelliSense
    // x is number
    // y is number
    const { x, y } = useMousePosition1()

    // x is Ref<number>
    // y is Ref<number>
    const { x, y } = useMousePosition2()
  }
}
```

而且 **Compotion API** 的出现的另外一个原因就是为了解决在2中一直被诟病的typescript支持问题，使用函数代替配置的形式能更好地支持类型推断，不会出现像以前拓展了Vue的prototype而推断不出里面的实例方法。

## Summary 总结

新的 **Composition API** 让我们有了更好的方式去组织我们的组件状及方法，但是也像官方介绍文档说的一样 **More Flexibility Requires More Discipline**，获得更多灵活性同时需要更多的条件去约束。

不管是**React Hooks**还是**Vue Componsition API**，我们都可以知道前端工程会变得越来越复杂，前端的架构设计也在不断的进步，现代框架对前端Javascript基本知识是越来严格，各种软件设计模式在前端工程中也会越来越重要。

希望此文对大家吃螃蟹有所启发，共勉之 🙆‍♀️

> [Vue Composition API RFC](https://vue-composition-api-rfc.netlify.com/#summary) —— Vue Composition API介绍
> [Vue Compostion Repository](https://github.com/vuejs/composition-api) —— Vue Composition API Github仓库
> [求值策略](https://zh.wikipedia.org/wiki/%E6%B1%82%E5%80%BC%E7%AD%96%E7%95%A5) —— 引用传递、值传递介绍
