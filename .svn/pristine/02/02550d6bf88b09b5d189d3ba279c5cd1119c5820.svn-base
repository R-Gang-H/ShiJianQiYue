// pages/login/login.js
const app = getApp();
import {
  globalUrls
} from "../../utils/global.js"

var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var util = require("../../utils/util.js")
var that;
Page({
  data: {
    // 验证手机号
    loginPhone: false,
    loginPwd: false,
    loveChange: true,
    hongyzphone: '',
    // 验证码是否正确
    zhengLove: true,
    huoLove: '',
    getText2: '获取验证码',
    isGetCode: false //是否正在获取验证码
  },
  // 手机验证
  lovePhone: function (e) {
    let phone = e.detail.value;
    this.setData({
      hongyzphone: phone
    })
    if (!(/^1[345678]\d{9}$/.test(phone))) {
      this.setData({
        lovePhone: false
      })
      console.log(phone.length)
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      this.setData({
        lovePhone: true
      })
    }
  },
  // 验证码输入
  yanLoveInput: function (e) {
    let that = this;
    let yanLove = e.detail.value;
    let huoLove = this.data.huoLove;
    that.setData({
      yanLove: yanLove,
      zhengLove: false,
    })
    if (yanLove.length > 4) {
      if (yanLove == huoLove) {
        that.setData({
          zhengLove: true,
        })
      } else {
        that.setData({
          zhengLove: false,
        })
        wx.showModal({
          content: '输入验证码有误',
          showCancel: false,
          success: function (res) {}
        })
      }
    }
  },
  // 验证码按钮
  yanLoveBtn: function () {
    let loveChange = this.data.loveChange;
    console.log(loveChange)
    let lovePhone = this.data.lovePhone;
    console.log(lovePhone)
    let phone = this.data.hongyzphone;
    console.log(phone)
    let n = 59;
    let that = this;
    if (!lovePhone) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 1000
      })
    } else {
      if (loveChange) {
        this.setData({
          loveChange: false
        })
        let lovetime = setInterval(function () {
          let str = '(' + n + ')' + '重新获取'
          that.setData({
            getText2: str,
            isGetCode: true
          })
          if (n <= 0) {
            that.setData({
              loveChange: true,
              getText2: '重新获取',
              isGetCode: false
            })
            clearInterval(lovetime);
          }
          n--;
        }, 1000);
        //获取验证码接口写在这里
        //例子 并非真实接口
        this.getCode(phone)
      }
    }
  },
  //form表单提交
  formSubmit(e) {
    let val = e.detail.value
    console.log('val', val)
    var phone = val.phone //电话
    var phoneCode = val.phoneCode //验证码
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
      })
    }
    if (!phoneCode) {
      wx.showToast({
        title: '验证码不能为空',
      })
    }
    this.login(phone, phoneCode)

  },
  getCode: function (phone) {
    wx.request({
      url: globalUrls.baseUrl + globalUrls.getCode + phone,

      method: 'GET',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {

      }
    })
  },
  login: function (phone, phoneCode) {
    wx.request({
      url: globalUrls.baseUrl + globalUrls.login + 'mobile=SMS%40' + phone + '&' + 'grant_type=mobile&' + 'code=' + phoneCode,
      method: 'POST',
      header: {
        Authorization: 'Basic cGlnOnBpZw=='
      },
      data: {

      },
      success: function (res) {

        if (util.checkRequestSuccess(res)) {
          wx.showLoading({
            title: '登录中...',
            success: s => {

              util.loginSuccess(res)
              //调用查询个人信息方法
              util.checkUserInfo()
              //调用获取 im userSig方法
              util.getUserSig()
            }
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },

})