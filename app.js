var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/getSessionKey', function (req, res) {
  console.log('post server', req.body)
  var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=wx5b7c2e620cd2e7ea&secret=75ebd780c4aa483bce0dc23072dd40bf&js_code=' + req.body.jsCode + '&grant_type=authorization_code'
  requestWx(url, function(result) {
    res.send(result)
  })
})

function requestWx(url, cb) {
  https.get(url, function (res) {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    console.log('raw data', rawData)
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(rawData);
        console.log(parsedData);
        cb(parsedData)        
      } catch (e) {
        console.log(e.message);
      }
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  })
}

var server = app.listen(9080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});