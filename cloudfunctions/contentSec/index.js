
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-2gz3zqqx6833b79c'
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && contentSec[event.action]) {
    const result = await contentSec[event.action](wxContext, event)
    return result
  }
  return {
    message: 'hello there! you need to provide a valid action to use contentSec API.',
    error: -1,
  }
}
const contentSec = {
  async text_sec_check(context, params) {
    return await cloud.openapi.security.msgSecCheck({
      content: params.text
    })
  },
  async img_sec_check(context, params) {
    console.log("===>",params.img)
    const imgmsg = (await cloud.downloadFile({
      fileID: params.img,
    })).fileContent;

    return cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: imgmsg
      }
    })
  }
}
