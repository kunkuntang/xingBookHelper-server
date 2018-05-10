const utils = require('../utils/util')

const login = (req, res) => {
  let stuNum = req.body.stuNum || null
  let password = req.body.password || null
  utils.bookAjax.request({
    url: '?username=' + stuNum + '&password=' + password,
    baseURL: 'https://api.bmob.cn/1/login',
    method: 'GET',
  }).then(({ data }) => {
    console.log(data)
    getUserRole(data.belongUserRole.objectId, (userRoleData) => {

      console.log(userRoleData)
      data.scopeStatus = userRoleData.scopeStatus
      data.scoped = userRoleData.scoped
      data.roleNum = userRoleData.roleNum
      data.applyClassStatus = userRoleData.applyClassStatus
      req.session.userInfo = data
      res.json({ status: 1, mes: '登陆成功！', ...data })
    })
  }).catch((err) => {
    console.log(err)
    res.json({ status: 0, mes: '用户名或密码错误' })
  })
}

const getUserRole = (userRoleId, cb) => {
  console.log('userRoleId', userRoleId)
  utils.bookAjax.get('userRole/' + userRoleId).then(({ data }) => {
    console.log('userRoledata', data)
    cb(data)
  }).catch(err => {
    console.log(err)
  })
}

const checkLogin = (req, res) => {
  console.log('checkLogin: ', req.session.userInfo)
  if (req.session.userInfo && req.session.userInfo.stuNum) {
    res.json({ status: 1, mes: '已经登陆', userInfo: req.session.userInfo })
  } else {
    res.json({ status: 0, mes: '请重新登陆' })
  }
}

const logout = (req, res) => {
  req.session.userInfo = ''
  res.send({ status: 1 })
}

const updateUserToken = (req, res) => {
  let { userId, sessionToken } = req.body
  console.log('userId', userId)
  console.log('sessionToken', sessionToken)

  utils.bookAjax.post('userSessionToken', {
    sessionToken,
    belongUser: {
      __type: "Pointer",
      className: '_User',
      objectId: userId
    }
  }).then(data => {
    console.log(data)
  })
}

const getContactInfo = (req, res) => {
  let belongMajId = req.query.belongMajId
  console.log('belongMajId', belongMajId)
  utils.bookAjax.request({
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
}

const getUserInfo = (req, res) => {
  let userId = req.query.userId
  console.log(userId)
  utils.bookAjax.get('_User/' + userId).then(({ data }) => {
    console.log(data.results)
    res.send(data)
  })
}

const updateUserInfo = (req, res) => {
  let {
    userId,
    stuNum,
    stuName,
    stuPhone,
    stuShortPhone,
    belongAcademyId,
    belongAcaName,
    belongMajorId,
    belongMajorName,
    allowShowPhone,
    sessionToken
  } = req.body
  utils.createAjax({ sessionToken }).put('_User/' + userId, {
    stuName,
    stuNum,
    stuPhone,
    stuShortPhone,
    belongAcaName,
    belongAcademy: {
      __type: "Pointer",
      className: 'academyList',
      objectId: belongAcademyId
    },
    belongMajorName,
    belongMajor: {
      __type: "Pointer",
      className: 'majorList',
      objectId: belongMajorId
    },
    allowShowPhone,
  }).then((response) => {
    if (response.status == 200) {
      res.send({ status: 1, msg: '修改成功' })
    } else {
      res.send({ status: 0, msg: '系统出了点小问题，请稍后重试' })
    }
  }).catch(err => {
    console.log(err)
  })
}

// 申请权限
const updateUserScope = (req, res) => {
  let { userId, sessionToken, scoped, position } = req.body
  utils.createAjax({ sessionToken }).put('userRole?where={ "belongUser": "' + userId + '"}', {
    scopeStatus: 1,
    scoped,
    position
  }).then((response) => {
    console.log(response)
    if (response.status == 200) {
      res.send({ status: 1, msg: '申请已提交，请耐心等待' })
    } else {
      res.send({ status: 0, msg: '系统出了点小问题，请稍后重试' })
    }
  }).catch(err => {
    console.log(err)
  })
}

// 获取当前权限
const getUserScope = (req, res) => {
  utils.bookAjax.get('userRole?where={"scopeStatus": {"$gt": -1}}&include=belongUser').then(({ data }) => {
    console.log(data)
    res.send(data)
  }).catch(err => {
    console.log(err)
  })
}

// 超级管理员 通过普通用户申请的权限
const passScope = (req, res) => {
  let { sessionToken, userId } = req.body
    // utils.createAjax({ sessionToken }).put('_User/' + userId, {
  utils.bookAjax.put('userRole?where={"belongUser": "' + userId + '"}', {
    scopeStatus: 2
  }).then((response) => {
    if (response.status == 200) {
      res.send({ status: 1, msg: '已通过' })
    } else {
      res.send({ status: 0, msg: '系统出了点小问题，请稍后重试' })
    }
  }).catch(err => {
    console.log(err)
  })
}

// 超级管理员 驳回通用户申请的权限
const denyScope = (req, res) => {
  let { sessionToken, userId } = req.body
  console.log('sessionToken', sessionToken)
  utils.bookAjax.put('userRole?where={"belongUser": "' + userId + '"}', {
    scopeStatus: 0
  }).then((response) => {
    if (response.status == 200) {
      res.send({ status: 1, msg: '已驳回' })
    } else {
      res.send({ status: 0, msg: '系统出了点小问题，请稍后重试' })
    }
  }).catch(err => {
    console.log(err)
  })
}

// 班级管理员、团体管理员 通过普通用户的加入请求
const passJoinRequest = (req, res) => {
  let { userRoleId } = req.body
  utils.bookAjax.put('userRole/' + userRoleId, {
    applyClassStatus: 2
  }).then(({ data }) => {
    res.json(data)
  }).catch((err) => {
    console.log(err)
  })
}

// 班级管理员、团体管理员 驳回普通用户的加入请求
const denyJoinRequest = (req, res) => {
  let { userRoleId } = req.body
  utils.bookAjax.put('userRole/' + userRoleId, {
    applyClassStatus: 0
  }).then(({ data }) => {
    res.json(data)
  }).catch((err) => {
    console.log(err)
  })
}


module.exports = {
  login: login,
  checkLogin: checkLogin,
  updateUserToken,
  logout: logout,
  getContactInfo: getContactInfo,
  getUserInfo: getUserInfo,
  updateUserInfo,
  updateUserScope,
  getUserScope,
  passScope,
  denyScope,
  passJoinRequest,
  denyJoinRequest
}