const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const utils = require('./utils/util')

const app = express()

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCrossDomain);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

function resolvePath(dir) {
  return path.resolve(__dirname, 'src', dir, dir + '.html')
}

function readHTMLFile(filename) {
  return fs.readdirSync(resolve(filename), { encoding: 'utf8' })
}

app.use(session({
  secret: 'bookHelper',
  cookie: { maxAge: 60000 },
  saveUninitialized: false,
  resave: false
}))

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.get('/login', (req, res) => {
  res.sendFile(resolvePath('login'))
})

app.post('/login', (req, res) => {
  let stuNum = req.body.stuNum || null
  let password = req.body.password || null
  utils.ajax.get('user/?where={ "stuNum" : "' + stuNum + '" }').then((response) => {
    if (password == response.data.results[0].password) {
      res.json({ login: 1 })
    } else {
      res.json({ login: 0 })
    }
  }).catch((err) => {
    console.log(err)
  })
})

app.post('/addAcademy', (req, res) => {
  let newAcademyName = req.body.newAcademyName
  utils.ajax.post('academyList', { academyName: newAcademyName }).then((result) => {
    console.log(result.data)
    res.send({ status: 1, objectId: result.data.objectId })
  }).catch((err) => {
    res.send({ status: 0 })
  })
})

app.post('/addMajor', (req, res) => {
  let newMajorName = req.body.newMajorName
  let selectedAcaId = req.body.selectedAcaId
  utils.ajax.post('majorList', { belongAca: selectedAcaId, majorName: newMajorName }).then((result) => {
    console.log(result.data)
    res.send({ status: 1, objectId: result.data.objectId })
  }).catch((err) => {
    console.log(err)
    res.send({ status: 0 })
  })
})

app.get('/getAcademyList', (req, res) => {
  utils.ajax.get('academyList').then((response) => {
    console.log(response.data)
    res.json(response.data.results)
  })
})

app.get('/getMajorFromAca', (req, res) => {
  let selectedAcaId = req.query.selectedAcaId
  console.log(req.query.selectedAcaId)
  utils.ajax.get('majorList?where={"belongAca": "' + selectedAcaId + '"}').then((response) => {
    console.log(response.data)
    res.json(response.data.results)
  }).catch((err) => {
    console.log('err', err)

  })
})

app.get('/index', (req, res) => {
  res.sendFile(resolvePath('index'))
})

var server = app.listen(8010, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})