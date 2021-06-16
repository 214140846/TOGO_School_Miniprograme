/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
var TIME = require('../../utils/time.js')
var app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [
      "所有课程", "通识课", "公共课", "专业课", "研究生"
    ],
    type: "请选择课程类型",
    index: 0,
    name: "",
    history: [],
    share_data: [],
    page_index: 0,
    sort_type: 'view_num',
    TabCur: 0, //顶部导航栏,
    share_star: [],
    is_wx_killer: true,
  },
  type_param: ["", "Common", "PublicBasic", "Specialty", "yjs"],
  params: {
    type: "",
    name: "",
    teacher: "",
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //shenhe        

  },
  
  loginData() {
    
    this.setData({
      user_data: app.globalData.user_data,
      is_bind: wx.getStorageSync('is_bind'),
      is_login: wx.getStorageSync('is_login'),
    })
    if (this.data.is_bind) {
      this.setData({
        course_data: app.globalData.user_data.courses
      })
    }

    //loginData是获取用户是否进行绑定教务网的函数方法，同时绑定教务网后点赞和发帖都需要用户进行授权操作

    //   wx.cloud.callFunction({
    //     name: 'user',
    //     data: {
    //       action: 'get_user_data'
    //     }
    //   }).then(res => {
    //     console.log(res)
    //     wx.setStorageSync('is_login', res.result.is_login)
    //     wx.setStorageSync('is_bind', res.result.is_bind)
    //     wx.setStorageSync('user', res.result.user_data)
    //     this.setData({
    //       user_data: res.result.user_data,
    //       is_bind: res.result.is_bind,
    //       is_login: res.result.is_login,
    //     })
    //     if (res.result.is_bind) {
    //       this.setData({
    //         course_data: res.result.user_data.courses
    //       })
    //     }

    //   })
  },
  getData() {
    //is_wx_killer状态量的获取是为了在微信审核的时候将微信禁止的一些功能进行关闭

    db.collection('system').doc("b00064a760adf4f01b0d1c1c4ad6f5ba").get().then(res => {
      console.log(res)
      this.setData({
        is_wx_killer: res.data.is_wx_killer
      })
    })
    wx.cloud.callFunction({
      name: 'share',
      data: {
        action: 'get_share_list',
        page_index: this.data.page_index, //当前页数 1页20条
        sort_type: this.data.sort_type, //按浏览量，按时间排序
      }
    }).then(res => {
      console.log(res)
      //let tem = Object.assign([], res.result.share_list, this.data.share_data);
      this.setData({
        share_data: res.result.share_list,
        share_star: res.result.star_list
      })
      console.log(this.data.share_data, this.data.share_star)
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    console.log("====>")
    this.getData()
  },
  onReachBottom() {
    this.setData({
      page_index: this.data.page_index + 1
    })
    this.getData()
  },
  // 顶部导航栏选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
    if (e.currentTarget.dataset.id === '1') {
      this.setData({
        sort_type: '_createTime'
      })
    } else {
      this.setData({
        sort_type: 'view_num'
      })
    }

    this.getData()
  },

  add_share() {

    let r = wx.getStorageSync('is_bind')
    if (r === false) {
      wx.showToast({
        title: '请先绑定教务网',
        icon: 'none'
      })
      return;
    }

    let j = wx.getStorageSync('is_login')
    if (j === false) {
      this.setData({
        modalName: 'DialogModal1'
      })
      return;
    }
    //进到发动态的页面
    wx.navigateTo({
      url: './search',
    })

  },
  go_detail(e) {
    console.log(e)
    let share = e.currentTarget.dataset.share
    wx.navigateTo({
      url: './detail?share=' + share._id,
    })
  },
  hideModel() {
    this.setData({
      modalName: ''
    })
  },
  change_star(e) {
    console.log(e);
    let r = wx.getStorageSync('is_bind')
    if (r === undefined || !r) {
      wx.showToast({
        title: '请先绑定教务网',
        icon: 'none'
      })
      return;
    }
    Array.prototype.indexOf = function (val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function (val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    if (e.currentTarget.dataset.change_type === 'add_star') {
      var star_list = this.data.share_star;
      var share_list = this.data.share_data;
      star_list.push(e.currentTarget.dataset.target_id);
      share_list[e.currentTarget.dataset.index].star_num = share_list[e.currentTarget.dataset.index].star_num + 1;
      this.setData({
        share_data: share_list,
        share_star: star_list
      })
    } else {
      var star_list = this.data.share_star;
      var share_list = this.data.share_data;
      star_list.remove(e.currentTarget.dataset.target_id);
      share_list[e.currentTarget.dataset.index].star_num = share_list[e.currentTarget.dataset.index].star_num - 1;
      this.setData({
        share_data: share_list,
        share_star: star_list
      })
    }
    wx.cloud.callFunction({
      name: 'comment',
      data: {
        action: e.currentTarget.dataset.change_type,
        target_id: e.currentTarget.dataset.target_id,
        target_type: e.currentTarget.dataset.target_type,
      }
    }).then(res => {
      console.log(res)
      //this.getData();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData()
    this.loginData()
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData()
  },
  hideModel() {
    this.setData({
      modalName: ''
    })
  },
  getUserProfile: function (e) {
    this.setData({
      modalName: null
    })

    wx.getUserProfile({
      desc: '为了更好的体验',
      success: res => {
        console.log(res)
        wx.cloud.callFunction({
          name: 'user',
          data: {
            action: 'insert_user_opendata',
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
            gender: res.userInfo.gender
          }
        }).then(res => {
          console.log(res)
          app.globalData.is_login = true;
          wx.setStorageSync('is_login', true);
          wx.navigateTo({
            url: './search',
          })
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  input_name: function (e) {
    this.params.name = e.detail.value;
  },
  input_teacher: function (e) {
    this.params.teacher = e.detail.value;
  },
  input_type: function (e) {
    this.setData({
      type: this.data.types[e.detail.value]
    })
    this.params.type = this.type_param[e.detail.value]
  },
  search: function () {
    if (this.data.name) {
      this.data.history.push(this.data.name)
      wx.setStorage({
        key: 'course_history',
        data: this.data.history,
      })
    }
    wx.navigateTo({
      url: 'search?name=' + this.params.name + "&teacher=" + this.params.teacher + "&type=" + this.params.type,
    })
  }
})