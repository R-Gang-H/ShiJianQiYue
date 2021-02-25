// pages/sharePrompt/sharePrompt.js
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取商品信息
    var goods = JSON.stringify(options.goods);
    console.log("sharePrompt 商品信息==>" + goods);
    this.setData({
      goods: goods
    })
  },
  // 转发
  shareClick: function() {
    // 跳转圈子回话列表
    wx.redirectTo({
      url: '/pages/shareConversation/shareConversation?goods=' + this.data.goods,
      complete: (res) => {},
      fail: (res) => {},
      success: (res) => {},
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})