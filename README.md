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


File Upload With GraphQL from a React Application
=================================================
![sd](https://miro.medium.com/max/1280/1*4rhGpdz4lqGCQJxusW9RGw.jpeg)

React前端的文件上传可以通过[Apollo Upload Client](https://github.com/jaydenseric/apollo-upload-client)来实现。

GraphQL使我们开发者能够在前端应用和REST API之间实现一个强大而灵活的抽象层。作为一个3个月前才接触到GraphQL的实习生，我阅读了许多文章、博客文章和GraphQL社区成员准备的指南，了解如何构建GraphQL服务并将其连接到React应用。但这些资源都没有提到使用GraphQL可以上传文件。


![Image for post](https://miro.medium.com/max/1200/1*Vr1IXtCaIkwAQdlSfrkcoQ.jpeg)

文件上传也可以这样说吗？也许...

当我受命管理和构建一个新的功能，包括使用GraphQL实现文件上传时，我意识到虽然这个功能包含在Apollo Server 2.0中，但大多数关于这个功能的资源都被布置在不同的资源库中，而且指南也遗漏了重要的步骤。

我从阅读[官方博客文章](https://blog.apollographql.com/file-uploads-with-apollo-server-2-0-5db2f3f60675)开始研究这个功能，并虔诚地按照它的步骤进行研究，但不幸的是，这是我进入神秘错误之海的入口，只因为博客文章不完整。我花了近一周的时间，在github仓库中跳转GraphQL文件上传功能，以找出我的代码有什么问题。

因此，我决定收集这篇指南，展示通过使用GraphQL突变实现基本的文件上传功能GraphQL服务器和React客户端的必要步骤。另外，谈谈我对GraphQL这个功能的经验，以及为什么作为一个公司我们决定选择不同的方法。

在下面的部分中，本指南将带您通过必要的步骤来创建一个GraphQL服务器，该服务器可以处理从React应用程序与Apollo Client发送的文件上传突变。GraphQL服务器要有2种不同的功能；**将文件保存到文件系统中**和**将其流进S3 bucket中**。

Basic Architecture
==================


![Image for post](https://miro.medium.com/max/776/1*u5FFm-cIWOXxl9uc668U7g.png)

所有部件的示意图，更多细节请查看[github repository]（https://github.com/epalaz/graphql-file-upload-example）。

在本指南中，我们的系统将由以下部分组成。 
**1.**带有Apollo客户端包的React应用。 
**2.**使用Apollo服务器包的GraphQL服务器。

我们的GraphQL服务器将有能力将上传的文件保存到文件系统中，并将接收到的数据流流进AWS上的S3 Bucket。为此，我们将有2个查询：**singleUpload**和**singleUploadStream**。

**Step 1: Preparing GraphQL Server**
====================================

Setup
-----

要使用apollo-server库创建一个GraphQL服务器，最简单的方法是按照它的[官方指南](https://www.apollographql.com/docs/apollo-server/getting-started/)，但我还是会在这里列出所需步骤。 
首先创建一个目录并安装包。

        $ mkdir your_dir_name  
        $ cd your_dir_name  
        $ yarn init --yes  
        $ yarn add apollo-server graphql graphql-upload  
        $ yarn add aws-sdk

这组命令应该安装包和创建。下一步就是开始定义出类型定义和解析器。

类型定义和突变解析器
---------------------------------------

突变的类型定义和填充物查询

我们定义了2种不同的突变。**singleUpload**突变用于上传文件并将其保存到文件系统的一个目录中，而**singleUploadStream**则用于流式传输到S3 bucket。这些突变采用**Upload**标量类型，在Apollo Server 2.0中是默认的，所以它的解析是由apollo服务器自己完成的。Apollo服务器将多部分请求形式映射到这个**Upload**标量，并为文件生成一个**承诺**。这两个突变都会返回**文件**类型，该类型由**文件名、mimetype**和**编码**字段组成，虽然这并不符合现实生活中的日程安排，但返回文件的正确字段表示文件正确上传至GraphQL服务器。

SingleUpload和singleUploadStream突变的解析器

在这些文件上传解析器中，一个关键的细节是文件参数返回的承诺。为了能够读取文件流，我们应该等待承诺被解析。在这个例子中，两个突变解析器使用了不同的方法。**singleUpload**通过使用**then()**返回承诺，并将解析后的流保存到文件系统中。另一方面，**singleUploadStream**使用**await**等待承诺解析，通过使用文件流将文件上传到S3。这些解析器的另一个区别是，在解析器函数里面使用**await**需要将其定义为**async**，而**singleUpload**解析器可以保持同步。

**注：**旧的例子可以显示文件具有filed **stream，**而不是**createReadStream**函数。最新的变更请查看[graphql-upload repository](https://github.com/jaydenseric/graphql-upload#type-fileupload)。变化的PR](https://github.com/jaydenseric/graphql-upload/pull/92)了解背景。

**配置服务器和AWS SDK**。
------------------------------------

这个server.js文件包含了在localhost的4000端口上启动Apollo服务器并配置[AWS JavaScript SDK](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/welcome.html)的代码。(更多细节请参考文档)。使用类型定义和突变解析器创建ApolloServer实例应该足以处理文件上传，以便保存在文件系统中并上传到S3。如果你需要进一步帮助在AWS上创建S3 Buckets，请参考这个[链接](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)。

        const { ApolloServer, gql } = require('apollo-server');
        const fs = require('fs')
        const typeDefs = gql`  
          type File {
            filename: String!
            mimetype: String!
            encoding: String!
          }
          type Query {
            _ : Boolean
          }
          type Mutation {
            singleUpload(file: Upload): File!,    
          }
        `;
        const resolvers = {
          Mutation: {
            singleUpload: (parent, args) => {
              return args.file.then(file => {
                const {createReadStream, filename, mimetype} = file
                const fileStream = createReadStream()
                fileStream.pipe(fs.createWriteStream(`./${filename}`))
                return file;
              });
            },
          },
        };
        const server = new ApolloServer({ typeDefs, resolvers });
        server.listen().then(({ url }) => {
          console.log(`\`🚀  Server ready at ${url}`);
        });
        });
您可以通过键入以下内容测试GraphQL服务器

    $ cd your_project_dir  
    $ node server.js

到你的控制台。这应该启动服务器的端口4000的localhost。在这之后键入localhost:4000到你的浏览器，你应该能够看到Playground页面上，你可以发送查询和突变到服务器进行测试，也可以看到自动生成的文件的基础上。

![Image for post](https://miro.medium.com/max/2880/1*8g9lr6fRiDPSCl_U3CES9Q.png)

Apollo Server游乐场截图显示定义的突变和查询。

现在，你可以验证你的突变和查询是否被服务器识别，你已经准备好从你的React应用中向服务器发送graphql请求。

**Step 2: Creating the React Application**
==========================================

为了轻松地创建我们的react应用和它的模板代码，我们将使用户[create-react-app工具](https://create-react-app.dev/docs/getting-started)由Facebook开发。

$ yarn create react-app your-app-name。 
$ yarn add apollo-client apollo-upload-client react-apollo graphql-tag 

这条命令应该创建一个给定名称的react应用目录，并自动生成模板代码，开始开发我们的应用。你可以通过输入以下命令来测试这个命令是否成功

$ 纱线开始

这时应该在localhost:3000端口上启动开发服务器，并进行实时更新。


![贴图](https://miro.medium.com/max/2380/1*aRWnUy4JfG313_aYIzAlbw.png)

由create-react-app创建的应用示例。

如果你能看到这个屏幕，说明你的项目已经设置成功，你可以开始编辑这个模板来上传你的文件。

**配置Apollo客户端并为突变准备Schemas**。

            import React from 'react';
            import logo from './logo.svg';
            import './App.css';
            import { InMemoryCache } from 'apollo-cache-inmemory'
            import { createUploadLink } from 'apollo-upload-client'
            import {ApolloClient} from "apollo-client"
            import {ApolloProvider, Mutation} from "react-apollo"
            import gql from "graphql-tag"
            const apolloCache = new InMemoryCache()
            const uploadLink = createUploadLink({
              uri: 'http://localhost:4000', // Apollo Server is served from port 4000
              headers: {
                "keep-alive": "true"
              }
            })
            const client = new ApolloClient({
              cache: apolloCache,
              link: uploadLink
            })
            const UPLOAD_FILE = gql`
              mutation SingleUpload($file: Upload) {
                singleUpload(file: $file) {
                  filename
                  mimetype
                  encoding
                }
              }
            `;
            function App() {
              return (
                <div className="App">
                  <ApolloProvider client={client}>
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2>Save Local</h2>
                            <Mutation mutation={UPLOAD_FILE}>
                                {(singleUpload, { data, loading }) => {
                                    console.log(data)
                                    return (<form onSubmit={() => {console.log("Submitted")}} encType={'multipart/form-data'}>
                                                <input name={'document'} type={'file'} onChange={({target: { files }}) => {
                                                    const file = files[0]
                                                    file && singleUpload({ variables: { file: file } })
                                                }}/>{loading && <p>Loading.....</p>}</form>)}
                                }
                            </Mutation>
                    </header>
                  </ApolloProvider>
                </div>
              );
            }
            export default App;

这段代码创建了一个基本的UI，有1个表单，一个是**singleUpload**，在这个例子中，onChange事件被用来启动文件上传突变函数，但你也可以选择用你所选择的事件来启动它。做文件上传onChange可以让你在文件被选中后立即上传。另一个细节是将表单元素的**encType**为**multipart/form-data**。查看这个[链接](https://github.com/jaydenseric/graphql-multipart-request-spec)来阅读关于GraphQL多部分请求规范的更多细节。在设置了这些组件的渲染函数后，你的UI应该看起来有点类似于这样。


![贴图](https://miro.medium.com/max/2880/1*9uku8ofLwgVQ6m7akZtdXQ.png)

React应用实例的UI

第三步：测试和上传文件


**测试文件系统保存  
**在测试之前，请确保服务器和react应用程序都已启动并运行。如果没有，请按照步骤1和2启动它们。让我们尝试用**singleUpload**突变上传一个文件，看看它是否保存在服务器文件系统中。

![贴图](https://miro.medium.com/max/2880/1*ejAsjmI4eYtf9BQRK9ZUsA.png)

如果你检查控制台，你应该可以看到GraphQL服务器返回的上传文件信息。这意味着我们的上传成功了，剩下的事情就是验证服务器是否将文件保存到文件系统中。


![贴图](https://miro.medium.com/max/1544/1*4YWts8d8VpC1QtZ4Bae6QQ.png)

Aaand voila，"no-image.png "文件成功上传并保存到文件系统。
