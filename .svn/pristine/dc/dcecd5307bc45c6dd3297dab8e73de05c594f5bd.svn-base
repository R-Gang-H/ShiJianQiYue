// pages/attestationExplain/attestationExplain.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    about: aliImg + "tup.png",
    systemInfo: {},  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 点击下载app
  onDownloadTap:function(e){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        if (res.platform == "devtools") {
          wx.navigateTo({
            url: '/pages/outurl/ios/ios',
          })
        } else if (res.platform == "ios") {
          wx.navigateTo({
            url: '/pages/outurl/ios/ios',
          })
        } else if (res.platform == "android") {
          console.log("android")
        }
      }
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