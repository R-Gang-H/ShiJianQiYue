// pages/infoDetail/infoDetail.js
//消息详情
import {
  globalUrls
} from "../../utils/global.js"


var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoId: '',
    longitude: '',
    latitude: '',
    model: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var model = JSON.parse(options.model); //解析得到对象
    var self = this

    console.log(options)
    WxNotificationCenter.addNotification("loginNotification", self.refresh, self)


    wx.setNavigationBarTitle({
      title: options.infoTitle ? decodeURI(options.infoTitle) : '信息详情',
    })

    this.setData({
      infoId: options.infoId,
    })
    this.getInfoDetailRequest()
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

  /**
   * 获取信息详情
   */

  getInfoDetailRequest: function () {

    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.infoDetail,
      method: 'GET',
      header: {
        Authorization: globalUrls.authorization
      },
      data: {
        infoId: self.data.infoId,
        longitude: self.data.longitude,
        latitude: self.data.latitude
      },

      success: function (res) {
        var model = res.data.data
        global.userInfo.model = model;
        if (util.getTimeDistance(model.expireTime) == '已结束' || util.getTimeDistance(model.expireTime) == '马上结束') {
          model.customTime = util.getTimeDistance(model.expireTime)

        } else {
          model.customTime = '距离结束还有' + util.getTimeDistance(model.expireTime)
        }
        model.infoImages = model.infoImages.split(',')

        //约会时间
        model.customDate = model.startTime ? model.startTime + '至' + model.expireTime : model.expireTime

        var showJoinList = false; //是否显示应约者列表
        var isIng = false; //是否在进行中
        var isEnd = false; //是否已经结束
        var isMy = false; //是否是我自己发布的
        var isCancel = false; //是否撤销中
        if (model.joinNum > 0) {
          model.joinList.forEach(item => {
            if (item.userId == global.userInfo.userId) {
              //说明自己加入了
              showJoinList = true
            }
          })
        }
        if (util.checkIsLogin() && global.userInfo.userId == model.userId) {
          isMy = true
          // 判断信息状态
          if (model.status == "4" || model.status == "5") { //撤销中
            isCancel = true
          } else {
            if (util.getTimeDistance(model.expireTime) == '已结束') { //已结束
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
          self.setData({
            showJoinList: showJoinList,
            needJoin: !showJoinList

          })
        }
        self.setData({
          model: model
        })
        console.log("go===>" + JSON.stringify(self.data.model))
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })

  },

  /**
   * 关注按钮点击事件
   */
  attentionButtonDidClicked: function (sender) {
    if (!util.checkIsLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    if (this.data.model.userId == global.userInfo.userId) {

      wx.showToast({
        title: '不能关注自己哦',
      })
      return
    }

    if (this.data.model.isFollow == 1) {
      //取消关注
      this.attentionOrCancelAttention(true)
      return
    }

    //关注
    this.attentionOrCancelAttention(false)
  },

  attentionOrCancelAttention: function (isCancel) {
    var self = this
    var appendUrl = isCancel ? globalUrls.cancelAttention : globalUrls.attention;
    wx.request({
      url: globalUrls.baseUrl + appendUrl,
      header: {
        Authorization: globalUrls.authorization
      },
      method: 'GET',
      data: {
        fUid: self.data.model.userId
      },

      success: function (res) {
        console.log(res.data)
        if (util.checkRequestSuccess(res)) {

          self.data.model.isFollow = isCancel ? 0 : 1;

          self.setData({
            model: self.data.model
          })

          wx.showToast({
            title: isCancel ? '取消关注成功' : '关注成功',
          })
        }
      },
      fail: function (err) {

      }
    })
  },

  /**
   * 
   * 信息应约接口
   */
  joinInfo: function () {
    //不登录不能应约哦
    if (!util.checkIsLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.joinInfo,
      header: {
        Authorization: globalUrls.authorization
      },
      method: 'GET',
      data: {
        infoId: self.data.infoId
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
              url: '/pages/pay/pay?dataId=' + res.data.data.joinId + "&price=" + res.data.data.price + "&payType=info_join_bzj",
            })
          } else {
            // 不需要支付
            wx.showToast({
              title: '应约成功',
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
          // if (res.data.msg == 'success') {
          //   //应约成功
          //   self.getInfoDetailRequest()
          //   if (!isShare) {
          //     wx.showToast({
          //       title: '应约成功',
          //       success: function (res) {
          //         setTimeout(function () {
          //           wx.navigateBack({
          //             delta: 999
          //           })
          //           WxNotificationCenter.postNotificationName('joinInfoSuccess')

          //         }, 2000);
          //       }
          //     })
          //   } else {
          //     //通过点击分享进来的
          //     wx.showToast({
          //       title: '应约成功',
          //     })
          //   }
          // } else {
          //   wx.showToast({
          //     title: '需要支付保证金',
          //   })
          //   wx.redirectTo({
          //     url: '/pages/pay/pay?dataId=' + res.data.data.infoId + "&price=" + res.data.data.price + "&payType=info_join_bzj",
          //   })
          // }
        }
      },
      fail: function (err) {

      }
    })
  },

  /**
   * 确认应约
   */
  confirmJoinButton: function (sender) {
    console.log(sender)
    var self = this
    var model = sender.currentTarget.dataset.model
    if (model.status == 1) {
      wx.showToast({
        title: '不可重复操作',
      })
      return
    }
    //确认应约

    wx.getSystemInfo({
      success: function (res) {},
    })

    wx.getSystemInfo({
      success: function (sys) {

        wx.request({
          url: globalUrls.baseUrl + globalUrls.pay,
          method: 'GET',
          header: {
            Authorization: globalUrls.authorization
          },
          data: {
            type: 'info_join_confirm',
            dataId: model.joinId,
            device: sys.model + sys.system
          },
          success: function (res) {
            if (util.checkRequestSuccess(res)) {
              self.refresh()
            }
          },
          fail: function (err) {

          }
        })
      },
    })

  },

  /**
   * 
   * 刷新方法 用于登录成功后的刷新
   */
  refresh: function () {

    this.getInfoDetailRequest()
  },

  cancelInfomation: function () {
    var self = this
    wx.showModal({
      title: '提示',
      content: '您确定要撤销此信息吗',
      success: function (res) {
        if (res.confirm) {
          //用户点击确认
          wx.request({
            url: globalUrls.baseUrl + globalUrls.pay,
            method: 'GET',
            header: {
              Authorization: globalUrls.authorization
            },
            data: {
              dataId: self.data.model.infoId,
              type: 'info_cancel'
            },
            success: function (res) {
              if (util.checkRequestSuccess(res)) {
                //撤销信息成功
                WxNotificationCenter.postNotificationName('infoRefreshNotification');
                wx.showToast({
                  title: '撤销信息成功',
                  success: function (res) {
                    wx.navigateBack({

                    })
                  }
                })

              }
            },
            fail: function (err) {

            }
          })
        } else {
          //用户点击取消
        }
      }
    })
  },

  goC2C: function () {
    var model = encodeURIComponent(JSON.stringify(global.userInfo.model))
    wx.navigateTo({
      url: '../chat/chat?msgType=0&model=' + model
    })
  },
  goGroup: function () {
    var model = encodeURIComponent(JSON.stringify(global.userInfo.model))
    wx.navigateTo({
      url: '../chat/chat?msgType=1&model=' + model
    })
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