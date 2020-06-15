// {"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IjIiLCJpYXQiOjE1OTE5NTMxNTN9.YfT6s2lJqlN1RIzIH048Drh3COmJnLbsu5eEu4VKD4E"}
var jwt = require('jsonwebtoken')
var SECRET_KEY ='sharedkey'
var express = require('express');
var app = express();  
var port = 4001
app.get('/visit',(req,res)=>{  
  var token = req.headers.authorization || ''    
  try {
      var splitToken = token.split(' ')[1]
      var decoded = jwt.verify(splitToken, SECRET_KEY)  
  } catch (e) {}
  if(decoded && decoded.login =='reco')
    res.send('pass')
  else
    res.send('block')
})
app.get('/login/:username/:password',(req,res)=>{
  if(req.params.username == 'reco' && req.params.password == 'rita')
    var token = jwt.sign({ login:req.params.username},SECRET_KEY)
    res.send(token)    
})
app.listen({ port }, () =>{  
  console.log(`http://localhost:${port}`)    
});