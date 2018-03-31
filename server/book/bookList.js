const utils = require('../utils/util')

const getBookLists = (req, res) => {
  utils.bookAjax.get('bookList?include=belongMajor[majorName].belongAcademy[academyName]').then((response) => {
    console.log(response.data)
    res.json(response.data.results)
  }).catch((err) => {
    console.log(err)
  })
}

const getBookListInfo = (req, res) => {
  let bookListId = req.query.bookListId
  if (bookListId) {
    utils.bookAjax.get('bookList/' + bookListId).then((response) => {
      console.log(response.data)
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
    })
  }
}

const getBooks = (req, res) => {
  let bookListId = req.query.bookListId
  if (bookListId) {
    utils.bookAjax.get('books?where={ "belongBookList": {"__type": "Pointer", "className": "bookList", "objectId": "' + bookListId + '"}}&include=belongBookList[bookListName].belongMajor[majorName].belongAcademy[academyName]').then((response) => {
      console.log(response.data)
      res.json(response.data.results)
    }).catch((err) => {
      console.log(err)
    })
  }
}

const addBookList = (req, res) => {
  let newBookListData = req.body.newBookListData
  let containBooks = newBookListData.containBooks
  utils.bookAjax.post('bookList', {
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
    utils.bookAjax.request({
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
}

const updateBookList = (req, res) => {
  let newBookListData = req.body.newBookListData
  let containBooks = newBookListData.containBooks
  let bookListId = req.body.bookListId
    // utils.bookAjax.put('bookList/' + bookListId, {
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
    requestData.push(dataJson)
  });
  console.log('requestData', requestData)

  utils.bookAjax.request({
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
}

module.exports = {
  getBookLists: getBookLists,
  getBookListInfo: getBookListInfo,
  getBooks: getBooks,
  addBookList: addBookList,
  updateBookList: updateBookList
}