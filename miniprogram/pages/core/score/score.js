// pages/score/showScore/showScore.js
//var wxCharts = require('../../utils/wxcharts.js');
var util = require('../../../utils/time.js');
var app = getApp();
var lineChart = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    stuId: "",
    password: "",
    jsonContent: '',
    PicURL: "",
    PicArr: [""],
    hasUserInfo: false,
    isLoading: true,
    showGraphic: true,
    painting: {},
    shareImage: '',
    isLoading: true,
  },
  /**
   * 生命周期函数--监听页面加载   
   */
  onLoad: function (options) {
    //获取成绩信息
    this.GetScoreData();
  },
  /**
   * 查询成绩
   */
  GetScoreData: function () {
    //用户记录都存储在缓存中，加快了打开成绩和教务网的速度，减少按量付费服务器的计费
    let user = wx.getStorageSync('user');
    let score_data = user.score_data

    if (!score_data) {
      console.log("===")
      let user = wx.getStorageSync('user');
      this.setData({
        isLoading: false,
        jsonContent: user.scores
      })
    } else {
      this.setData({
        jsonContent: score_data,
        isLoading: false
      })
      wx.showToast({
        title: "更新完成",
        icon: "succeed",
        duration: 2000
      })
      return
    }



  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: "更新完成",
      icon: "succeed",
      duration: 2000
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  touchHandler: function (e) {
    // console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  charts: function (e) {
    var that = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth * 0.95;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData();
    console.log(simulationData)
    var that = this;
    if (simulationData.categories.length <= 0) {
      that.setData({
        showGraphic: false
      })
    } else {
      lineChart = new wxCharts({
        canvasId: 'lineCanvas',
        type: 'line',
        categories: simulationData.categories,
        animation: true,
        background: '#7acfa6',
        series: [{
            name: '算术平均分',
            data: simulationData.data1,
            format: (val) => val + "分"
          },
          {
            name: '加权平均分',
            data: simulationData.data2,
            format: (val) => val + "分"
          }
        ],
        xAxis: {
          disableGrid: true
        },
        yAxis: {
          title: '每学期学分趋势',
          format: (val) => val.toFixed(2),
          min: 60
        },
        width: windowWidth,
        height: 200,
        dataLabel: false,
        dataPointShape: true,
        extra: {
          lineStyle: 'curve'
        }
      });

    }
  },

  eventDraw() {
    var that = this;
    if (that.data.shareImage != '') {
      wx.previewImage({
        urls: [that.data.shareImage],
      })
      wx.showToast({
        title: '图片已保存至相册，记得分享给朋友们哟',
        icon: 'none',
        duration: 3000
      })
      return
    }
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })

    let userNickName = app.globalData.nickName;
    if (userNickName == '') {
      userNickName = that.data.stuId;
    }

    let nickName = {
      type: 'text',
      content: userNickName,
      fontSize: 30,
      color: '#000',
      textAlign: 'center',
      top: 350,
      left: 300,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 160
    };
    var newArr = [];
    let countNum = 0;
    const mockData = that.data.jsonContent;
    for (let p in mockData) {
      for (let q in mockData[p].score) {
        if (mockData[p].score[q].score >= 60) {
          countNum++;
          let newTempArr = {
            SerialNo: countNum,
            className: mockData[p].score[q].className,
            period: mockData[p].score[q].period,
            credit: mockData[p].score[q].credit,
            score: mockData[p].score[q].score
          };
          newArr.push(newTempArr);
        }
      }
    }
    let midNum = 0;
    if (newArr.length % 2 == 0 && newArr.length > 0) {
      midNum = newArr.length / 2;
    } else {
      midNum = (newArr.length + 1) / 2;
    }
    var whitePaperHeight = (midNum * 20) + 35;
    var pushArr = [{
      type: 'image',
      url: 'https://636c-cloud1-2gz3zqqx6833b79c-1306077792.tcb.qcloud.la/system/1731621763757_.pic_hd.jpg?sign=cdb50327845f7b7b40df1c58c7b15d7f&t=1623830953',
      top: 0,
      left: 0,
      width: 600,
      height: 390
    }, {
      type: 'image',
      url: 'https://636c-cloud1-2gz3zqqx6833b79c-1306077792.tcb.qcloud.la/system/4251622285609_.pic.jpg?sign=ebcb3b9e273a0c90fe352668a4d3efcf&t=1623830985',
      top: 390 + whitePaperHeight,
      left: 0,
      width: 600,
      height: 275
    }];

    let makeupFullPicArr = [{
      type: 'rect',
      background: '#ffffff',
      top: 390,
      left: 11,
      width: 576,
      height: whitePaperHeight
    }, {
      type: 'rect',
      background: '#f54c5b',
      top: 390,
      left: 0,
      width: 11,
      height: whitePaperHeight
    }, {
      type: 'rect',
      background: '#f54c5b',
      top: 390,
      left: 587,
      width: 13,
      height: whitePaperHeight
    }, {
      type: 'text',
      content: '序号',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 17,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 30
    }, {
      type: 'text',
      content: '课程名称',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 48,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 200
    }, {
      type: 'text',
      content: '学分',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 245,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 30
    }, {
      type: 'text',
      content: '成绩',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 273,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 30
    }, {
      type: 'text',
      content: '序号',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 310,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 30
    }, {
      type: 'text',
      content: '课程名称',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 338,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 200
    }, {
      type: 'text',
      content: '学分',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 528,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 30
    }, {
      type: 'text',
      content: '成绩',
      fontSize: 13,
      color: '#000',
      textAlign: 'left',
      top: 400,
      left: 558,
      lineHeight: 20,
      MaxLineNumber: 1,
      breakWord: true,
      width: 30
    }];
    pushArr.push(nickName);
    pushArr = pushArr.concat(makeupFullPicArr);

    var topX = 400;
    var leftY = 20;
    for (let i = 0; i < midNum; i++) {
      topX = topX + 20;
      let tempNo = {
        type: 'text',
        content: newArr[i].SerialNo + '',
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        top: topX,
        left: leftY,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 20
      };
      pushArr.push(tempNo);
      let tempClassName = {
        type: 'text',
        content: newArr[i].className,
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        top: topX,
        left: leftY + 25,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 180
      };
      pushArr.push(tempClassName);
      let tempCredit = {
        type: 'text',
        content: newArr[i].credit+'',
        fontSize: 13,
        color: '#000',
        textAlign: 'center',
        top: topX,
        left: leftY + 230,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 20
      };
      pushArr.push(tempCredit);
      let tempScore = {
        type: 'text',
        content: newArr[i].score+'',
        fontSize: 13,
        color: '#000',
        textAlign: 'center',
        top: topX,
        left: leftY + 260,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 20
      };
      pushArr.push(tempScore);
    }

    topX = 400;
    leftY = 310;
    for (let i = midNum; i < newArr.length; i++) {
      topX = topX + 20;
      let tempNo = {
        type: 'text',
        content: newArr[i].SerialNo + '',
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        top: topX,
        left: leftY,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 20
      };
      pushArr.push(tempNo);
      let tempClassName = {
        type: 'text',
        content: newArr[i].className+'',
        fontSize: 14,
        color: '#000',
        textAlign: 'left',
        top: topX,
        left: leftY + 25,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 180
      };
      pushArr.push(tempClassName);
      let tempCredit = {
        type: 'text',
        content: newArr[i].credit+'',
        fontSize: 13,
        color: '#000',
        textAlign: 'center',
        top: topX,
        left: leftY + 230,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 20
      };
      pushArr.push(tempCredit);
      let tempScore = {
        type: 'text',
        content: newArr[i].score+'',
        fontSize: 13,
        color: '#000',
        textAlign: 'center',
        top: topX,
        left: leftY + 255,
        lineHeight: 20,
        MaxLineNumber: 1,
        breakWord: true,
        width: 20
      };
      pushArr.push(tempScore);
    }
    console.log(newArr);
    that.setData({
      painting: {
        width: 600,
        height: 390 + whitePaperHeight + 275,
        clear: false,
        views: pushArr
      }
    })
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '图片已保存至相册，记得分享给朋友们哟',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  eventGetImage(event) {
    var that = this;
    console.log(event)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
      wx.previewImage({
        urls: [tempFilePath],
      })
      that.eventSave();
    }
  },
  refreshData: function () {
    wx.redirectTo({
      url: '/pages/index/vcode?to=score&update=1',
    })
  }
})