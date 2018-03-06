import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
  title = title ? title + ' - Home' : '校园助手后台管理';
  window.document.title = title;
};

const ajaxUrl = env === 'development' ?
  'http://127.0.0.1:8010' :
  env === 'production' ?
  // 'http://127.0.0.1:8010' :
  'http://lenkuntang.cn:802' :
  'https://debug.lenkuntang.cn:802';

util.ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000,
  withCredentials: true
});

export default util;