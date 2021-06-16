// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'cloud1-2gz3zqqx6833b79c'
})
const db = cloud.database()
const _=db.command
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && comment_back[event.action]) {
    const result = await comment_back[event.action](wxContext, event)
    return result
  }
  return {
    message: 'hello there! you need to provide a valid action to use comment_back API.',
    error: -1,
  }
}
const comment_back = {
  //联表查询整个detail页面所有数据
  async get_share_detail_page_data(context, params) {
    //先查帖子联合点赞
    let res_share = await db.collection('share').doc(params.share_detail_id).get().then();
    console.log(res_share);
    let res_star = await db.collection('star').where({ user_openid: context.OPENID }).get().then();
    console.log(res_star);
    let share_tem = res_star.data
    let star_list = []
    for (const key in share_tem) {
      star_list.push(share_tem[key].target_id)
    }
    //评论联合回复
    let res_comment = await db.collection('comments').aggregate().sort({ _createTime: -1 }).match({ share_id: params.share_detail_id }).lookup({
      from: 'commentback',
      localField: '_id',
      foreignField: 'comment_id',
      as: 'comment_back',
    }).end()
    console.log(res_comment);
    let res = {
      share_list: res_share.data,
      star_list: star_list,
      comment_list: res_comment.list
    }
    return res;
  },
  async add_comment_back(context, params) {
    let user_res = await db.collection('users').where({ _openid: context.OPENID }).get()
    console.log(user_res)
    let user = user_res.data[0]
    let add_res = await db.collection('commentback').add({
      data: {
        comment_id: params.comment_back_id,
        user_openid: context.OPENID,
        user_avatarUrl:user.avatarUrl,
        user_nickName: user.nickName,
        to_whome:params.to_whome,
        comment_back_content: params.comment_back_content,
        _createTime: new Date().getTime()
      }
    }).then()
    console.log(add_res)
    let share_res= await db.collection('share').doc(params.share_id).update({
      data:{
        view_num:_.inc(parseInt(Math.random()*100)),
        comment_num:_.inc(1)
      }
    })

    return share_res;

  }

}