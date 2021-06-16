//index.js

const time = require('../../utils/time.js')
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times: [
      "08:30-10:00",
      "10:15-11:45",
      "14:30-16:00",
      "16:15-17:45",
      "19:00-20:30",
    ],
    isLogin: false,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 800,
    circular: true,
    user_data: {},
    // 轮播图
    imgUrls: [],

    "navs": [{
        key: "timetable",
        desc: "课表",
        verify: "jwc"
      },
      {
        key: "score",
        desc: "成绩",
        verify: "jwc"
      },
      {
        key: "gold",
        desc: "折上折助手",
        verify: ""
      },
      // {
      //   key: "lost",
      //   desc: "失物招领",
      //   verify: ""
      //}, 
      // {
      //   key: "gold",
      //   desc: "折上折助手",
      //   verify: ""
      // },
      // {
      //   key: "lovewall",
      //   desc: "表白墙",
      //   verify: "jwc"
      // },
      // {
      //   key: "shop",
      //   desc: "本地生活",
      //   verify: "jwc"
      // },
      {
        key: "more",
        desc: "更多功能",
        verify: "jwc"
      }
    ],

    //轮播图的切换事件
    swiperChange: function (e) {
      this.setData({
        swiperCurrent: e.detail.current
      })
    },
    //轮播图点击事件
    swipclick: function (e) {
      console.log(this.data.swiperCurrent)
    },
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.share_detail.images // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    //system库主要是存放一些学校的开学时间，是否在微信审核等数据,包括很多一段时间就会有变动的数据，为了不需要每次更改都重上线小程序，放在云函数中和云存储中是最合适不过的了 这里因为方便展示的原因写死数据
    let lunbo_data = ['/images/3961622281214_.pic_hd.jpg']
    this.setData({
      imgUrls: lunbo_data,
    })
    db.collection('system').doc('b00064a760b0b3541bc142fe07b89285').get().then(res => {
      app.globalData.school_week = 1 + time.get_date_diff(res.data.school_open_date, time.formatTime_year_month_day(new Date()))
      this.setData({
        imgUrls: lunbo_data,
        week_day: app.globalData.week_day,
        school_week: app.globalData.school_week
      })

      //轮播图数组存放在云数据库中，方便后续进行更换

      // db.collection('lunbo_system').doc('28ee4e3e60b1d02c1dcf452150abc401').get().then(res => {
      //   console.log(res, '轮播图');
      //   let lunbo_data = ['/images/3961622281214_.pic_hd.jpg']
      //   this.setData({
      //     imgUrls: lunbo_data,
      //     week_day: app.globalData.week_day,
      //     school_week: app.globalData.school_week
      //   })
      // })
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
    //this.getTodayClass()

  },
  //获取用户登录、课表等数据
  getData() {
    this.nowClass()
    let is_bind = wx.getStorageSync('is_bind')
    //因为用户授权后的动作是改数据库数据，为用户记录赋上微信名等属性，所以这里做演示，就不存储用户授权相关记录，有需要根据自己实际情况进行修改
    if (is_bind) {
      console.log(app.globalData.user_data)
      wx.setStorageSync('is_login', false)
      wx.setStorageSync('user', app.globalData.user_data)

      this.setData({
        is_bind: true,
        is_login: false,
        user_data: app.globalData.user_data,
      })

      console.log(this.data.week_day)
      this.setData({
        today_class: app.globalData.user_data.course.course['星期' + app.globalData.week_day],
        isLoading: false
      })
    }




  },
  nowClass() {
    let time_arr = this.data.times;
    for (var i = 0; i < time_arr.length; i++) {
      var start = new Date(time.formatTime_fanxiexian(new Date()) + ' ' + time_arr[i].split('-')[0]).getTime();
      var end = new Date(time.formatTime_fanxiexian(new Date()) + ' ' + time_arr[i].split('-')[1]).getTime();
      var now = new Date().getTime();
      if (now > start && now < end) {
        console.log(i + "=======>", "====>")
        this.setData({
          now_class: i
        })
        break;
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (app.user_token) {
      this.data.pull = true
      this.getStuclass()
    } else
      wx.stopPullDownRefresh();
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
  init: function (data = undefined) {
    var that = this;
    var not_flag = wx.getStorageSync("not_flag");
    if (app.low_day && (not_flag == false)) {
      // 开学前半个月不使用缓存
      wx.removeStorageSync("stuclass");
    }

    if (data != undefined) {
      /*
      获取到服务器的版本后，初始化完毕
      然后到index进行判断是否为新版本，如果是新版本，则清空缓存重新获取信息。
     */
      that.kb_version = data.version;
      that.slides = data.slides;
      if (that.kb_version != wx.getStorageSync("kb_version")) {
        wx.removeStorageSync("stuclass"); //清空stuclass，重新进行课表获取。
        wx.setStorageSync("kb_version", that.kb_version);
      }
      wx.setStorageSync("slides", that.slides);
    } else {
      that.kb_version = wx.getStorageSync("kb_version")
      that.slides = wx.getStorageSync("slides")
    }
    if (app.user_token) {
      var stuclass = wx.getStorageSync("stuclass");
      if (stuclass == "" && app.offline == false) {
        this.getStuclass(1)
      } else {
        this.getTodayClass(stuclass)
      }
    }
    this.setData({
      "notices": this.slides
    })
  },
  /*跳转到登陆界面，待完善研究生登陆*/
  auth: function (e) {
    console.log(e)
    var type = "jwc"
    wx.navigateTo({
      url: '/pages/login/login?type=' + type,
    })
  },
  /* 获取课程表 */
  getStuclass: function (options) {

  },
  /* 获取今天要上的有哪些课 */
  getTodayClass: function (stuclass) {
    app.today = parseInt(new Date().getDay());
    var today;
    if (app.today == 0) {
      app.today = 6
      today = 6;
    } else
      today = app.today - 1 //数组从0开始的，
    var todays = []
    for (var cls in stuclass) { // 先遍历节
      var today_class = stuclass[cls].classes[today]
      if (Array.isArray(today_class)) // 如果是数组的话,那就是有课
      {
        var flag = false
        for (var i = 0; i < today_class.length; i++) {
          for (var j = 0, k = today_class[i].weeks.length; j < k; j++) {
            if (app.week == today_class[i].weeks[j]) {
              flag = true;
              break
            }
          }
          if (flag == true) { // 说明是该周的课，记录下来，break
            if (!app.low_day && today_class[i].name.indexOf("未选中") != -1) // 大于15天，
              continue
            var todaydata = today_class[i]; // 找到这门课了
            todays.push({
              cls: todaydata,
              classtime: todaydata.begin + "-" + (todaydata.num + todaydata.begin) + "节"
            })
            break
          }
        }
      }
    }
    console.log(todays.length)
    if (todays.length == 0) {
      this.setData({
        remind: "你今天没有课哦"
      })
    } else {
      this.setData({
        courses: todays,
        remind: ""
      })
    }
  },
  navigatetokb: function () {
    wx.navigateTo({
      url: '/pages/core/timetable/timetable',
    })
  },
  submit: function (e) {
    var key = e.detail.target.dataset.key //要去的地方。
    var verify = e.detail.target.dataset.verify; //需要的权限
    var content = ""
    var url = ""
    console.log(app)
    let is_bind = wx.getStorageSync('is_bind')


    if (!is_bind) {
      wx.showModal({
        title: '绑定提示',
        content: content,
        confirmText: "去绑定",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
      return;
    }
    if (key === 'gold') {
      wx.navigateToMiniProgram({
        appId: 'wxd7f640f8d9c0e1c3',
        path: 'pages/index/index',
        envVersion: 'release',
        success(res) {
          // 打开成功
          console.log(res)
          return;
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/core/' + key + "/" + key,
        fail: function () {
          wx.showToast({
            title: '即将开放',
            icon: 'none'
          })
        }
      })
    }
  },
})