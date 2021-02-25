// pages/pay/pay.js
import {
  globalUrls
} from "../../utils/global.js"
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 页面传参
    type: '', //判断是支付保证金还是商品购买
    money: '', //支付金额
    dataId: '', //订单ID
    // ----------------------
    payName: '保证金',
    tvTitle: '支付',
    isWx: true, //是否是微信支付
    channel: 'mini', //支付方式
    device: '', //当前设备名称
    wxData: {}, //微信支付所需参数
    wxCode: '', //微信登录获取code 用于微信支付

    isShould: false, //判断是否是信息应约
    titleToast: '支付成功'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      money: options.price,
      type: options.payType,
      dataId: options.dataId
    })
    // 获取当前设备信息
    wx.getSystemInfo({
      complete: (res) => {
        this.setData({
          device: '手机型号' + res.model + '手机版本' + res.version
        })
        console.log(res.model)
      },
    })
    this.titleCharge()
    // 获取钱包信息
    this.getWallet()
  },
  // 设置标题和支付描述
  titleCharge: function () {
    if (this.data.type == 'product_order') {
      this.data.payName = '商品金额',
        this.data.tvTitle = "支付商品金额"
    }
    if (this.data.type == 'info_join_bzj') {
      this.data.payName = '应约保证金',
        this.data.tvTitle = "支付应约保证金"
      this.setData({
        isShould: true
      })
    }
    if (this.data.type == 'bdc_join_bzj') {
      this.data.payName = '应约保证金'
      this.data.tvTitle = "支付应约保证金"
    }
    this.setData({
      payName: this.data.payName
    })
    // 设置标题
    wx.setNavigationBarTitle({
      title: this.data.tvTitle
    })
  },

  // 获取用户群钱包数据
  getWallet: function () {
    var that = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.userWallet,
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      success: function (res) {
        // console.log(res.data.data)
        var data = res.data.data
        var balance = data.balance
        that.setData({
          balance: balance
        })
      },
    })
  },
  // 微信支付点击事件
  WXClick: function () {
    this.setData({
      channel: 'mini',
      isWx: true
    })
  },
  // 余额支付点击事件
  YEClick: function () {
    this.setData({
      channel: 'balance',
      isWx: false
    })
  },

  // 发起支付
  goBuy: function () {
    var payData = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.goPay,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        type: payData.data.type,
        channel: payData.data.channel,
        dataId: payData.data.dataId,
        device: payData.data.device
      },

      success: function (res) {
        console.log(res)
        if (res.data.code == 1) {
          payData.data.titleToast = "支付失败"
          payData.showToast()
          return
        }
        var data = res.data.data
        console.log(data)

        if (payData.data.isWx) { //微信支付
          // 赋值微信支付参数
          payData.setData({
            wxData: JSON.parse(data)
          })
          payData.goWx()
        } else { //证明是余额支付
          if (payData.data.type == 'info_join_bzj' || payData.data.type == 'bdc_join_bzj') {
            //信息和广播应约 刷新数据
            wx.showToast({
              title: '应约成功',
              success: function (res) {
                setTimeout(function () {
                  // wx.navigateBack({
                  //   delta: 999
                  // })
                  // WxNotificationCenter.postNotificationName('joinInfoSuccess')
                  /**
                   * 跳转我应约的
                   */
                  wx.redirectTo({
                    url: '/pages/myAppointment/myAppointment?longitude=' + wx.getStorageSync("longitude") + "&" + "latitude=" + wx.getStorageSync("latitude")
                  })
                }, 2000);
              }
            })
          } else {
            payData.data.titleToast = "支付成功"
            payData.showToast()
          }
        }
      },
      fail: function (err) {
        payData.data.titleToast = "支付失败"
        payData.showToast()
      }
    })
  },
  showToast: function () {
    wx.showToast({
      title: this.data.titleToast,
      success: function (res) {
        setTimeout(function () {
          //返回上一级关闭当前页面
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      }
    })
  },
  // 微信支付
  goWx: function () {
    var detail = this;
    wx.requestPayment({
      "appId": detail.data.wxData.appid,
      "timeStamp": detail.data.wxData.timestamp,
      "nonceStr": detail.data.wxData.noncestr,
      "package": "prepay_id=" + detail.data.wxData.prepayid,
      "signType": "MD5",
      "paySign": detail.data.wxData.sign,
      "success": function (res) {
        detail.data.titleToast = "支付成功"
        detail.showToast()
      },
      "fail": function (res) {
        detail.data.titleToast = "支付失败"
        detail.showToast()
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