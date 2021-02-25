// pages/cashWithdrawal/cashWithdrawal.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: true,
    balance: "",
    channel: "zfb",
    amount: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let balance = options.balance
    this.setData({
      balance: balance
    })
  },
  // 点击全部提现
  tixianAll: function () {
    let balance = this.data.balance
    this.data.amount = balance
    this.setData({
      amount: this.data.amount
    })
  },
  // 支付宝点击事件
  zfbClick() {
    this.setData({
      isChecked: true,
      channel: 'zfb',
    })
  },
  // 微信点击事件
  wxClick() {
    this.setData({
      isChecked: false,
      channel: 'wx'
    })
  },
  // 提现
  formSubmit: function (e) {
    let that = this
    let infor = e.detail.value;
    console.log(e)
    let account = infor.account;
    let realName = infor.realName;
    let amount = infor.amount;
    let channel = that.data.channel
    console.log(channel)
    if (account == "") {
      wx.showToast({
        title: '提现账号不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (realName == "") {
      wx.showToast({
        title: '真实姓名不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (amount == "") {
      wx.showToast({
        title: '提现金额不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (amount < 100) {
      wx.showToast({
        title: '提现金额最低金额100',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.request({
        url: globalUrls.baseUrl + '/pay/cashout/add',
        method: 'POST',
        data: {
          realName: realName,
          amount: amount,
          channel: channel,
          account: account
        },
        header: {
          "Authorization": globalUrls.authorization,
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        success: function (res) {
          // console.log("11", res)
          // 判断是否绑定提现申请
          wx.getStorageSync("isBindMsg") ? '' : that.bindCashout()
          wx.showToast({
            title: '提现申请已提交，请耐心等待',
            icon: 'none',
            duration: 1000
          })
          wx.navigateBack({

          })
        },
        fail: function (err) {
          wx.showToast({
            title: err.errMsg,
          })
        }
      })
    }
  },
  bindCashout: function () {
    // 登录成功后绑定订阅事件  收益到账提醒  提现到账提醒
    wx.requestSubscribeMessage({
      tmplIds: ['HHWJWjOuUS7s5ffC527s189I6UD-fB7HHFZ7ZNGBSGg', 'Wz3UDlDe_wIggDey8xpKvNGExDSeE8KIjrIVqr0cDcI'],
      success(res) {
        wx.setStorageSync('isBindMsg', true)
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