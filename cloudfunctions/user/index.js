// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise');

cloud.init({
  env: 'cloud1-2gz3zqqx6833b79c'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.action && user[event.action]) {
    const result = await user[event.action](wxContext, event)
    return result
  }
  return {
    message: 'hello there! you need to provide a valid action to use user API.',
    error: -1,
  }
}
const user = {
  //此函数是申请后端服务器去绑定对教务网数据进行获取的函数，因为隐私问题 这里匿了，仅提供思路
  async bind_school(context, params) {
    // var is_right = await rp({
    //   method: 'get',
    //   uri: "https://xxxx/scrapy/login",
    //   body: {
    //     username: params.username,
    //     password: params.password,
    //     _openid: context.OPENID
    //   },
    //   headers: {
    //     'User-Agent': 'Request-Promise'
    //   },
    //   json: true
    // }).then();
    //1.进行班级的判断
    let class_name = await db.collection('course').aggregate()
      .match({
        class_name: params.class_name
      })
      .project({
        class_name: 1
      }).end()
    if (class_name.list.length == 0) {
      return {
        errcode: 588,
        errmsg: "班级填写错误"
      }
    }
    //2.进行服务端请求
    // var is_right = await rp({
    //   method: 'get',
    //   uri: "http://cc.xxxx.cn/xxx/score",
    //   body: {
    //     username: params.username,
    //     password: params.password,
    //     _openid: context.OPENID,
    //   },
    //   json: true
    // }).then();
    // if (JSON.stringify(is_right) == "{}") {
    //   return {
    //     errcode: 599,
    //     errmsg: "教务网崩溃，请重试"
    //   }
    // }
    // //账号密码错误
    // if (is_right.res_data.errcode == 588) {
    //   return is_right.res_data
    // }

    // console.log(is_right, context.OPENID)
    // //判断用户之前是否存在
    // let user = await db.collection('users').where({
    //   _openid: context.OPENID
    // }).get()

    //账号密码入库 因为服务器是公司的 所以匿了

    // let user_info = {
    //   _openid: context.OPENID,
    //   username: params.username,
    //   password: params.password,
    //   avatarUrl: '',
    //   nickName: '',
    //   class_name: params.class_name,
    //   scores: is_right.res_data,
    //   course_img:'http://xxxx:xxx/images/'+context.OPENID+'.png',
    //   is_unbind:false
    // }
    // if (user.data.length === 0) {
    //   res = await db.collection('users').add({
    //     data: user_info
    //   })
    // } else {
    //   res = await db.collection('users').where({
    //     _openid: context.OPENID
    //   }).update({
    //     data: user_info
    //   })
    // }
    // return {
    //   errcode:200,
    //   errmsg:'绑定教务网成功'
    // }

    
    
  },
  async un_bind(context, params) {
    //解绑教务网
    let res = await db.collection('users').where({
      _openid: context.OPENID
    }).update({
      data: {
        is_unbind:true
      }
    })
    return res;
  },
  async get_all_class(context, params) {
    const MAX_LIMIT = 100

    const countResult = await db.collection('course').count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    const data = await db.collection('course').aggregate()
      .project({
        class_name: 1
      })
      .skip(0).limit(total).end()
    console.log(data, "===>")



    //解绑教务网
    let res = await db.collection('course')
      .aggregate()
      .project({
        class_name: 1
      })
      .end()
    console.log(res)
  },
  //判断用户是否绑定教务网了
  async is_bind(context, params) {
    var res = await db.collection('users').where({
      _openid: context.OPENID
    }).get()
    if (res.data.length === 0) {
      return false
    } else {
      return true
    }
  },
  //判断用户是否授权
  async is_login(context, params) {
    var res = await db.collection('users').where({
      _openid: context.OPENID
    }).get()
    if (res.data[0].avatarUrl === '') {
      return false
    } else {
      return true
    }
  },
  async is_login_and_bind(context, params) {
    var login_res = await db.collection('users').where({
      _openid: context.OPENID
    }).get()
    var bind_res = await db.collection('users').where({
      _openid: context.OPENID
    }).get()
    var is_bind = true
    var is_login = true
    if (login_res.data.length === 0 || login_res.data[0].nickName === '') {
      is_login = false
    }
    if (bind_res.data.length === 0) {
      is_bind = false
    }
    return {
      is_bind: is_bind,
      is_login: is_login
    }
  },
  async insert_user_opendata(context, params) {
    var res = await db.collection('users').where({
      _openid: context.OPENID
    }).update({
      data: {
        avatarUrl: params.avatarUrl,
        nickName: params.nickName,
        gender: params.gender
      }
    })
    return res;
  },
  async my_data(context, params) {
    const $ = db.command.aggregate
    let share_data = await db.collection('share').aggregate().match({
      user_openid: context.OPENID
    }).group({
      _id: null,
      star_num: $.sum('$star_num'),
      view_num: $.sum('$view_num'),
      comment_num: $.sum('$comment_num'),
    }).end()
    console.log(share_data);

    return share_data.list[0];
  },
  async get_user_data(context, params) {
    let user_data = await db.collection('users').where({
      _openid: context.OPENID
    }).get()
    if (user_data.data.length === 0) {
      return {
        is_bind: false,
        is_login: false
      }
    } else {
      let is_bind = false;
      let is_login = false;
      if (user_data.data[0].nickName !== "") {
        is_login = true
      }
      if (!user_data.data[0].is_unbind && JSON.stringify(user_data.data[0]) != "{}") {
        is_bind = true;
      }
      return {
        user_data: user_data.data[0],
        is_bind: is_bind,
        is_login: is_login
      }
    }
  }
}