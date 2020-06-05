var books = [
  {id:0,title:"null book",author:{name:"reco"}},
  {id:1,title:"the little prince",author:{name:"reco"}},
  {id:2,title:"the http book",author:{name:"reco"}}]
var authors = [
  {id:1,name:"reco",books:[{title:"the little prince"},{title:"the http book"}]}, 
  {id:2,name:"rita",books:[{title:"the swift book"}]}]

// npm i apollo-server -S
// node index.js
// curl -i -H 'Content-Type: application/json' -X POST -d '{"query":"{books{title}}"}' http://localhost:4000/graphql

const { ApolloServer } = require('apollo-server');
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
const server = new ApolloServer({ typeDefs,resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});