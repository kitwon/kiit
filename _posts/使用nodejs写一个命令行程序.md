---
path: /post/node-command-app
title: 使用nodejs写一个命令行程序
date: 2017-05-16 15:58:29
category:
- 前端
tags:
- nodejs
- bash
---

> 原文译自[Smashing Magazine](https://www.smashingmagazine.com/) -- [[How To Develop An Interactive Command Line Application Using Node.js](https://www.smashingmagazine.com/2017/03/interactive-command-line-application-node-js/)](https://www.smashingmagazine.com/2017/03/interactive-command-line-application-node-js/)

相信很多前端都听说过或者使用过[Gulp](http://www.gulpjs.com.cn/), [Angular CLI](https://cli.angular.io/), [Cordova](https://cordova.apache.org/), [Yeoman](http://yeoman.io/)或其他类似的命令行工具。但有想过这些程序是怎么实现的吗？例如在Angular CLI中使用`ng new <project-name>`后会建立一个已经有基本配置的angular项目；又或者像Yeoman，也能运行时候输入或者选择配置项，让用户能够自定义项目配置，快速搭建好开发时候需要用到的开发环境。下面的教程，就是讲如何使用node写一个像这样的命令行工具。

在这篇教程中，我们会开发一个命令行工具，用户能够输入一个CSV文件地址，从而获取到文件里面的用户信息，然后模拟群发邮件（原文是使用[SendGrid Api](https://github.com/sendgrid/sendgrid-nodejs)模拟发送）
文章目录：
1."Hello World"
2.处理命令行参数
3.运行时输入参数
4.模拟发送邮件
5.改变输出内容样式
6.变成shell命令

<!-- more -->

****

## “Hello World”
开始前，首先你得有node，如果没有，请自行安装下。node中自带npm，使用[npm](https://www.npmjs.com/)能安装许多开源的node模块。首先，使用npm创建一个node项目
```bash
$ npm init
name: broadcast
version: 0.0.1
description: CLI utility to broadcast email
entry point: broadcast.js
```
除这些参数外，npm还提供了其他如Git repository等参数，可根据自身需求设置输入。执行完`npm init`后，会发现在同目录下生成了一个`package.json`文件，文件里面包含了上面命令输入的信息。配置内容信息可以在[package.json文档](https://docs.npmjs.com/files/package.json)中找到。

然后，还是从最简单的Hello World入手。首先在同目录下建一个`broadcast.js`文件
```javascript
// broadcast.js
console.log('Hello World!')
```
然后在terminal中执行
```bash
$ node broadcast
Hello World!
```
well done, 根据[package.json文档](https://docs.npmjs.com/files/package.json)，我们可以找到一个`dependencies`参数，在这参数中你可以找到所有这项目需要用到的第三方模块和它们的版本号，上面也有提及到，我们需要用到模块去开发这个工具。最后开发完成，`package.json`应该如下
```json
{
    "name": "broadcast",
    "version": "0.0.1",
    "description": "CLI utility to broadcast emails",
    "main": "broadcast.js"
    "license": "MIT",
    "dependencies": {
        "chalk": "^1.1.3",
        "commander": "^2.9.0",
        "csv": "^1.1.0",
        "inquirer": "^2.0.0"
    }
}
```
这几个模块 [Chalk](https://github.com/chalk/chalk), [Commander](https://github.com/tj/commander.js), [Inquirer](https://github.com/sboudrias/Inquirer.js), [CSV](http://www.adaltas.com/en/2012/08/21/node-csv-stable-version-0-1-0/)的具体用处跟其他参数，可以自行查看。

## 处理命令行参数
node原生也有读取命令行的函数[`process.argv`](https://nodejs.org/docs/latest/api/process.html)，但是解析参数是个繁琐的工作，所以我们会使用[Commander](https://github.com/tj/commander.js)去替代这些工作。Commande的另外一个好处就是不用额外的去写一个`--help`函数，只要定义了其他参数，`--help`函数就会自动生成。首先安装一下Commander和其他package
```bash
$ npm install commander chalk csv inquirer --save
```
然后修改`broadcast.js`
```javascript
// broadcast
const program = require('commander')

program
    .version('0.0.1')
    .option('-l, --list [list]', 'list of customers in CSV file')
    .parse(process.argv)

console.log(program.list)
```
从上面可以看出，处理一个参数是十分简单的。我们定义了一个`--list`的参数，现在我们就能通过`--list`参数获取到命令行传过来的值。在这程序中，list应该是接收一个csv的地址参数，然后打印在console中。
```bash
$ node broadcast --list ./test.csv
./test.csv
```
从js中可以看到还有一个`version`参数，所以我们可以使用`--version`读取版本号。
```bash
$ node broadcast --version
0.0.1
```
又或者能使用`--help`获取app能接收的参数
```bash
$ node broadcast --help

  Usage: broadcast [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -l, --list <list>          list of customers in CSV file
```
现在我们已经能够接收到命令行传递过来的参数了，下面我们会利用接收到的CSV文件地址，并使用[CSV](http://www.adaltas.com/en/2012/08/21/node-csv-stable-version-0-1-0/)模块处理CSV文件的内容。
我们会使用下面的比哦啊哥内容作为CSV文件的内容。使用CSV模块，会读取内容，并显示各列的内容。

First name | Last name | Email
-------------- | -------------- | -------
Dwight	  | Schrute     | dwight.schrute@dundermifflin.com
Jim            | Halpert	     | jim.halpert@dundermifflin.com
Pam          | Beesly       | pam.beesly@dundermifflin.com
Ryan	 | Howard      |ryan.howard@dundermifflin.com
Stanley     | Hudson	     |stanley.hudson@dundermifflin.com

现在，更新下`broadcast.js`，使用CSV读取内容并打印在console
```javascript
// broadcast.js
const program = require('commander')
const csv = require('csv')
const fs = require('fs')

program
    .version('0.0.1')
    .option('-l, --list [list]', 'List of customers in CSV')
    .parse(process.argv)

const stream = fs.createReadStream(program.list)
stream
    .pipe(csv.parse({ delimiter : "," }))
    .on('data', function(data) {
         const firstname = data[0]
         const lastname = data[1]
         const email = data[2]

         console.log(firstname, lastname, email)
    })
```
除csv模块外，还使用了node的[File System](https://nodejs.org/dist/latest-v7.x/docs/api/fs.html)模块读取文件内容，csv的`parse`方法把列数据解析为数组，然后在terminal中运行一下命令
```bash
$ node broadcast.js --list ./test.csv
Dwight Schrute dwight.schrute@dundermifflin.com
Jim Halpert jim.halpert@dundermifflin.com
Pam Beesly pam.beesly@dundermifflin.com
Ryan Howard ryan.howard@dundermifflin.com
Stanley Hudson stanley.hudson@dundermifflin.com
```

## 运行时输入参数
上面已经实现了获取命令行参数，但如果想在运行时候接收参数值的话我们就需要另外一个模块[inquirer.js](https://github.com/sboudrias/Inquirer.js)，通过这个模块，用户可以自定义多种参数类型，如文本，密码，单选或者多选列表等。

下面的demo会通过inquirer接收邮件发送人的名字，email还有邮件主题。
```javascript
// broadcast.js
...
const inquirer = require('inquirer')
const questions = [
  {
    type : "input",
    name : "sender.email",
    message : "Sender's email address - "
  },
  {
    type : "input",
    name : "sender.name",
    message : "Sender's name - "
  },
  {
    type : "input",
    name : "subject",
    message : "Subject - "
  }
]

program
  .version('0.0.1')
  .option('-l, --list [list]', 'List of customers in CSV')
  .parse(process.argv)

// 储存CSV数据
const contactList = []
const stream = fs.createReadStream(program.list)
    .pipe(csv.parse({ delimiter : "," }))

stream
  .on('error', function (err) {
    return console.error(err.message)
  })
  .on('data', function (data) {
    let name = data[0] + " " + data[1]
    let email = data[2]
    contactList.push({ name : name, email : email })
  })
  .on('end', function () {
    inquirer.prompt(questions).then(function (answers) {
      console.log(answers)
    })
  })
```
Inquire.js的`prompt`方法接受一个数组参数，数组里可以自定义运行时需要接受的问题参数，在这demo里面，我们想知道发送者的名字还要email还有邮件主题，所以定义了一个`questions`的数组来储存问题，从对象里面可以看到有一个`input`的参数，除此外还可以接受`password`等其他类型，具体可以查询一下[inquirer的文档](https://github.com/SBoudrias/Inquirer.js/)。此外，参数`name`保存input的key值。`prompt`方法会返还一个promise对象，promise中会返回一个`answer`变量，里面带有刚才输入的值。
```bash
$ node broadcast -l input/employees.csv
? Sender's email address -  kitssang_demo@163.com
? Sender's name -  kit
? Subject - Hello World
{ sender:
   { email: '  kitssang_demo@163.com',
     name: 'kit' },
  subject: 'Hello World' }
```

## 模拟发送邮件
由于原文使用的`sendgrid`没有跑通，所以只组装了一下数据模拟了发送邮件。原本的第五部分也在这里一起用上了。
```javascript
// broadcast.js
...
program
    .version('0.0.1')
    .option('-l, --list [list]', 'list of customers in CSV file')
    .parse(process.argv)

const sendEmail = function(to, from, subject) {
    const sender = chalk.green(`${from.name}(${from.email})`)
    const receiver = chalk.green(`${to.name}(${to.email})`)
    const theme = chalk.blue(subject)

    console.log(`${sender} send a mail to ${receiver} and the subject of the email is ${theme}`)
}

// 储存CSV数据
let concatList = []
const stream = fs.createReadStream(program.list)
  .pipe(csv.parse({
    delimiter: ','
  }))
  .on('data', function(data) {
    const name = data[0] + ' ' + data[1]
    const email = data[2]

    concatList.push({
      name: name,
      email: email
    })
  })
  .on('end', function() {
    inquirer.prompt(questions).then((ans) => {
      for (let i = 0; i < concatList.length; i++) {
        sendEmail(concatList[i], ans.sender, ans.subject)
      }
    }).catch((err) => {
      console.log(err)
    })
  })
```
由于没有异步请求，`async`模块没有用上，另外使用了`chalk`模块改变了console打印结果的颜色。

## 变成bash命令
至此，整个工具已经基本完成，但是如果想像一个普通的bash命令(不加`$ node xx`)执行，还需要做以下操作。首先，添加[shebang](https://zh.wikipedia.org/wiki/Shebang)在js的头部，让bash知道如何执行这个文件。
```javascript
#!/usr/bin/env node

// broadcast.js
const program = require("commander")
const inquirer = require("inquirer")
...
```
然后再配置一下`package.json`使代码可运行
```json
…
  "description": "CLI utility to broadcast emails",
  "main": "broadcast.js",
  "bin" : {
    "broadcast" : "./broadcast.js"
  }
…
```
从代码可以看到加了一个[`bin`](https://docs.npmjs.com/files/package.json#bin)的参数，这个参数可以使broadcast命令与broadcast.js建立连接。

最后一步，在全局安装一下依赖包。在项目目录运行一下下面的命令。
```bash
$ npm install -g
```

然后测试一下命令
```bash
$ broadcast --help
```

需要注意的是，在开发时候如果使用`commaner`默认给出的命令执行`broadcast`则在代码中所做的任何更改都是看不见的。假如输入`which broadcast`，你会发现地址不是你当前目录，所以这时应该要用`npm link`去查看命令的目录映射。
