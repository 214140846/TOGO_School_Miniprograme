/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
const promisify = require('promisify')
const getSetting = promisify(wx.getSetting)
const cloudFunction = promisify(wx.cloud.callFunction)
const db = wx.cloud.database()
const app = getApp()
function isLogin() {
  return new Promise((resolve, reject) => {
    getSetting().then(res => {
      console.log('判断用户是否授权过用户信息');
      if (res.authSetting['scope.userInfo']) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).catch(res => {
      reject(false);
      console.log('判断用户是否授权过用户信息 失败');
    })
  })
}
function is_bind_school() {
  return new Promise((resolve, reject) => {

  })
}