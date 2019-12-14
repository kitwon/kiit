---
path: /blog/use-graphql-with-apollo
title: Apollo GraphQL + Koa实例教程
date: 2019-03-15 11:25:00
category:
- 服务端
tags:
- GraphQL
- koa
- nodejs
---

# Apollo GraphQL + Koa实例教程
> [GraphQL 入门 | GraphQL](http://graphql.cn/learn/) GraphQL中文文档
>
> [Apollo GraphQL](https://www.apollographql.com/), 实现GraphQL的引擎，大部分使用方法能从中查询
>
> [Vue Apollo](https://akryum.github.io/vue-apollo/zh-cn/) 客户端中Vue GraphQL库，有一系列封装好的方法。

两个个重要概念
* **Schema**  即为GraphQL中的`types`(类型)，为服务中的核心，描述了服务端中提供给客户端可用的功能，或者说可查询的数据。
* **Resolver** 在项目设计中是一个`map`对象，对象中的`key`和**schema**中`types`的字段是一对一的关系，描述了`types`中数据的来源。

两个特殊类型
每一个 GraphQL 服务都有一个query类型，可能有一个mutation类型。
* **Query**里面定义了服务器提供给前端的一些可查询的类型，相当于以前的一个Restful接口，只有*Query*里的字段才能查询。
* **Mutation**亦差不多，只是**Mutation**表示的是变更操作，如增删改这些接口操作。

<!-- more -->

# GraphQL实例
运行下面的类定义前我们需要一个最简单的服务，首先我们新建一个文件夹，然后安装所需依赖
`npm i apollo-server-koa graphql koa nodemon`

然后在目录下心新建一个`app.js`的文件，并添加以下代码
```javascript
const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

// 定义一个简单的类型
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// 定义resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const app = new Koa();
server.applyMiddleware({ app });

const port = '8888';
app.listen({ port }, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
});
```

然后打开地址输入地址后查询`hello`即可看到反馈结果`hello world!`
```graphql
# Write your query or mutation here
{
	hello
}
```

到这里我们即启动好一个简单的服务。

## 类型定义
下面会设计一个简单的图书管理系统，由于没有服务接口，我们先拟定一份模拟数据作为后端返回的数据，修改`app.js`，添加以下代码。

```javascript
// 从这里开始
const authors = [
  {
    name: "Jerry",
    id: "1"
  },
  {
    name: "Tom",
    id: "2"
  }
];

const books = [
  {
    name: "白夜行",
    id: "1",
    authorId: "1"
  },
  {
    name: "傲慢与偏见",
    id: "2",
    authorId: "1"
  },
  {
    name: "时生",
    id: "3",
    authorId: "2"
  },
  {
    name: "Javascript高级程序设计",
    id: "4",
    authorId: "2"
  }
];
```

我们先添加一个简单的用户和书本查询，每次查询都返回一个用户和书本列表。首先我们需要添加`Author`和`Book`类型和在Query里面添加对应查询字段，修改**typeDefs**对象为以下代码
```javascript
const typeDefs = gql`
  type Query {
    authors: [Author]!
    books: [Book]!
  }

  type Author {
    name: String!
    id: ID!
  }

  type Book {
    name: String!
    id: ID!
    authorId: ID!
  }
`;
```

定义好类型之后，我们需要为类型添加数据来源的描述，在这里我们修改之前定义好的`resolvers`对象
```javascript
const resolvers = {
  Query: {
    authors: () => authors,
    books: () => books
  }
};
```

查询简单列表后，我们还需要对特定**id**的数据进行查询，如某个author或book，因为已经有了对应的`schema`，我们只需要在`query`中添加对应接口即可
```javascript
const typeDefs = gql`
  type Query {
    authors: [Author]!
    books: [Book]!
    // 此处为新增
    author(id: ID!): Author
    book(id: ID!): Book
  }
}
```

然后在`resolvers`对象中添加对应内容

```javascript
const resolvers = {
  Query: {
    authors: () => authors,
    books: () => books,
    author: (_, { id }) => authors.find(i => i.id === id),
    book: (_, { id }) => books.find(i => i.id === id)
  }
};
```

到此我们已经实现了所有基本的查询了，但除此之外，`author`和`book`应该还有着对应的关系，比如某本书属于哪个作者，或者说某个作者写了哪本书这样，那么这种情况我们需要怎么处理呢

很简单，我们还是和上方一样，添加字段，描述字段数据如何返回即可，下面我们修改`Author`和`Book`的*schema*
⚠️*注意不要删除旧代码*

```javascript
const typeDefs = gql`
  """Some Query"""

	type Book {
		name: String!
		id: String!
		authorId: String!
		author: Author
	}

	type Author {
		name: String!
		id: String!
      books: [Book]
	}
`
```

从上方代码我们可以看到`Book`和`Author`都新增了一个字段，但是这个字段有个特别的地方就是需要先知道父级ID才能找到下一集的数据，如要先知道用户ID才能在Book List里面筛选出对应的数据。所以在这里设置对应的`resolvers`，这里有点特别，我们先上代码，继续修改`resolvers`对象

```javascript
const resolverMap = {
	Query: {
    // 这里的内容省略
  },
  // 这里开始是新加的内容
  Author: {
    books(parent) {
      return books.filter(i => i.authorId === parent.id);
    }
  },
  Book: {
    author(parent) {
        return authors.find(i => i.id === parent.authorId)
    }
  }
}
```

随后在[playground](http://localhost:8888/graphql)页面输入以下代码进行查询

```graphql
{
	author(id: 1) {
    name
    books {
      name
    }
  }
  book(id: 1) {
    name
    author {
      name
    }
  }
}
```

在这里，已经完成业务基本涵盖的功能了，怎么定义数据和查询，从上方查询，我们也能发现GraphQL中的一个缺点，但又能说是说优点，就是可以*无限循环查询*，如修改上方的查询

```grapnel
{
  book(id: 1) {
    name
    author {
      name
      books {
        name
      }
    }
  }
}
```


## 结语
在上面的一个简单例子可以大概清楚GraphQL里面一个工作流程，还有*Mutation*等一些特定类型没有介绍，不过也和*Query*差不多，毕竟也是一个查询而已，只是处理的事情不一样。

除此之外，可能在业务上面更多的实现难度是在用户验证，在应用中传递上下文Context等。

在一些特定的业务场景，*GraphQL*还能展示出更多的骚操作，大家有兴趣的话可以继续找我这边交流，Thanks🌝
