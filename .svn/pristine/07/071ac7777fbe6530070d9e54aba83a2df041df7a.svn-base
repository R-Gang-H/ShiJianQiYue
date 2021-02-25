// pages/confirmDue/confirmDue.js


import {
  globalUrls
} from "../../utils/global.js"
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyBzj: '', //应约金
    moneyDesc: '', //应约金描述
    yyNum: 0, //应约份数
    productId: '', //商品ID

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productId: options.productId,
      moneyBzj: options.price,
      moneyDesc: "应约该商品，需缴纳保证金：" + options.price + "元"
    })
  },
  //改变分量
  changeNum: function (e) {
    this.setData({
      yyNum: e.detail.value,
      moneyDesc: "应约该商品，需缴纳保证金: " + (this.data.moneyBzj * this.data.yyNum) + "元"
    })
  },
  // 确认应约
  productJoin: function () {
    var model = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productJoin,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        productId: model.data.productId,
        count: model.data.yyNum
      },
      success: function (res) {
        if (util.checkRequestSuccess(res)) {
          console.log(res.data)
          if (res.data.data.needPay) {
            // 需要支付
            wx.showToast({
              title: '需要支付保证金',
            })
            wx.redirectTo({
              url: '/pages/pay/pay?dataId=' + res.data.data.joinId + "&price=" + res.data.data.price + "&payType=product_join_bzj",
            })
          } else {
            // 不需要支付
            wx.showToast({
              title: '商品应约成功',
              success: function (res) {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 999
                  })
                  WxNotificationCenter.postNotificationName('joinInfoSuccess')
                }, 2000);
              }
            })
          }
        }
      },
      fail: function (err) {
        console.log(err.errMsg)
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