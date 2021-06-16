/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
var app = getApp();
var RSA = require('../../utils/wxapp_rsa.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "jwc",
    types: {
      id: {
        name: "信息门户",
        url: "/id_bind",
        verify: "id_verify",
        password: "id_password",
        help: "密码为教务网账号密码，"
      },
      library: {
        name: "图书馆",
        url: "/library/bind",
        verify: "library_verify",
        help: "密码错误可自行上教务网进行"
      },
      jwc: {
        name: "教务处",
        url: "/bind",
        verify: "jwc_verify",
        password: "jwc_password",
        help: "说明信息："
      }
    },
    openId: '',
    userid_focus: false,
    passwd_focus: false,
    class_focus: false,
    angle: 0,
    help_status: false,
    tem_file_id: '',
    username: '',
    password: '',
    check_word: '',
    the_cookie: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.type = options.type || this.data.type;
    console.log(this.data.type)
    this.setData({
      type: this.type
    })
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },

  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
  UidInput: function (e) {
    if (e.detail.value.length >= 13) {
      wx.hideKeyboard();
    }
  },
  ClassInput: function (e) {

  },

  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    } else if (e.target.id == 'user_class') {
      this.setData({
        'class_focus': true
      });
    } else if (e.target.id == 'resetUid') {
      this.setData({
        'resetUid_focus': true
      });
    } else if (e.target.id == 'idCardNO') {
      this.setData({
        'idCardNO_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    } else if (e.target.id == 'user_class') {
      this.setData({
        'class_focus': false
      });
    } else if (e.target.id == 'resetUid') {
      this.setData({
        'resetUid_focus': false
      });
    } else if (e.target.id == 'idCardNO') {
      this.setData({
        'idCardNO_focus': false
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        isLoading: false
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  // 登录
  login(e) {
    var form = e.detail.value
    console.log(form)
    if (form.class_name == "" || form.uid == "" | form.pwd == "") {
      wx.showToast({
        icon: 'error',
        title: '请输入完整',
      })
      return
    }
    var params = {
      action: 'login_check',
      username: form.uid,
      // user: 'l630014003',
      password: form.pwd,
      check_word: form.vcode,
      the_cookie: this.data.the_cookie,

    }
    wx.showLoading({
      title: '访问教务网中...',
    })
    if (form.uid == '201888888' && form.pwd == '1') {
      wx.setStorageSync('is_bind', true)
      wx.showToast({
        icon: 'success',
        title: '成功绑定教务网',
        duration: 3000
      })
      wx.navigateBack({
        delta: 1,
      })
    }
    else{
      wx.showToast({
        icon: 'error',
        title: '账号密码错误',
        duration: 3000
      })
    }
    //云函数根据自己学校教务网进行登陆相关设定，此处方便演示 密码账号均为演示账号 201888888 1
    //只是提供用户绑定教务网相关思路
    // wx.cloud.callFunction({ name: 'login_data', data: params }).then(res => {
    //   console.log(res);
    //   if (res.result.errcode == 588) {
    //     wx.hideLoading()
    //     wx.showToast({
    //       'icon': 'error',
    //       title: res.result.errmsg,
    //     })
    //     this.getVcode()
    //     return;
    //   }
    //   else {
    //     wx.setStorageSync('is_bind', true)
    //     wx.showToast({
    //       icon: 'success',
    //       title: '成功绑定教务网',
    //       duration:3000
    //     })
    //     wx.navigateBack({
    //       delta: 1,
    //     })
    //   }
    // }).catch(res => {
    //   console.log(res)
    //   wx.showToast({
    //     icon: 'error',
    //     title: '教务网崩溃了!晚点再试试',
    //   })


    //   // this.setData({
    //   //   username:'',
    //   //   password:'',
    //   //   check_word:''
    //   // })
    // })
  }
})