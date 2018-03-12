---
path: /post/vue-jest-test
title: 在vue项目中使用jest进行单元测试
date: 2017-08-18 17:10:36
category:
- 前端工具
tags:
- unit test
- vue
- javascript
---

在之前已经写过一篇关于前端单元测试的文章，相关概念就不作阐述了，有兴趣或者有需求的同学可以在往期找一下。然后这里简单介绍一下[jest](http://facebook.github.io/jest/)，这是一个[Facebook OpenSource](https://code.facebook.com/projects/)的一个开源项目。项目已经集成好了一些测试相关的框架的代码，主打的是零配置测试平台（react中应该算是零配置，其他项目还是要手动配置一下的），里面一个比较好地方是支持**快照测试**(为dom结构生成一个快照，每次测试都对比dom结构)。其他一些好用的地方可以自己查看文档，有中文。

# 配置
首先是安装jest, jset-vue-preprocessor(jest的一个插件，用来解析'.vue'文件的)。
```shell
$npm install jest jest-vue-preprocessor --save-dev

$yarn add jest jest-vue-preprocessor --save
```

<!-- more -->

## package.json
下面的配置都在**package.json**文件中配置。

在文件最底部添加下面代码
```javascript
{
  // ...
  "jest": {
    // 配置文件拓展名
    "moduleFileExtensions": [
      "js",
      "vue"
    ],
    // 匹配webpack中配置的alias
    "moduleNameMapper": {
      "^vue$": "vue/dist/vue.common.js",
      "^@(.*)$": "<rootDir>/src$1"
    },
    // 编译工具
    "transform": {
      ".*\\.(vue)$": "<rootDir>/node_modules/jest-vue-preprocessor",
      ".*": "babel-jest"
    }
  }
}
```

<!-- more -->

然后在上面`script`中添加一条新的命令
```javascript
{
  // ...
  "test": "./node_modules/.bin/jest"
}
```

然后就配置好了，很快，很舒服。

# 跑个测试
首先，我有个vue组件cell，一个简单的列表item组件，代码如下
```vue
<template>
  <a class="ui-cell" :href="href">
    <div class="ui-cell-wrapper">
      <slot name="icon">
        <i v-if="iconClass" :class="iconClass"></i>
      </slot>
      <slot name="title">
        <div class="ui-cell-title">
          <div class="ui-cell-text" v-text="title"></div>
          <div class="ui-cell-label" v-if="label" v-text="label"></div>
        </div>
      </slot>
      <div class="ui-cell-value" :class="{ 'isLink': isLink }">
        <slot>
           <div v-text="value"></div>
        </slot>
      </div>
      <i class="icon-arrow-right" v-if="isLink"></i>
    </div>
  </a>
</template>

...

<script>
  export default {
    name: 'ui-cell',
    props: {
      to: [String, Object],
      iconClass: String,
      title: String,
      label: String,
      value: {
        default: ''
      }
    },
    computed: {
      href () {
        if (this.to && !this.added && this.$router) {
          const resolve = this.$router.match(this.to)
          if (resolve.matched.length <= 0) {
            return this.to
          }

          this.$nextTick(() => {
            this.added = true
            this.$el.addEventListener('click', this.handleClick)
          })
          return resolve.path
        }

        return this.to
      },
      isLink () {
        return !!this.to
      }
    },
    methods: {
      handleClick (e) {
        e.preventDefault()
        this.$router.push(this.href)
      }
    }
  }
</script>

```

然后编写测试文件

```javascript
import Vue from 'vue'
import Cell from '@/components/cell'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/foo',
    component: Cell
  }
]
const router = new VueRouter({
  routes
})

const mockFn = jest.fn()
Cell.methods = {
  handleClick(e) {
    mockFn.mockReturnValue(true)
  }
}

const Constructor = Vue.extend(Cell)
const vm = new Constructor({
  propsData: {
    title: 'cell1',
    value: 'value1',
    label: 'label1'
  }
}).$mount()

const vm2 = new Constructor({
  router,
  propsData: {
    title: 'cell2',
    value: 'value2',
    to: '/foo'
  }
}).$mount()

const vm3 = new Constructor({
  propsData: {
    title: 'cell3',
    value: 'value3',
    iconClass: 'icon-test'
  }
}).$mount()

describe('Cell component', () => {
  test('render currect dom', () => {
    expect(vm.$el).toMatchSnapshot()
    expect(vm2.$el).toMatchSnapshot()
    expect(vm3.$el).toMatchSnapshot()
  })

  test('router action currectly run', () => {
    vm2.$nextTick(() => {
      vm2.$el.click()
      expect(vm2.href).toBe(vm2.to)
      expect(mockFn()).toBe(true)
    })
  })
})
```

然后跑一下命令
```shell
$npm run test

> jest-test@1.0.0 test /Users/kit/projects/jest-test
> jest

 PASS  test/unit/Cell.spec.js
  Cell component
    ✓ render currect dom (8ms)
    ✓ router action currectly run (2ms)

Snapshot Summary
 › 3 snapshots written in 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   3 added, 3 total
Time:        2.295
```

# last
jest给我们提供了一个便捷的测试环境，简单的几个配置项，即可完成编译，不像mocha或jasmine需要其他`node module`配合完成测试的工作。个人认为fb还是做到了他希望的，让测试变得简单，让开发者有更多的时间去开发。至于自动化测试的好处这里就不再赘述了，有兴趣的朋友可以自行baidu、google。
