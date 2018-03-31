const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session')
const path = require('path')
const axios = require('axios')
const fs = require('fs')

const utils = require('./utils/util')
const {
  login,
  checkLogin,
  logout,
  getContactInfo,
  getUserInfo,
  updateUserInfo,
  updateUserScope,
  getUserScope,
  passScope,
  denyScope
} = require('./login/index')

const {
  addAcademy,
  delAcademy,
  addMajor,
  delMajor,
  getAcademyList,
  getMajorFromAca,
  getBooks,
  addBookList,
  getBookLists,
  updateBookList,
  getBookListInfo,
} = require('./book')

const {
  addLocation,
  delLocation,
  addLocationCate,
  delLocationCate,
  getLocationCateList,
  getLocationFromCate
} = require('./location')

const { getSearchStuInfo, contactList, getUserList } = require('./contact')

const app = express()

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.header('Access-Control-Allow-Origin', 'http://lenkuntang.cn');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCrossDomain);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data

app.use(cookieParser())
app.use(session({
  secret: 'bookHelper',
  cookie: { maxAge: 6000000 },
  saveUninitialized: false,
  resave: false
}))

// 登录模块
app.post('/checkLogin', checkLogin)

app.post('/login', login)

app.get('/logout', logout)

// 购书模块
app.post('/addAcademy', addAcademy)

app.post('/delAcademy', delAcademy)

app.post('/addMajor', addMajor)

app.post('/delMajor', delMajor)

app.get('/getAcademyList', getAcademyList)

app.get('/getMajorFromAca', getMajorFromAca)

// 地图模块
app.post('/addLocationCate', addLocationCate)

app.delete('/delLocationCate', delLocationCate)

app.post('/addLocation', addLocation)

app.delete('/delLocation', delLocation)

app.get('/getLocationCateList', getLocationCateList)

app.get('/getLocationFromCate', getLocationFromCate)

// 获取书单列表
app.get('/getBookLists', getBookLists)

// 获取书单信息
app.get('/getBookListInfo', getBookListInfo)

// 个人设置里的模块
app.post('/updateUserInfo', updateUserInfo)

app.get('/getUserInfo', getUserInfo)

app.post('/updateUserScope', updateUserScope)

app.get('/getUserScope', getUserScope)

app.post('/passScope', passScope)

app.post('/denyScope', denyScope)

// 获取单个书单里的书
app.get('/getBooks', getBooks)

app.post('/addBookList', addBookList)

app.post('/updateBookList', updateBookList)

app.get('/getContactInfo', getContactInfo)

app.get('/getSearchStuInfo', getSearchStuInfo)

app.get('/getUserList', getUserList)

// 通讯录模块
app.get('/contactList', contactList)

var server = app.listen(8010, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})