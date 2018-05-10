const utils = require('../utils/util')

const contactList = (req, res) => {
  let majorId = req.query.belongMajor
  let classNum = req.query.classNum
  let phoneList = []
  utils.bookAjax.get('/_User?where={ "belongMajor": { "__type": "Pointer", "className": "majorList", "objectId": "' + majorId + '"}}&where={"belongClass": ' + classNum + '}').then(({ data }) => {
    console.log(data)
    data.results.forEach(info => {
      if (!info.showPhoneNum)
        phoneList.push({ stuName: info.stuName, stuNum: info.stuNum, stuPhone: info.stuPhone })
    })
    res.send({ status: 1, phoneList })
  })
}

const getUserList = (req, res) => {
  let majorId = req.query.belongMajor
  let classNum = req.query.classNum
  console.log(majorId)
  console.log(classNum)
  utils.bookAjax.get('/_User?where={ "belongMajor": { "__type": "Pointer", "className": "majorList", "objectId": "' + majorId + '"}}&where={"belongClass": ' + classNum + '}&include=belongUserRole').then(({ data }) => {
    console.log('getUserListData', data)
    res.send({ status: 1, data: data.results })
  })
}

const getSearchStuInfo = (req, res) => {
  let stuId = req.query.stuId
  let bookListId = req.query.bookListId
  console.log(stuId)
  utils.bookAjax.get('/bookBills?where={ "belongBookList": {"__type": "Pointer", "className": "bookList", "objectId": "' + bookListId + '"}}&where={"belongUser": {"__type": "Pointer", "className": "_User", "objectId": "' + stuId + '}}').then((response) => {
    console.log(response.data)
    res.send(response.data.results[0])
  }).catch((err) => {
    console.log(err)
      // res.send({ status: 0, mes: '获取书单信息失败' })
  })
}

module.exports = {
  contactList: contactList,
  getUserList: getUserList,
  getSearchStuInfo: getSearchStuInfo
}