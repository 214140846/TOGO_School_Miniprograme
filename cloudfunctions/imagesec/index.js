const cloud = require('wx-server-sdk');
cloud.init({
  env: 'cloud1-2gz3zqqx6833b79c'
})

exports.main = async (event, context) => {
  const imgmsg = (await cloud.downloadFile({
    fileID: event.img,
  })).fileContent;

  return cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: imgmsg
      }
    })
}