var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/getSessionKey', function (req, res) {
  console.log('post server', req.body)
  var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=6636a71c682fc816bf7f4d3678561cff&secret=38ba10eb8d6a147e71bea44f696f3225&js_code=' + req.body.jsCode + '&grant_type=authorization_code'

})

function requestWx(url) {
  http.get(url, function (res) {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];
    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\n` +
        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.log(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    console.log('raw data', rawData)
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(rawData);
        console.log(parsedData);
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