/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */

// miniprogram/pages/course/detail.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard: false,
    share_detail: {},
    InputBottom: 0,
    show_comment: false,
    destroy_tag: false,
    comment_content: '',
    share_detail_id: '',
    share_comment_data: [],
    share_or_comment_star: [],
    to_whome: '',
    show_comment_back: false,
    comment_back_comment_id: '',
    share_id: '',
    loader: {
      load_show: false,
      isLoad: false
    },
    modalName: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let _id = options.share
    this.setData({
      share_detail_id: _id
    })
  },
  show_comment() {
    let r = wx.getStorageSync('is_bind')
    let j = wx.getStorageSync('is_login')
    if (r === undefined || !r) {
      wx.showToast({
        title: '请先绑定教务网',
        icon: 'none'
      })
      return;
    }
    if (j === undefined || !j) {
      this.setData({
        modalName: 'DialogModal1'
      })
      return;
    }
    this.setData({
      show_comment: true
    })
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height,

    })
  },
  InputBlur(e) {
    console.log("=>" + this.data.comment_content)
      this.setData({
        InputBottom: 0,
        show_comment: false,
        show_comment_back: false,
      })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.share_detail.images // 需要预览的图片http链接列表
    })
  },
  comment_Input(e) {
    console.log(e.detail.value)
    this.setData({
      comment_content: e.detail.value
    })
  },
  send_comment(e) {
    console.log("==>" + this.data.comment_content)
    wx.cloud.callFunction({
      name: 'share',
      data: {
        action: 'add_share_comment',
        share_id: this.data.share_detail._id,
        content: this.data.comment_content
      }
    }).then(res => {
      console.log(res);

      this.setData({
        //share_detail: res.result.data,
        InputBottom: 0,
        show_comment: false
      })
      this.getData();
    }).catch(err => {
      console.error(err);
      wx.showToast({
        title: '请绑定教务网',
      })
      this.setData({
        InputBottom: 0,
        show_comment: false
      })
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
    this.getData();
  },
  getData() {
    this.setData({
      loader: {
        load_show: true,
        isLoad: true
      }
    })
    wx.cloud.callFunction({
      name: 'comment_back',
      data: {
        action: 'get_share_detail_page_data',
        share_detail_id: this.data.share_detail_id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        share_detail: res.result.share_list,
        share_comment_data: res.result.comment_list,
        share_or_comment_star: res.result.star_list
      })
      this.setData({
        loader: {
          load_show: false,
          isLoad: true
        }
      })
    })

  },
  change_star(e) {
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
    if (e.currentTarget.dataset.target_type === 'share') {
      var share_detail = this.data.share_detail
      var star_list = this.data.share_or_comment_star
      if (e.currentTarget.dataset.change_type === 'add_star') {
        star_list.push(e.currentTarget.dataset.target_id);
        share_detail.star_num = share_detail.star_num + 1;
      }
      else {
        star_list.remove(e.currentTarget.dataset.target_id);
        share_detail.star_num = share_detail.star_num - 1;
      }
      this.setData({
        share_or_comment_star: star_list,
        share_detail: share_detail
      })
    }
    else {
      var star_list = this.data.share_or_comment_star;
      var share_comment_data = this.data.share_comment_data;
      if (e.currentTarget.dataset.change_type === 'add_star') {
        star_list.push(e.currentTarget.dataset.target_id);
        share_comment_data[e.currentTarget.dataset.index].star_num = share_comment_data[e.currentTarget.dataset.index].star_num + 1;
      }
      else {
        star_list.remove(e.currentTarget.dataset.target_id);
        share_comment_data[e.currentTarget.dataset.index].star_num = share_comment_data[e.currentTarget.dataset.index].star_num - 1;
      }
      this.setData({
        share_comment_data: share_comment_data,
        share_or_comment_star: star_list
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

  send_comment_back(e) {
    console.log(e)
    wx.cloud.callFunction({
      name: 'comment_back',
      data: {
        action: 'add_comment_back',
        comment_back_id: this.data.comment_back_comment_id,
        share_id: this.data.share_id,
        to_whome: this.data.to_whome,
        comment_back_content: this.data.comment_content
      }
    }).then(res => {
      console.log(res);
      this.setData({
        show_comment_back: false,
        comment_content:'',
        comment_back_content:''
      })
      this.getData()
    })
  },
  show_comment_back(e) {
    let r = wx.getStorageSync('is_bind')
    let j = wx.getStorageSync('is_login')
    if (r === undefined || !r) {
      wx.showToast({
        title: '请先绑定教务网',
        icon: 'none'
      })
      return;
    }
    if (j === undefined || !j) {
      this.setData({
        modalName: 'DialogModal1'
      })
      return;
    }
    if (this.data.show_comment === true) {
      this.setData({
        InputBottom: 0,
        show_comment: false
      })
    }
    console.log(e)
    this.setData({
      to_whome: e.currentTarget.dataset.comment_to_whom,
      show_comment_back: true,
      InputBottom: 0,
      comment_back_comment_id: e.currentTarget.dataset.comment_back_id,
      share_id: e.currentTarget.dataset.share_id
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

  hideModal() {
    this.setData({
      modalName: ''
    })
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

  }
})