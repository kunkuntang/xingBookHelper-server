const express = require('express')
const cookieParser = require('cookie-parser')
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

function strToInt(str) {
  return parseInt(str)
}

app.use(cookieParser())
app.use(session({
  secret: 'bookHelper',
  cookie: { maxAge: 6000000 },
  saveUninitialized: false,
  resave: false
}))

app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
      res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})

app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.post('/checkLogin', (req, res) => {
  console.log('checkLogin: ', req.session.userInfo)
  if (req.session.userInfo && req.session.userInfo.stuNum) {
    res.json({ status: 1, mes: '已经登陆' })
  } else {
    res.json({ status: 0, mes: '请重新登陆' })
  }
})

app.post('/login', (req, res) => {
  let stuNum = req.body.stuNum || null
  let password = req.body.password || null
  utils.ajax.get('user/?where={ "stuNum" : "' + stuNum + '" }').then((response) => {
    console.log(response.data)
    let userInfo = response.data.results[0]
    if (userInfo && password == userInfo.password) {
      req.session.userInfo = userInfo
      let resObj = { login: 1, stuName: userInfo.nickName, stuNum: userInfo.stuNum, userAvatarUrl: userInfo.avatarUrl, role: 0 }
      if (userInfo.stuNum == '734229080') {
        resObj.role = 1
      }
      res.json(resObj)
    } else {
      res.json({ login: 0, mes: '登陆失败' })
    }
  }).catch((err) => {
    console.log(err)
  })
})

app.post('/addAcademy', (req, res) => {
  let newAcademyName = req.body.newAcademyName
  utils.ajax.post('academyList', { academyName: newAcademyName }).then((response) => {
    console.log(response.data)
    res.send({ status: 1, objectId: response.data.objectId, mes: '添加' + newAcademyName + '成功' })
  }).catch((err) => {
    res.send({ status: 0, mes: '保存失败' })
  })
})

app.post('/addMajor', (req, res) => {
  let newMajorName = req.body.newMajorName
  let selectedAcaId = req.body.selectedAcaId
  utils.ajax.post('majorList', { belongAca: selectedAcaId, majorName: newMajorName }).then((response) => {
    console.log(response.data)
    res.send({ status: 1, objectId: response.data.objectId, mes: '添加' + newMajorName + '成功' })
  }).catch((err) => {
    console.log(err)
    res.send({ status: 0, mes: '保存失败' })
  })
})

app.get('/getAcademyList', (req, res) => {
  console.log(req.session)
  utils.ajax.get('academyList').then((response) => {
    console.log(response.data)
    res.json(response.data.results)
  })
})

app.get('/getMajorFromAca', (req, res) => {
  let selectedAcaId = req.query.selectedAcaId
  console.log(req.query.selectedAcaId)
  if (selectedAcaId) {
    utils.ajax.get('majorList?where={"belongAca": "' + selectedAcaId + '"}').then((response) => {
      console.log(response.data)
      res.json(response.data.results)
    }).catch((err) => {
      console.log('err', err)

    })
  }
})

// 获取书单列表
app.get('/getBookLists', (req, res) => {
  utils.ajax.get('bookList').then((response) => {
    console.log(response.data)
    res.json(response.data.results)
  }).catch((err) => {
    console.log(err)
  })
})

// 获取书单信息
app.get('/getBookListInfo', (req, res) => {
  let bookListId = req.query.bookListId
  if (bookListId) {
    utils.ajax.get('bookList/' + bookListId).then((response) => {
      console.log(response.data)
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
    })
  }
})

// 获取单个书单里的书
app.get('/getBooks', (req, res) => {
  let bookListId = req.query.bookListId
  if (bookListId) {
    utils.ajax.get('books?where={"belongBookList": "' + bookListId + '"}').then((response) => {
      console.log(response.data)
      res.json(response.data.results)
    }).catch((err) => {
      console.log(err)
    })
  }
})

app.post('/addBookList', (req, res) => {
  let newBookListData = req.body.newBookListData
  let containBooks = newBookListData.containBooks
  utils.ajax.post('bookList', { bookListName: newBookListData.bookListName, belongAcaName: newBookListData.belongAcaName, belongAcaId: newBookListData.belongAcaId, belongMajName: newBookListData.belongMajName, belongMajId: newBookListData.belongMajId }).then((response) => {
    console.log(response.data)
    let newBookListId = response.data.objectId
    let requestData = []
    containBooks.forEach(element => {
      requestData.push({
        "method": "POST",
        "path": "/1/classes/books",
        "body": {
          "bookName": element.bookName,
          "bookPrice": element.bookPrice,
          "bookDisc": element.bookDisc,
          "belongBookList": newBookListId
        }
      })
    });
    console.log(containBooks)
    utils.ajax.request({
      baseURL: 'https://api.bmob.cn/1/batch',
      method: 'POST',
      data: { "requests": requestData }
    }).then((response) => {
      console.log(response.data)
      res.send({ status: 1, mes: '添加' + newBookListData.bookListName + '成功' })
    }).catch((err) => {
      console.log(err)
      res.send({ status: 0, mes: '保存失败' })
    })
  })
})

app.post('/updateBookList', (req, res) => {
  let newBookListData = req.body.newBookListData
  let containBooks = newBookListData.containBooks
  let bookListId = req.body.bookListId
  utils.ajax.put('bookList/' + bookListId, { bookListName: newBookListData.bookListName, belongAcaName: newBookListData.belongAcaName, belongAcaId: newBookListData.belongAcaId, belongMajName: newBookListData.belongMajName, belongMajId: newBookListData.belongMajId }).then((response) => {
    // utils.ajax.get('books?where={"belongBookList": "' + bookListId + '"}').then((response) => {
    let requestData = []
      // if (response.data.results.length) {
    containBooks.forEach(element => {
      let dataJson = element.bookId ? {
        "method": "PUT",
        "path": "/1/classes/books/" + element.bookId,
        "body": {
          "bookName": element.bookName,
          "bookPrice": element.bookPrice,
          "bookDisc": element.bookDisc
        }
      } : {
        "method": "POST",
        "path": "/1/classes/books",
        "body": {
          "bookName": element.bookName,
          "bookPrice": element.bookPrice,
          "bookDisc": element.bookDisc,
          "belongBookList": bookListId
        }
      }
      requestData.push(dataJson)
    });
    // } else {
    // containBooks.forEach(element => {
    //   requestData.push()
    // });
    // }
    utils.ajax.request({
        baseURL: 'https://api.bmob.cn/1/batch',
        method: 'POST',
        data: { "requests": requestData }
      }).then((response) => {
        console.log(response.data)
        res.send({ status: 1, mes: '添加' + newBookListData.bookListName + '成功' })
      }).catch((err) => {
        console.log(err)
        res.send({ status: 0, mes: '保存失败' })
      })
      // })
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