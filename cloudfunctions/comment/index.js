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
  if (event.action && comment[event.action]) {
    const result = await comment[event.action](wxContext, event)
    return result
  }
  return {
    message: 'hello there! you need to provide a valid action to comment share API.',
    error: -1,
  }
}
const comment={
  async get_comment(context, params) {
    let res=await db.collection('comments').where({
      share_id:params.share_id
    }).orderBy('_createTime', 'desc').get()
    console.log(res);
    //增加阅读量1-10
    let ud_res=await db.collection('share').doc(params.share_id).update({
      data:{
        view_num:_.inc(parseInt(Math.random()*5)),
      }
    })
    console.log(ud_res)
    //let share_detail=await db.collection('share').doc(params.share_id).get()
    return res;
  },
  async add_star(context, params){
    let res=await db.collection('star').add({
      data:{
        user_openid:context.OPENID,
        target_id:params.target_id
      }
    })
    console.log(res);
    let add_num_callBack=await db.collection(params.target_type).where({_id:params.target_id}).update({
      data:{
        star_num:_.inc(1),
        view_num:_.inc(parseInt(Math.random()*20))
      }
    })
    console.log(add_num_callBack);
    return res;
  },
  async get_star(context, params){
    let res=await db.collection('star').where({user_openid:context.OPENID}).get()
    console.log(res);
    let share_tem=res.data
    let star_list=[]
    for (const key in share_tem) {
      star_list.push(share_tem[key].target_id)
    }
    return star_list;
  },

  async delete_star(context, params){
    let res=await db.collection('star').where({user_openid:context.OPENID,target_id:params.target_id}).remove()
    let add_num_callBack=await db.collection(params.target_type).where({_id:params.target_id}).update({
      data:{
        star_num:_.inc(-1),
        view_num:_.inc(parseInt(Math.random()*20))
      }
    })
    return add_num_callBack;
  }

}