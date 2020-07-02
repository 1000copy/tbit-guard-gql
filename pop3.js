var Client = require('yapople').Client;
// var client = new Client({
//   hostname: 'pop.qq.com',
//   port:  110,
//   tls: false,
//   mailparser: true,
//   user:'1049674046@qq.com',//账号
//   pass: 'sleuwxnhzkosbdfi',//qq授权码
// });
var client = new Client({
  hostname: 'pop.gmail.com',
  port:  995,
  tls: false,
  mailparser: true,
  user:'1000copy@gmail.com',//账号
  pass: 'Star1234',//qq授权码
});
client.connect(function() {
  client.retrieveAll(function(err, messages) {
    messages.forEach(function(message) {
      console.log(message.subject);
    });
    client.quit();
  })
})