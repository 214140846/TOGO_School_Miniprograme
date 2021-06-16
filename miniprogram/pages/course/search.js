// miniprogram/pages/add/add.js
const wxGreenCheck = require('../../utils/greenCheck.js')
const db = wx.cloud.database();
const app = getApp();
import randomName from '../../utils/random-name';
const maxCount = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    imageCunt: 0,
    title: '',
    content: '',
    value: '',
    TabCur: 0,
    unname: false,
    un_nickName: '',
    is_loading: false,
    is_wx_killer:true
  },
  previewImage(ev) {
    //查看对应的图片
    const id = ev.target.dataset.id;
    wx.previewImage({
      current: this.data.tempFilePaths[id],
      urls: [this.data.tempFilePaths[id]]
    })
  },
  //定部栏选择
  // 顶部导航栏选择
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
    if (e.currentTarget.dataset.id === '1') {
      this.setData({
        unname: true,
        un_nickName: randomName.getNickName()
      })
    } else {
      this.setData({
        unname: false,
        un_nickName: ''
      })
    }
  },
  change_nickName() {
    this.setData({
      un_nickName: randomName.getNickName()
    })
  },
  toDelete(ev) {
    const id = ev.target.dataset.id;
    // 删除数组中对应index的元素，会改变原数组,修改的是tempFilePaths里面的元素,tempFilePaths本身引用没有改变，页面没有监听到
    // const tempFilePath = this.data.tempFilePaths.splice(index, 1);
    //过滤生成一个新的数组
    const tempFilePaths = this.data.tempFilePaths.filter((item, index) => {
      return index != id
    })
    this.setData({
      imageCunt: this.data.imageCunt - 1,
      tempFilePaths
    })
  },
  setTitle(ev) {
    this.setData({
      title: ev.detail.value
    })
  },
  setContent(ev) {
    this.setData({
      content: ev.detail.value
    })
  },
  addImage() {
    const rest = maxCount - this.data.imageCunt
    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const imageCunt = res.tempFilePaths.length
        const restImage = maxCount - this.data.imageCunt
        console.log(res, imageCunt);
        if (imageCunt > restImage) {
          wx.showModal({
            title: `你最多还能添加${restImage}张图片`
          })
        } else {
          //如果直接arrA.push(arrB); 则arrB只会作为了arrA的一个元素，并且是修改原数组
          const tempFilePaths = this.data.tempFilePaths.concat(res.tempFilePaths)
          console.log(this.data.tempFilePaths)
          this.setData({
            tempFilePaths,
            imageCunt: this.data.imageCunt + imageCunt
          })
        }
      }
    })
  },
  go() {
    var that = this;
    //判断不能为空
    const {
      imageCunt,
      content
    } = this.data
    if (!imageCunt && !content) {
      wx.showModal({
        title: `图片文字内容不能同时为空`
      })
      return
    }
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    this.setData({
      is_loading: true
    })
    //微信绿色内容接口
    if (!imageCunt && content !== '') {
      //图为空
      wxGreenCheck.wxTextCheck(content).then(res => {
        var fileIDs = [];
        that.changeDb(fileIDs, new Date().getTime());
      })
    } else {
      const index = new Date().getTime()
      that.uploadFile(index)
    }


  },
  uploadFile(index) {
    const p = new Promise((resolve, reject) => {
      const tempFilePaths = this.data.tempFilePaths
      const fileIDs = []
      for (let i = 0; i < tempFilePaths.length; i++) {
        let cloudPath = `share/invitaion_${index}/image_${i}.png`
        const _ = db.command
        wx.cloud.uploadFile({
          cloudPath,
          filePath: tempFilePaths[i],
        }).then(res => {
          console.log('上传成功', res);
          wx.hideLoading();
          wx.showLoading({
            title: '检测图片安全中',
          })
          wx.cloud.callFunction({
            name: "contentSec",
            data: {
              action: 'img_sec_check',
              img: res.fileID
            }
          }).then(ress => {
            wx.hideLoading();
            fileIDs.push(res.fileID)
            if (fileIDs.length === tempFilePaths.length) {
              resolve(fileIDs)
              console.log('//改变状态')
            }
          }).catch(errr => {
            console.log(errr)
            wx.hideLoading();
            wx.showModal({
                title: '风险提示',
                content: '这是不安全的图片或内容',
                showCancel: false
              }),
              this.setData({
                is_loading: false
              })
            wx.cloud.deleteFile({
              fileList: [res.fileID]
            }).then(res => {
              console.log('文件已删除')
            })
          })
        })

      }
    })
    p.then(fileIDs => {
      this.changeDb(fileIDs, index)
    })

  },
  //修改数据库
  changeDb(fileIDs, index) {
    //云函数 上传图片和发帖用户信息以及内容
    wx.cloud.callFunction({
      name: 'share',
      data: {
        action: 'add_share',
        images: fileIDs,
        content: this.data.content,
        un_nickName: this.data.un_nickName === '' ? '' : this.data.un_nickName,
      }
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '发帖成功',
        duration: 1500
      }).then(res => {
        this.setData({
          is_loading: false
        })
        wx.navigateBack({
          delta: 1,
        })
      })

    }).catch(err => {
      console.log(err)
      wx.showToast({
        icon: 'none',
        title: '发帖失败',
      })
    })
  },

  showShare() {

    wx.hideLoading()
    wx.showToast({
      title: '发布成功',
      success: res => {
        app.globalData.switchTime = true
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/course/course',
          })
        }, 500)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断是否登陆
    wx.cloud.callFunction({
      name: 'user',
      data: {
        action: "get_user_data"
      }
    }).then(res => {
      console.log(res);
      this.setData({
        user_data: res.result.user_data
      })
      db.collection('system').doc("b00064a760adf4f01b0d1c1c4ad6f5ba").get().then(res => {
        console.log(res)
        this.setData({
          is_wx_killer: res.data.is_wx_killer
        })
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



  },
  chooseImage() {

    //选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        const imageCunt = res.tempFilePaths.length
        console.log(res, imageCunt);
        console.log(imageCunt ? (imageCunt < 9 ? true : false) : true)
        this.setData({
          tempFilePaths: res.tempFilePaths,
          imageCunt
        })
      }
    })
  },
  //点击tabbar时触发
  onTabItemTap(ev) {
    //console.log("-=-=-=-=-=-=-=-=")
    //this.chooseImage()
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