var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/getSessionKey', function(req, res) {
  console.log('post server', req.body.jsCode)
  var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=6636a71c682fc816bf7f4d3678561cff&secret=38ba10eb8d6a147e71bea44f696f3225&js_code=' + req.body.jsCode + '&grant_type=authorization_code'
  app.get(url, function(req, res) {
    console.log('get wx', res)
    res.json(res)
  })
})

var server = app.listen(9080, function () {
var host = server.address().address;
var port = server.address().port;
console.log('Example app listening at http://%s:%s', host, port);
});