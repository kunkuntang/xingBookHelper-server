const utils = require('../utils/util')

const addLocationCate = (req, res) => {
  let newLocationCateName = req.body.newLocationCateName
  utils.bookAjax.post('mapCateList', { locationCateName: newLocationCateName }).then(({ data }) => {
    res.send({ status: 1, objectId: data.objectId, mes: '添加' + newLocationCateName + '成功' })
  }).catch((err) => {
    res.send({ status: 0, mes: '保存失败' })
  })
}

const addLocation = (req, res) => {
  let newLocationName = req.body.newLocationName
  let selectedCateId = req.body.selectedCateId
  let newLongitude = req.body.newLongitude
  let newLatitude = req.body.newLatitude
  utils.bookAjax.post('mapLocationList', { belongCate: { __type: "Pointer", className: "mapCateList", objectId: selectedCateId }, locationName: newLocationName, latitude: newLatitude, longitude: newLongitude }).then(({ data }) => {
    console.log(data)
    res.send({ status: 1, objectId: data.objectId, mes: '添加' + newLocationName + '成功' })
  }).catch((err) => {
    res.send({ status: 0, mes: '保存失败' })
  })
}

const delLocation = (req, res) => {
  let locationId = req.query.locationId
  utils.bookAjax.delete('mapLocationList/' + locationId).then(({ data }) => {
    console.log(data)
    let status = data.msg == 'ok' ? 1 : 0
    res.json({ status })
  })
}

const getLocationCateList = (req, res) => {
  utils.bookAjax.get('mapCateList').then(({ data }) => {
    console.log(data.results)
    res.json(data.results)
  }).catch(err => {
    console.log('err', err)
  })
}

const delLocationCate = (req, res) => {
  let cateId = req.query.cateId
  console.log(cateId)

  let requestData = []
  requestData.push({
    "method": "DELETE",
    "path": "/1/classes/mapCateList/" + cateId
  })

  utils.bookAjax.get('mapLocationList?where={ "belongCate": { "__type": "Pointer", "className": "mapCateList", "objectId": "' + cateId + '"} }')
    .then(({ data }) => {
      console.log(data)
      data.results.forEach(el => {
        console.log(el)
        requestData.push({
          "method": "DELETE",
          "path": "/1/classes/mapLocationList/" + el.objectId
        })
      })

      utils.bookAjax.request({
        baseURL: 'https://api.bmob.cn/1/batch',
        method: 'POST',
        data: { "requests": requestData }
      }).then((response) => {
        console.log(response.data)
        res.send({ status: 1 })
      }).catch((err) => {
        console.log(err)
        res.send({ status: 0 })
      })
    })
}

const getLocationFromCate = (req, res) => {
  let selectedCateId = req.query.selectedCateId
  console.log(selectedCateId)
  if (selectedCateId) {
    utils.bookAjax.get('mapLocationList?where={"belongCate": { "__type": "Pointer", "className": "mapCateList", "objectId": "' + selectedCateId + '"} }').then(({ data }) => {
      console.log(data.results)
      res.json(data.results)
    }).catch(err => {
      console.log('err', err)
    })
  }
}

module.exports = {
  addLocationCate: addLocationCate,
  addLocation: addLocation,
  delLocation: delLocation,
  getLocationCateList: getLocationCateList,
  delLocationCate: delLocationCate,
  getLocationFromCate: getLocationFromCate,
}