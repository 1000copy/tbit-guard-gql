# gql

GraphQL 原来2012年就已经开源，算来也有不少历史了，但是看起来网络资料并不太多，大家普遍还是觉得麻烦。单单看官方手册好像就太不亲人的，太容易从自己的角度去描述细节，而不是从使用的角度去剖析，这也是官方手册普遍的问题。


比如“获取多个资源，只用一个请求”，官方说：

	GraphQL 查询不仅能够获得资源的属性，还能沿着资源间引用进一步查询。典型的 REST API 请求多个资源时得载入多个 URL，而 GraphQL 可以通过一次请求就获取你应用所需的所有数据。这样一来，即使是比较慢的移动网络连接下，使用 GraphQL 的应用也能表现得足够迅速。


因为他假设你知道REST API，并且和它对比。其实，认识一个新事物，认识它本身会更直接，认识清楚了，想要对比了再去对比才有价值。但是人们太喜欢使用类别了。

我曾经写过一个高点击率的文章，讲述了[vuex是什么](https://segmentfault.com/a/1190000007516967)，因为大家普遍反映官方文档不好懂，原因是是它上来和reactive那套东西对比。作者这样做可以理解，因为他就是对比着做的，说出来的也是对比的话，也认为这是干货。但是读者就不太好了解，因为我vue还没有搞利索，现在你让我搞搞reactive才能动vue的东西。这很令人绝望。


我们还是从一个案例开始。假设我有两个数据实体，一个是book，一个是author，且book和author是1:对多的关系。它的数据样本，看起来是这样的：

	var books = [
		{id:0,title:"null book",author:{name:"reco"}},
		{id:1,title:"the little prince",author:{name:"reco"}},
		{id:2,title:"the http book",author:{name:"reco"}}]
	var authors = [
		{id:1,name:"reco",books:[{title:"the little prince"},{title:"the http book"}]},	
		{id:2,name:"rita",books:[{title:"the swift book"}]}]

就是这样的数据源。如果使用Graphql来做查询，可以查询作者列表，且对作者对书籍的引用做进一步查询，也就是希望这样的查询：

	
	{authors{name,books{title}}}


可以返回：

	{
	  "data": {
	    "authors": [
	      {
	        "name": "reco",
	        "books": [
	          {
	            "title": "the little prince"
	          },
	          {
	            "title": "the http book"
	          }
	        ]
	      },
	      {
	        "name": "rita",
	        "books": [
	          {
	            "title": "the swift book"
	          }
	        ]
	      }
	    ]
	  }
	}

对author.name的查询，就是获取对象属性，是比较容易的，而对而对关联对象的延伸查询，其实和属性一模一样，只不过看起来是嵌套的而已。
明确了目标，我们把代码跑起来，也还是typeDefs+resolvers的一套东西：

	const typeDefs = `type Book {
	  title: String
	  author: Author
	}
	type Author {
	  name: String
	  books: [Book]
	}
	type Query {
	  books:[Book]
	  single(id:String):Book
	  authors:[Author]
	}`
	resolvers = {
	    Query:{
	        // {books{title}}
	        async books(root,{},context) {            
	            return books
	        },
	        // {authors{name,books{title}}}
	        async authors(root,{},context) {            
	            return authors
	        },
	        // {single(id:"2"){title,author{name}}}
	        async  single(root,{id},context){
	          for (var i = 1; i < books.length; i++) {
	          	var item = books[i]
	          	if (item.id == id)return item;
	          }
	          return books[0]
	        }, 
	    },    
	}

你可以把它先跑起来，[完整代码在这里](https://github.com/1000copy/gql/blob/master/index.js)。你可以在localhost:4000/graphql内输入{authors{name,books{title}}}，了解查询的结果。然后再看代码，它简单到不必解释。

如果换成RESTAPI，那么你需要定义的是这样的资源，book和author在REST内就被称为资源：

	GET /book
	GET /author

且仅仅看这个资源，作为开发者，是无法知道book会返回哪些属性的，当然也无法从定义上看到author后面有book还是没有，你必须有手册去告诉开发者。如果没有，是否应该自己去查询book资源，如果有，那么和book资源查询重复，所以，实践上来说，常常是分别定义，自己查自己的。为了效率才会不在乎重复。官方说：“典型的 REST API 请求多个资源时得载入多个 URL”。

另外，除非你自己解析参数，前端开发者也无法很好的告诉后端在某个场景下，他需要那些属性，那些属性他并不需要。在这里案例里面，我们可以举例说，在某个界面我只需要author.name属性，另外一个界面，我还额外需要author.book.title。当然这些在graphql都可以做到。

使用graphql，前端可以指定查author.name

	{authors{name}}

或者只查author.book.title

	{authors{books{title}}}

后者就是通过author在关联了book，也就是"还能沿着资源间引用进一步查询"。

回头看官方网页的这句话：比如“获取多个资源，只用一个请求”，官方说：

	GraphQL 查询不仅能够获得资源的属性，还能沿着资源间引用进一步查询。典型的 REST API 请求多个资源时得载入多个 URL，而 GraphQL 可以通过一次请求就获取你应用所需的所有数据。这样一来，即使是比较慢的移动网络连接下，使用 GraphQL 的应用也能表现得足够迅速。

对比REST，再对照可运行的代码，我想应该容易理解多了。

