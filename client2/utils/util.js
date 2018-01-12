const axios = require('axios')

let util = {

};

util.ajax = axios.create({
  headers: {
    'X-Bmob-Application-Id': '6636a71c682fc816bf7f4d3678561cff',
    'X-Bmob-REST-API-Key': '05ea04f70d33f065e52ded897c5f4765',
    'Content-Type': 'application/json'
  },
  baseURL: 'https://api.bmob.cn/1/classes',
  timeout: 30000
});

module.exports = util;
module.exports.default = util