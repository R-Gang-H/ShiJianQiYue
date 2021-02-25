//app.js
import TIM from 'tim-wx-sdk';
import COS from 'cos-wx-sdk-v5';

import {
  globalUrls
} from '/utils/global.js'

var global = require('/utils/global.js')
var util = require('/utils/util.js')

App({
  onLaunch: function () {
    // 展示本地存储能力
    global.userInfo.isLogin = wx.getStorageSync('isLogin')
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var uSig = wx.getStorageSync('userSig');
    console.log('userSig=' + uSig)

    //------------ IM 通信 start -------------
    let options = {
      SDKAppID: 1400289069 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
    };
    // 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
    var tim = TIM.create(options); // SDK 实例通常用 tim 表示
    global.userInfo.txIm = tim;

    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    // tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

    // 注册 COS SDK 插件
    tim.registerPlugin({
      'cos-wx-sdk': COS
    });

    if (uSig && uSig.lenth != 0) {
      util.imLogin(tim, callback => {
        // wx.showToast({
        //   title: 'imLogSuc_app',
        //   success: s => {
        //   }
        // })
      });
    }

    // 监听事件，例如：
    tim.on(TIM.EVENT.SDK_READY, function (event) {
      // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
      // event.name - TIM.EVENT.SDK_READY
      console.log("收到离线消息和会话列表同步完毕通知 TIM.EVENT.SDK_READY" + JSON.stringify(event));
    });

    tim.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
      // 收到自己或好友的资料变更通知
      // event.name - TIM.EVENT.PROFILE_UPDATED
      // event.data - 存储 Profile 对象的数组 - [Profile]
      console.log("资料变更通知 TIM.EVENT.PROFILE_UPDATED" + JSON.stringify(event));
    });

    tim.on(TIM.EVENT.ERROR, function (event) {
      // 收到 SDK 发生错误通知，可以获取错误码和错误信息
      // event.name - TIM.EVENT.ERROR
      // event.data.code - 错误码
      // event.data.message - 错误信息
      console.log("错误码和错误信息 TIM.EVENT.ERROR");
    });

    tim.on(TIM.EVENT.SDK_NOT_READY, function (event) {
      // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
      // event.name - TIM.EVENT.SDK_NOT_READY
      console.log("SDK 无法正常工作 TIM.EVENT.SDK_NOT_READY");
    });

    //------------ IM 通信 end -------------

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log(res);
        this.globalData.systeminfo = res
      },
    })
    // 获得胶囊按钮位置信息
    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 拿到消息未读数量
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      var array = event.data; // - 存储 Conversation 对象的数组 - [Conversation]
      var unreadCounts = 0

      for (let index = 0; index < array.length; index++) {
        unreadCounts += array[index].unreadCount
        console.log("Sunny", unreadCounts)
      }
      if (unreadCounts == 0) {
        return
      } else {
        // 根据count的状态判断红点显示与否
        wx.setTabBarBadge({ //这个方法的意思是，为小程序某一项的tabbar右上角添加文本
          index: 2, //代表哪个tabbar（从0开始）
          text: unreadCounts.toString() //显示的内容
        })
      }
    });



  },
  globalData: {
    userInfo: null
  }
})