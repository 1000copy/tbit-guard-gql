// {"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjIiLCJpYXQiOjE1OTE5NTMxNTN9.YfT6s2lJqlN1RIzIH048Drh3COmJnLbsu5eEu4VKD4E"}
const jwt = require('jsonwebtoken')
const SECRET_KEY ='sharedkey'
const express = require('express');
const app = express();  
const { ApolloServer} = require('apollo-server-express');
const typeDefs = `type Query {  
  login(a:String):String
  visit(a:String):String
  logout(a:String):String
}`
resolvers = {
    Query:{
        async login(root,{a},context) { 
          const token = jwt.sign({ login:a},SECRET_KEY)
          return token                    
        },        
        async logout(root,{a},context) {            
            return a
        },        
        async visit(root,{a},context) {         
              var req = context.req
              const token = req.headers.authorization || ''    
              try {
                  const splitToken = token.split(' ')[1]
                  var decoded = jwt.verify(splitToken, SECRET_KEY)
                  // req.user = decoded
                  console.log(decoded)
              } catch (e) {}
             if(decoded)
              return 'true'
            else
              return 'false'
        },        
    },    
}
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  //  注入req，db的方法。可以注入任何对象
  context: ({ req ,res}) => ({ req,res})
});
server.applyMiddleware({ app ,path:"/api"});
var port = 4001
app.listen({ port }, () =>{  
  console.log(`graphql ready at http://localhost:${port}`)
    var secret = 'sharedkey';
});