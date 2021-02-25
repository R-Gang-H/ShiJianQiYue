// pages/withdrawal/withdrawal.js
import { globalUrls } from "../../utils/global.js"
const app = getApp()
var util = require('../../utils/util.js')
let aliImg = globalUrls.aliImg
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:'',
    wallet: aliImg + "wallet.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getMoney()
  },
  onShow:function(){
    this.getMoney()
  },
  getMoney: function () {
    let that = this
    wx.request({
      url: globalUrls.baseUrl + '/pay/wallet/detail',
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      success: function (res) {
        // console.log(res.data.data)
        var data = res.data.data
        var balance = data.balance
        balance = balance.toFixed(2)
        that.data.balance = balance
        that.setData({
          balance: balance
        })
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },
  // 提现说明
  explain:function(){
    wx.navigateTo({
      url: '/pages/explain/explain',
    })
  },
  // 跳转提现记录
  record:function(){
    wx.navigateTo({
      url: '/pages/withdrawalsRecord/withdrawalsRecord',
    })
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