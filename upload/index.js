var fs = require('fs')
const readFile = async filePath => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8')
    return data
  }
  catch(err) {
    console.log(err)
  }
}
const { ApolloServer } = require('apollo-server');
const typeDefs = `type Query {
  single(id:String):String  
}`
resolvers = {
    Query:{
        async  single(root,{id},context){          
          var r = await readFile('./headway.b64.txt')
          return r
        }, 
    },    
}
const server = new ApolloServer({ typeDefs,resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});