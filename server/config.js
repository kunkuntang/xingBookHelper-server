module.exports = {
  serverPort: '9080',

  // 小程序 appId 和 appSecret 
  // 请到 https://mp.weixin.qq.com 获取 AppID 和 AppSecret
  appId: 'wx5b7c2e620cd2e7ea',
  appSecret: '75ebd780c4aa483bce0dc23072dd40bf',

  // mongodb 连接配置，生产环境请使用更复杂的用户名密码
  mongoHost: '127.0.0.1',
  mongoPort: '27017',
  mongoUser: 'campusAdmin',
  mongoPass: 'campusAdmin-pwd',
  mongoDb: 'campusAssist'
};