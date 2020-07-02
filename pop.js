var Client = require('node-poplib-gowhich').Client;
var client = new Client({
  hostname: 'pop.qq.com',
  port:  995,
  tls: false,
  mailparser: true,
  user:'1049674046@qq.com',//账号
  pass: 'sleuwxnhzkosbdfi',//qq授权码
});
client.connect(function() {
  client.retrieveAll(function(err, messages) {
    messages.forEach(function(message) {
      console.log(message.subject);
    });
    client.quit();
  })
})