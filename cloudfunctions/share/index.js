// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'cloud1-2gz3zqqx6833b79c'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && share[event.action]) {
    const result = await share[event.action](wxContext, event)
    return result
  }
  return {
    message: 'hello there! you need to provide a valid action to use share API.',
    error: -1,
  }
}
const share = {
  async add_share(context, params) {
    console.log(params)
    let images = []
    if (params.images.length !== 0) {
      //转换图片url
      const result = await cloud.getTempFileURL({
        fileList: params.images,
      })
      for (const key in result.fileList) {
        images.push(result.fileList[key].tempFileURL);
      }
      console.log(images)
    }

    let res = await db.collection('users').where({ _openid: context.OPENID }).get()
    console.log(res)
    let user = res.data[0]
    let call_back = await db.collection('share').add({
      data: {
        user_openid: user._openid,
        user_nickName: user.nickName,
        user_avatarUrl: user.avatarUrl,
        un_nickName: params.un_nickName,
        content: params.content,
        images: images,
        unname: params.unname,
        star_num: 0,
        comment_num: 0,
        view_num: 2,
        is_delete:false,
        _createTime: new Date().getTime()
      }
    })
    console.log(call_back)
    return call_back
  },
  async get_share_list(context, params) {
    const MAX_LIMIT = 20
    let page_index = params.page_index//第几页
    const sort_type = params.sort_type //传递过来的排序查询值
    let res = await db.collection('share').where({is_delete:false}).skip(page_index * MAX_LIMIT).limit(MAX_LIMIT).orderBy(sort_type, 'desc').get()
    console.log(res);
    let star_res = await db.collection('star').where({ user_openid: context.OPENID}).get()
    console.log(star_res);
    let share_tem = star_res.data
    let star_list = []
    for (const key in share_tem) {
      star_list.push(share_tem[key].target_id)
    }
    return {
      share_list: res.data,
      star_list: star_list
    }
  },
  //获取用户一个人的全部帖子
  async get_my_share(context, params) {
    const MAX_LIMIT = 20
    let page_index = params.page_index//第几页
    const sort_type = params.sort_type //传递过来的排序查询值
    let res = await db.collection('share').where({
      user_openid:context.OPENID
    }).skip(page_index * MAX_LIMIT).limit(MAX_LIMIT).orderBy(sort_type, 'desc')
    .get()
    console.log(res);
    return {
      share_list: res.data,
    }
  },
  async delete_my_share(context, params) {
    //target_id 
    let res = await db.collection('share').doc(params.target_id).update({
      data:{
        is_delete:true
      }
    })
    console.log(res);
    return res
  },
  async add_share_comment(context, params) {
    let res = await db.collection('users').where({ _openid: context.OPENID }).get()
    console.log(res)
    let user = res.data[0]
    let comment_call_back = {
      user_openid: user._openid,
      user_nickName: user.nickName,
      user_avatarUrl: user.avatarUrl,
      share_id: params.share_id,
      content: params.content,
      star_num: 0,
      comment_num: 0,
      _createTime: new Date().getTime()
    }
    let call_back = await db.collection('comments').add({
      data: comment_call_back
    })
    console.log(call_back)
    // share_detail.view_num=(parseInt(share_detail.view_num)+parseInt(Math.random()*50))
    // share_detail.comment_num=(parseInt(share_detail.comment_num)+1)
    //评论数+1 浏览量随机增加
    let update_res = await db.collection('share').where({ _id: params.share_id, }).update({
      data: {
        view_num: _.inc(parseInt(Math.random() * 50)),
        comment_num: _.inc(1)
      }
    })
    console.log(update_res);
    return call_back;
  }
}
