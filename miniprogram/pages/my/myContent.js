/**

 * 如有技术问题或商业合作，可以添加本人微信:Exixir99

 * @author 全黑科技

 * @Time 2021-06-16 21:49:01

 * @URL http://www.abtwork.com/

 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        share_data: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    getData() {
        wx.cloud.callFunction({
            name: 'share',
            data: {
                action: 'get_my_share',
                page_index: 0,
                sort_type: "_createTime"
            }
        }).then(res => {
            console.log(res)
            if(res.result.share_list.length>0){
                this.setData({
                    share_data: res.result.share_list
                })
            }
            else{
             wx.showToast({
               title: '暂无帖子',
               icon:'error'
             })   
             wx.navigateTo({
               url: 'pages/my/my',
             })
            }
        })
    },
    delete_my_share(e) {
        let that=this;
        wx.showModal({
            title: '提示',
            content: '确定要删帖吗',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    console.log(e)
                    //删帖
                    wx.cloud.callFunction({
                        name:'share',
                        data:{
                            action:"delete_my_share",
                            target_id:e.currentTarget.dataset.target_id
                        }
                    }).then(res=>{
                        console.log(res);
                        that.getData();
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    go_detail(e) {
        console.log(e)
        let share = e.currentTarget.dataset.share
        wx.navigateTo({
          url: '/pages/course/detail?share='+share._id,
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