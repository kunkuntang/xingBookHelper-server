const axios = require('axios')

let util = {

};

util.ajax = axios.create({
  headers: {
    'X-Bmob-Application-Id': '',
    'X-Bmob-REST-API-Key': '',
    'Content-Type': 'application/json'
  },
  baseURL: 'https://api.bmob.cn/1/classes',
  timeout: 30000
});

module.exports = util;
module.exports.default = util