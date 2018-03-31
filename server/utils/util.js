const axios = require('axios')

function createAjax(bmobAppId, bmobAPIKey, sessionToken) {
  return axios.create({
    headers: {
      'X-Bmob-Application-Id': bmobAppId,
      'X-Bmob-REST-API-Key': bmobAPIKey,
      'X-Bmob-Session-Token': sessionToken || '',
      'Content-Type': 'application/json'
    },
    baseURL: 'https://api.bmob.cn/1/classes',
    timeout: 30000
  });
}

let util = {

};

util.bookAjax = createAjax('', '', '')
util.createAjax = ({
  bmobAppId = '',
  bmobAPIKey = '',
  sessionToken = ''
}) => createAjax(bmobAppId, bmobAPIKey, sessionToken)

module.exports = util;
module.exports.default = util