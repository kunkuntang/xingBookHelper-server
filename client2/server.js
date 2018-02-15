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
    res.json({ status: 1, mes: '已经登陆', userInfo: req.session.userInfo })
  } else {
    res.json({ status: 0, mes: '请重新登陆' })
  }
})

app.post('/login', (req, res) => {
  let stuNum = req.body.stuNum || null
  let password = req.body.password || null
  utils.ajax.request({
    url: '?username=' + stuNum + '&password=' + password,
    baseURL: 'https://api.bmob.cn/1/login',
    method: 'GET',
  }).then(({ data }) => {
    console.log(data)
    req.session.userInfo = data
    res.json({ status: 1, mes: '登陆成功！', ...data })
  }).catch((err) => {
    console.log(err.response.data)
    res.json({ status: 0, mes: '用户名或密码错误' })
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
  utils.ajax.post('majorList', { belongAcademy: { __type: "Pointer", className: "academyList", objectId: selectedAcaId }, majorName: newMajorName }).then((response) => {
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
    utils.ajax.get('majorList?where={ "belongAcademy": { "__type": "Pointer", "className": "academyList", "objectId": "' + selectedAcaId + '"} }').then((response) => {
      console.log(response.data)
      res.json(response.data.results)
    }).catch((err) => {
      console.log('err', err)

    })
  }
})

// 获取书单列表
app.get('/getBookLists', (req, res) => {
  utils.ajax.get('bookList?include=belongMajor[majorName].belongAcademy[academyName]').then((response) => {
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
    utils.ajax.get('books?where={ "belongBookList": {"__type": "Pointer", "className": "bookList", "objectId": "' + bookListId + '"}}&include=belongBookList[bookListName].belongMajor[majorName].belongAcademy[academyName]').then((response) => {
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
  utils.ajax.post('bookList', {
    bookListName: newBookListData.bookListName,
    belongMajor: { __type: "Pointer", className: "majorList", objectId: newBookListData.belongMajId },
    belongUser: { __type: "Pointer", "className": "_User", "objectId": newBookListData.belongUserId }
  }).then((response) => {
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
          "buyCount": 0,
          "belongAcademy": {
            "__type": "Pointer",
            "className": "academyList",
            "objectId": newBookListData.belongAcaId
          },
          "belongMajor": {
            "__type": "Pointer",
            "className": "majorList",
            "objectId": newBookListData.belongMajId
          },
          "belongBookList": {
            "__type": "Pointer",
            "className": "books",
            "objectId": newBookListId
          }
        }
      })
    })
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
  }).catch((err) => {
    console.log(err)
  })
})

app.post('/updateBookList', (req, res) => {
  let newBookListData = req.body.newBookListData
  let containBooks = newBookListData.containBooks
  let bookListId = req.body.bookListId
    // utils.ajax.put('bookList/' + bookListId, {
    // bookListName: newBookListData.bookListName,
    // belongMajor: { __type: "Pointer", className: "majorList", objectId: newBookListData.belongMajId },
    // belongUser: { __type: "Pointer", "className": "_User", "objectId": newBookListData.belongUserId }
    // }).then((response) => {
  let requestData = []
  requestData.push({
    "method": "PUT",
    "path": "/1/classes/bookList/" + bookListId,
    "body": {
      "bookListName": newBookListData.bookListName,
      "belongMajor": { "__type": "Pointer", "className": "majorList", "objectId": newBookListData.belongMajId },
    }
  })
  containBooks.forEach(element => {
    console.log('bookId: ', element.bookId)
    let dataJson = {}
    switch (element.status) {
      // delete
      case 0:
        {
          dataJson = {
            "method": "DELETE",
            "path": "/1/classes/books/" + element.bookId,
          }
          break;
        }
        // update
      case 1:
        {
          dataJson = {
            "method": "PUT",
            "path": "/1/classes/books/" + element.bookId,
            "body": {
              "bookName": element.bookName,
              "bookPrice": element.bookPrice,
              "bookDisc": element.bookDisc
            }
          }
          break;
        }
        // add
      case 2:
        {
          dataJson = {
            "method": "POST",
            "path": "/1/classes/books",
            "body": {
              "bookName": element.bookName,
              "bookPrice": element.bookPrice,
              "bookDisc": element.bookDisc,
              "belongBookList": {
                "__type": "Pointer",
                "className": "bookList",
                "objectId": bookListId
              }
            }
          }
          break;
        }

      default:
        break;
    }
    // })
    requestData.push(dataJson)
  });
  console.log('requestData', requestData)

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

app.get('/userInfo', (req, res) => {
  let belongMajId = req.query.belongMajId
  console.log('belongMajId', belongMajId)
  utils.ajax.request({
    url: 'users?where={"belongMajor": { "__type": "Pointer", "className": "majorList", "objectId": "' + belongMajId + '"}}',
    baseURL: 'https://api.bmob.cn/1',
    method: 'GET'
  }).then((response) => {
    console.log(response.data)
    res.send(response.data.results)
  }).catch((err) => {
    console.log(err)
    res.send({ status: 0, mes: '获取用户数据失败' })
  })
})

app.get('/getSearchStuInfo', (req, res) => {
  let stuId = req.query.stuId
  let bookListId = req.query.bookListId
  console.log(stuId)
  utils.ajax.get('/bookBills?where={ "belongBookList": {"__type": "Pointer", "className": "bookList", "objectId": "' + bookListId + '"}}&where={"belongUser": {"__type": "Pointer", "className": "_User", "objectId": "' + stuId + '}}').then((response) => {
    console.log(response.data)
    res.send(response.data.results[0])
  }).catch((err) => {
    console.log(err)
      // res.send({ status: 0, mes: '获取书单信息失败' })
  })
})

app.get('/contactList', (req, res) => {
  let majorId = req.query.belongMajor
  let classNum = req.query.classNum
  let phoneList = []
  utils.ajax.get('/_User?where={ "belongMajor": { "__type": "Pointer", "className": "majorList", "objectId": "' + majorId + '"}}&where={"belongClass": ' + classNum + '}').then(({ data }) => {
    console.log(data)
    data.results.forEach(info => {
      if (!info.showPhoneNum)
        phoneList.push({ stuName: info.stuName, stuNum: info.stuNum, stuPhone: info.stuPhone })
    })
    res.send({ status: 1, phoneList })
  })
})

app.get('/logout', (req, res) => {
  req.session.userInfo = ''
  res.send({ status: 1 })
})

var server = app.listen(8010, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
})