// pages/set/personalInformation/personalInformation.js
import {
  globalUrls
} from "../../../utils/global.js"
var util = require('../../../utils/util.js')
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"13811063201",
    mobile: aliImg + "phone.png",
    arrow: aliImg + "arrow.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  to_call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  // 退出登录
  loginOut:function () {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync("userId");
          util.logout()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})