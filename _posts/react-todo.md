---
post: post/react-todo
title: React-todo demo
date: 2016-03-02 16:07:12
category:
- js framework
tags:
- React
- Webpack
- js框架
---

好久之前做得一个todo demo，使用了最近较火的react和webpack，由于公司电脑各种不能装，所以没用上es6（各种限制太惨了），在这顺便做个记录，年纪大记性太差了。

<!--more-->


### 小科普
什么是React? 按官方解释，框架属于MVC中的view层，由于其设计思想独特，性能出众，逻辑简单，所以上年开始越来越多人关注。
至于Webpack，各位官人从名字应该可以猜出，是个打包工具，但又不止是个打包工具，是一个支持模块化的打包工具，两个字就可以形容它的优点了，就是暴力，究竟有多暴力，下面demo就为各位官人揭晓！


### Demo功能需求
* input输入内容，回车键或按钮增加一条todo
* checkbox添加完成状态
* 移动到列表时显示删除
* 显示todo总数和已经完成数
* list全选
* 清除已完成
* 添加动画效果


### 开始
开始需要npm安装一下等下要用的packages，如果是checkout我的demo，就动动手指头，install一下，我的demo地址是[https://github.com/kitwon/react-todo](https://github.com/kitwon/react-todo)
``` bash
$npm install
```


#### 配置webpack
所有东西安装完成之后首先就是配置[webpack](http://webpack.github.io/docs/)
``` javascript
var path = require('path');

module.exports = {
	entry : "./src/entry.js",
	output : {
		path : path.join(__dirname, "out"),
		publicPath : "./out/",
		filename : "bundle.js"
	},
	externals : {
		react : "React"
	},
	module : {
		loaders : [
			{ test : /\.js$/, loader : "jsx",include: /src/ },
			{ test : /\.css$/, loader : "style!css" },
			{ test : /\.less$/, loader : "style!css!less" },
			{ test : /\.(jpg|png)$/, loader : "url?limit=8192" }
		]
	}
}
```

从上面可以看到，webpack的入口文件是entry.js，打包输出的文件是bundle.js，external属性是告诉webpack，当API已经存在的时候，使用全局变量，并不作任何操作。

loader的话没啥，看文档就知道，各种编译打包。具体使用方法可以看官方文档。

#### 上代码
``` javascript
var React = require('React'),
	ReactDOM = require('react-dom');

require('../less/app.less');

var AppFooter = require('./AppFooter'),
	AppHeader = require('./AppHeader'),
	ItemMain = require('./ItemMain');


var App = React.createClass ({
	getInitialState : function() {
		return {
			todoItem : [],
			isAllChecked : false
		}
	},
	//添加todo
	addItem : function(item) {
		var todoList = this.state.todoItem.push(item);
		this.setState({isAllChecked : false});
		this.forceUpdate();
	},
	 //更改todo状态
	changeTodoState : function(index, isDone, isAllChange) {
		// isAllChange = false;
		if(isAllChange) {
			this.setState({
				todoItem: this.state.todoItem.map(function(todo) {
					todo.isDone = isDone;
					return todo;
				}),
				isAllChecked : isDone
			})
		}else {
			this.state.todoItem[index].isDone = isDone;
			this.allChecked();
			this.forceUpdate();
		}
	},
	//删除todo
	deleteTodo : function(index) {
		var newTodo = this.state.todoItem.splice(index, 1);
		this.setState({todoList: newTodo});
	},
	//清楚已完成
	clearDone : function() {
		var doneList = this.state.todoItem.filter(function(item) {
			return item.isDone === false;
		})
		this.setState({todoItem: doneList, isAllChecked: false});
	},
	//全部完成
	allChecked : function() {
		var allCheck = this.state.todoItem.every(function(item) {
			return item.isDone === true;
		})
		if (allCheck) {
			this.setState({isAllChecked : true})
		};
	},
    	render : function(){
    		var props = {
    			todoLength : this.state.todoItem.length || 0,
    			doneLength : this.state.todoItem.filter(function(item) {
    				return item.isDone === true;
    			}).length || 0
    		};
    	    	return (
    	        	<div className="panel">
    	        		<header  className="mainHeader"><h2>Webpack + React TODO Demo</h2></header>
    	        		<AppHeader addItem={this.addItem}/>
    	        		<ItemMain itemList={this.state.todoItem} changeTodoState={this.changeTodoState} deleteTodo={this.deleteTodo} />
    	        	    	<AppFooter {...props} isAllChecked={this.state.isAllChecked} clearDone={this.clearDone} changeAllState={this.changeTodoState} />
    	        	</div>
    	    	)
    	}
})

ReactDOM.render(<App/>, document.getElementById("app"));  //渲染
```

从代码上面可以看到各种require，没加载commonjs、seajs或其他模块化工具，为什么能直接require呢，而且还有require less，没错，webpack就是那么暴力！js后面都会打包好一个文件，样式都会加载到html里面，做spa时候，和react简直绝配。

#### App生命 - state
React主流思想就是父组件控制state，然后通过props传递给子组建，所以简单来说界面就像状态机，只要更新state，然后根据新的state重新渲染界面，不需要操作dom，所以react高性能原因也是因为这个。
从最上代码就可以看出父组件中的定义的方法基本是整个todo的功能了，然后render方法即渲染html和组件。

``` javascript
<ItemMain itemList={this.state.todoItem} changeTodoState={this.changeTodoState} deleteTodo={this.deleteTodo} />
```

然后取一小段渲染组件代码（上面代码）就可发现，父组件向ItemMain这个组件传了4个属性，其中itemList为state，只要todoItem一更新，react就会重新渲染这个组件，其他三个为方法，方法更新也会重新渲染组件。


``` javascript
// ItemMain.js
var React = require('React');
var Items = require('./Items');

var ItemMain = React.createClass({
	render : function() {
		var _this = this;
		return (
			<section>
				<ul className="itemList">
					{_this.props.itemList.map(function (todo, index) {
						return (
							<Items {...todo} key={index} index={index} {..._this.props} />
						)
					<!-- })} -->
					<!--这里不注释代码不高亮，比较奇葩，各位官人将就着看-->
				</ul>
			</section>
		)
	}
})

module.exports = ItemMain;
```

看这里估计有点蒙，我自己看的时候也有点蒙，因为太久的代码了哈哈哈。
这个js只有一个循环Item的逻辑，首先看看`{...todo}`这个prop，这个是把itemList[i]中的[数组对象解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)，然后传到item里面，如果没有...这个字符，则需要
``` javascript
	<Items text={props.text} isDone={props.isDone} key={index} index={index} changeTodoState={proprs.changeTodoState} deleteTodo={props.deleteTodo} />
```
具体数据大家可以在代码里面console打印一下，这样印象会更深。

``` javascript
// item.js
var React = require('React');

var Items = React.createClass({
	handleChange : function() {
		var isDone = !this.props.isDone;
		this.props.changeTodoState(this.props.index, isDone);
	},
	handleDeleteTodo : function() {
		this.props.deleteTodo(this.props.index);
	},
	render : function() {
		var doneStyle = this.props.isDone ? {textDecoration: 'line-through'} : {textDecoration : 'none'};
		return (
			<li key={this.props.key} onMouseOver={this.handlerMouseOver} onMouseOut={this.handlerMouseOut}>
				<input type="checkbox" checked={this.props.isDone} onChange={this.handleChange} />
				<span style={doneStyle}>{this.props.text}</span>
				<button className="btn btn-default delete-item" onClick={this.handleDeleteTodo}>delete</button>
			</li>
		)
	}
})

module.exports = Items;

```

这个就是js里面有两个方法，一个是改变状态，一个是删除当前todo，这这能发现，两个方法都是执行了又父组件传过来的方法，如下
``` javascript
this.props.changeTodoState(this.props.index, isDone);
```

执行这个函数，state就会更新，react就会根据状态重新渲染组件

#### 其他组件
``` javascript
// AppHeader.js
var React = require('React');

var AppHeader = React.createClass({
	getInitialState : function() {
		return {
			text : ""
		}
	},
	handlerKeyUp : function(event) {
		if(event.keyCode === 13) {
			var value = event.target.value;
			if(!value) return false;

			var newTodoItem = {
				text : value,
				isDone : false
			}

			event.target.value = "";
			this.setState({text: ""});
			this.props.addItem(newTodoItem);
		}
	},
	handleChange : function(event) {
		this.setState({text : event.target.value });
	},
	handlerClick : function(event) {
		var newTodoItem = {
			text : this.state.text,
			isDone : false
		}
		this.props.addItem(newTodoItem);
		this.setState({text: ""});
	},
	render : function() {
		return (
			<section className="appHeader from-group">
				<input type="test" className="form-control" onKeyUp={this.handlerKeyUp} onChange={this.handleChange} placeholder="add one todo" value={this.state.text}/>
				<button className="btn btn-primary" onClick={this.handlerClick}>add one</button>
			</section>
		)
	}
})

module.exports = AppHeader;
```


``` javascript
// AppHeader.js
var React = require('React');

var AppFooter = React.createClass({
	handleClick : function() {
		this.props.clearDone();
	},
	handleAllState : function(event) {
		this.props.changeAllState(null, event.target.value, true);
	},
	render : function() {
		return (
			<section className="appFooter">
				<div>
					<input type="checkbox" checked={this.props.isAllChecked} onChange={this.handleAllState}/>
					<span>{this.props.doneLength}</span>已经完成 / <span>{this.props.todoLength}</span>总数
				</div>
				<button className="btn btn-default btn-tiny pull-right" onClick={this.handleClick}>clean done</button>
			</section>
		)
	}
})

module.exports = AppFooter;
```

Header Footer的方法都是大同小异，输入改变state，然后存起来，执行相应操作时候通过props的方法传给父组件，然后重新渲染界面。

### 总结
回头看代码，react的组件化相比现在的组件化思想真的先进很多。React通过父组件来控制状态，并通过props传递给子组件。因此我们能很容易看出我们的事件属于哪个组件管理，然后修改相应的方法，维护起来相当高效，相比现在的控制dom，每次修改按钮的方法，都需要先找到id或者class，然后绑定响应的方法，假如页面id或者class改变，页面逻辑又非常复杂的话，修改起来是相当麻烦的。
React凭着出色的设计思想和性能，我相信不久就会成为主流的移动端开发方式，至于PC端，大天朝你懂的。
