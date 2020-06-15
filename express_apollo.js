// {"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjIiLCJpYXQiOjE1OTE5NTMxNTN9.YfT6s2lJqlN1RIzIH048Drh3COmJnLbsu5eEu4VKD4E"}
const jwt = require('jsonwebtoken')
const SECRET_KEY =
    'sharedkey'

//  和我的问题一模一样，login写入了session，到visit内发现写的内容并不在。
// https://github.com/graphql/express-graphql/issues/464
var Cookies = require('cookies')
const express = require('express');
const app = express();  

const { ApolloServer} = require('apollo-server-express');
const typeDefs = `type Query {  
  login(a:String):String
  visit(a:String):String
  logout(a:String):String
}`
var session = require('express-session')

app.use(session({
  secret: 'tbit&reco',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge:60*60*24*15*1000,secure: false }
}))

resolvers = {
    Query:{
        // {login(a:"world")}
        //  注入的对象，可以在context内访问
        // console.log(context.model(),context.req.body.query)
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
function model(){return 'db gate'}
const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  //  注入req，db的方法。可以注入任何对象
  context: ({ req ,res}) => ({ req,model,res})
});
server.applyMiddleware({ app ,path:"/api"});
var port = 4001
app.listen({ port }, () =>{  
  console.log(`graphql ready at http://localhost:${port}`)
    var secret = 'sharedkey';
});