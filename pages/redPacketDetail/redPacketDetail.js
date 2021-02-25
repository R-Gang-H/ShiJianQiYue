// pages/redPacketDetail/redPacketDetail.js

import {
  globalUrls
} from "../../utils/global.js"

const app = getApp()
var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
const CryptoJS = require('../../utils/aes_util.js')

var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var thisGiftId = "";
const QRCode = require('../../utils/weapp-qrcode.js')
let qrcode;
import rpx2px from '../../utils/rpx2px.js'
var codeWidth = rpx2px(230)
Page({

  /**
   * 页面的初始数据
   */
  data: {

    showBottom: true,
    isMy: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    thisGiftId = options.giftId

    self.getRedPacketDetail()
    wx.setNavigationBarTitle({
      title: decodeURI(options.giftTitle),
    })
    WxNotificationCenter.addNotification("loginNotification", self.refresh, self)


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

  },
// 获取红包详情
  getRedPacketDetail: function () {
    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.redPacketDetail,
      method: 'GET',
      header: {
        Authorization: globalUrls.authorization
      },
      data: {
        giftId: thisGiftId,

      },
      success: function (res) {
        if (util.checkRequestSuccess(res)) {
          var data = res.data.data
          console.log(data)
          if (util.getTimeDistance(data.expireTime) == '已结束' || util.getTimeDistance(data.expireTime) == '马上结束') {
            data.customTime = util.getTimeDistance(data.expireTime)

          } else {
            data.customTime = '距离结束还有' + util.getTimeDistance(data.expireTime)
          }
          data.giftImages = data.giftImages.split(',')
          //约会时间
          data.customDate = data.startTime ? data.startTime + '至' + data.expireTime : data.expireTime
          var showJoinList = false; //是否显示应约者列表
          var isIng = false; //是否在进行中
          var isEnd = false; //是否已经结束
          var isMy = false; //是否是我自己发布的
          var isCancel = false; //是否撤销中
          var showBottom = true;//是否展示底部按钮
          if (data.joinNum > 0) {
            data.joinList.forEach(item => {
              if (item.userId == global.userInfo.userId) {
                //说明自己加入了
                showJoinList = true
              }
            })
          }
          // 证明是自己发布的
          if (util.checkIsLogin() && global.userInfo.userId == data.userId) {
            if(data.joinList!=null&&data.joinList.length>0){

            }
            isMy = true
            // 判断信息状态
            if (data.status == "4" || data.status == "5") { //撤销中
              isCancel = true
            } else {
              if (util.getTimeDistance(data.expireTime) == '已结束') { //已结束
                isEnd = true
              } else { //进行中  撤销，进入群聊
                isIng = true
              }
            }
            //我自己发布的活动
            self.setData({
              showJoinList: false,
              needJoin: false,
              isIng: isIng,
              isMy: isMy,
              isCancel: isCancel,
              isEnd: isEnd
            })
          } else {
            showBottom = false
            if(data.giftJoin!=null) {
              var qrcode = new QRCode('canvas', {
                usingIn: this,
                text: CryptoJS.Base64Encode(data.giftJoin.gjoinId),
                width: codeWidth,
                height: codeWidth,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
              });
            }
            
            self.setData({
              showJoinList: showJoinList,
              needJoin: data.giftJoin == null,
              isMy:false
            })
          }
          self.setData({
            model: data,
            showBottom: showBottom
          })

          console.log(self.data.model)
        }

      },
      fail: function (res) {

      }
    })
  },

  cancelRedPacket: function () {
    var self = this

    wx.showModal({
      title: '提示',
      content: '确定要撤销此红包吗',
      success(res) {
        if (res.confirm) {

          wx.request({
            url: globalUrls.baseUrl + globalUrls.pay,
            method: 'GET',
            header: {
              Authorization: globalUrls.authorization
            },
            data: {
              dataId: self.data.model.giftId,
              type: 'gift_cancel'

            },
            success: function (res) {
              if (util.checkRequestSuccess(res)) {
                wx.showToast({
                  title: '撤销红包成功',
                })
                WxNotificationCenter.postNotificationName('redPacketRefresh');
                wx.navigateBack({

                })
              }
            },
            fail: function (err) {
              wx.showToast({
                title: err.errMsg,
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  joinRedPacket: function () {

    if (!util.checkIsLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      wx.showToast({
        title: '请先登录',
      })

      return
    }
    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.joinRedPacket,
      method: 'GET',
      header: {
        Authorization: globalUrls.authorization,
      },
      data: {
        giftId: self.data.model.giftId
      },
      success: function (res) {
        if (util.checkRequestSuccess(res)) {
          wx.showToast({
            title: '应答成功',
          })
          self.getRedPacketDetail()
        }

      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },

  /**
   * 
   * 登录后的刷新方法
   */
  refresh: function () {
    this.getRedPacketDetail()
  },
  /**
   * 导航
   */
  goLocation: function () {
    wx.openLocation({ //​使用微信内置地图查看位置。
      latitude: this.data.model.latitude, //要去的纬度-地址
      longitude: this.data.model.longitude, //要去的经度-地址
      name: this.data.model.infoAddress,
      address: this.data.model.infoAddress
    })

  },
  /**
   * 查看个人详情
   */
  goPersonDetail: function (sender) {
    console.log(sender)

    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userId=' + sender.currentTarget.dataset.userid,
    })
  }
})