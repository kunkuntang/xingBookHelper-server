const utils = require('../utils/util')

const addAcademy = (req, res) => {
  let newAcademyName = req.body.newAcademyName
  utils.bookAjax.post('academyList', { academyName: newAcademyName }).then((response) => {
    console.log(response.data)
    res.send({ status: 1, objectId: response.data.objectId, mes: '添加' + newAcademyName + '成功' })
  }).catch((err) => {
    res.send({ status: 0, mes: '保存失败' })
  })
}

const delAcademy = (req, res) => {
  let academyId = req.body.academyId
  utils.bookAjax.delete('academyList/' + academyId).then(({ data }) => {
    let status = data.msg == 'ok' ? 1 : 0
    res.json({ status })
  })
}

const addMajor = (req, res) => {
  let newMajorName = req.body.newMajorName
  let selectedAcaId = req.body.selectedAcaId
  utils.bookAjax.post('majorList', { belongAcademy: { __type: "Pointer", className: "academyList", objectId: selectedAcaId }, majorName: newMajorName }).then((response) => {
    res.send({ status: 1, objectId: response.data.objectId, mes: '添加' + newMajorName + '成功' })
  }).catch((err) => {
    res.send({ status: 0, mes: '保存失败' })
  })
}

const delMajor = (req, res) => {
  let majorId = req.body.majorId
  utils.bookAjax.delete('majorList/' + majorId).then(({ data }) => {
    let status = data.msg == 'ok' ? 1 : 0
    res.json({ status })
  })
}

const getAcademyList = (req, res) => {
  console.log(req.session)
  utils.bookAjax.get('academyList').then((response) => {
    console.log(response.data)
    res.json(response.data.results)
  })
}

const getMajorFromAca = (req, res) => {
  let selectedAcaId = req.query.selectedAcaId
  console.log(req.query.selectedAcaId)
  if (selectedAcaId) {
    utils.bookAjax.get('majorList?where={ "belongAcademy": { "__type": "Pointer", "className": "academyList", "objectId": "' + selectedAcaId + '"} }').then((response) => {
      console.log(response.data)
      res.json(response.data.results)
    }).catch((err) => {
      console.log('err', err)

    })
  }
}

module.exports = {
  addAcademy: addAcademy,
  delAcademy: delAcademy,
  addMajor: addMajor,
  delMajor: delMajor,
  getAcademyList: getAcademyList,
  getMajorFromAca: getMajorFromAca,
}