// pages/marketDeatil/marketD.js
// 导包接口请求
// 导包接口请求
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
    goodsId: '',
    current: '1',
    isMe: false,
    isDelete: false,
    isBuy: false,
    showJoinList: false,
    status: "", //状态值 判断是否已经下架
    goods: {} //初始化商品数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var model = JSON.parse(options.model); //点击分享链接拿到分享数据

    let status = options.status
    this.data.status = status
    this.setData({
      goodsId: options.productId,
      status: status,
    })
    console.log(this.data.isDelete)
    console.log(this.data.isMe)
    var model = this
    WxNotificationCenter.addNotification("loginNotification", model.refresh, model)
    // 设置标题
    wx.setNavigationBarTitle({
      title: decodeURI(options.tvTitle)
    })
    // 获取商品详情
    this.getGoodsDetail()

    // 获取评论列表
    // this.getCommentList()
  },
  // 评论列表
  getCommentList: function () {
    var comment = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productcomment,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        productId: comment.data.goodsId,
        current: comment.data.current
      },
      success: function (res) {
        //停止刷新
        wx.stopPullDownRefresh()
        var data = res.data.data
        var commentList = data.records
        console.log(commentList)
        comment.setData({
          // 截取第一张图片
          // iconPic :item.productImages.split(',')[0],
          commentList: commentList
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },

  //获取应约者列表
  getJoinList: function () {
    var model = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productjoinlist,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        productId: model.data.goodsId,
      },
      success: function (res) {
        var modelList = res.data.data
        var showJoinList = false; //是否显示应约者列表
        modelList.forEach(item => {
          if (item.userId == global.userInfo.userId) {
            showJoinList = true
          }
        })
        if (model.data.isMe) { //是自己发布的
          model.setData({
            showJoinList: false,
          })
        } else {
          model.setData({
            showJoinList: showJoinList,
            needJoin: !showJoinList
          })
        }
        model.setData({
          joinList: modelList,
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },

  // 获取商品详情
  getGoodsDetail: function () {
    var details = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productDetails,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        productId: details.data.goodsId
      },
      success: function (res) {
        // 获取应约者列表
        details.getJoinList()
        //停止刷新
        wx.stopPullDownRefresh()
        var data = res.data.data
        data.price = '￥' + data.price
        data.productImages = data.productImages.split(',')
        details.setData({
          shapDetial: data,
        })
        console.log("go==>" + JSON.stringify(res.data.data))
        //约会时间
        data.customDate = data.startTime ? data.startTime + '至' + data.expireTime : data.expireTime
        var isIng = false; //是否在进行中
        var isEnd = false; //是否已经结束
        var isCancel = false; //是否撤销中
        if (util.checkIsLogin() && global.userInfo.userId == data.userId) {
          details.data.isMe = true
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
          details.setData({
            needJoin: false,
            isIng: isIng,
            isMe: details.data.isMe,
            isCancel: isCancel,
            isEnd: isEnd
          })
        } else {

        }
        details.setData({
          goods: data
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  /**
   * 
   * 商品应约跳转
   */
  joinInfo: function (e) {
    //不登录不能应约哦
    if (!util.checkIsLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    wx.navigateTo({

      url: '/pages/confirmDue/confirmDue?productId=' + this.data.goodsId + '&price=' + e.currentTarget.dataset.price,
    })
  },

  //关注和取消关注
  addAtten: function () {
    if (!util.checkIsLogin()) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    if (this.data.goods.isFollow == 1) {
      //关注状态  去取消关注
      this.cancelAtten(true)
      return
    }
    //关注
    this.cancelAtten(false)
  },
  cancelAtten: function (isCancel) {
    var self = this
    var appendUrl = isCancel ? globalUrls.cancelAttention : globalUrls.attention;
    wx.request({
      url: globalUrls.baseUrl + appendUrl,
      header: {
        Authorization: globalUrls.authorization
      },
      method: 'GET',
      data: {
        fUid: self.data.goods.userId
      },
      success: function (res) {
        console.log(res.data)
        if (util.checkRequestSuccess(res)) {
          self.data.goods.isFollow = isCancel ? 0 : 1;
          self.setData({
            goods: self.data.goods
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
            type: 'product_join_confirm',
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
  // 刷新页面
  changeParentData: function () {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法
    }
  },
  // 撤销商品
  cancelInfomation: function () {
    var self = this
    wx.showModal({
      title: '提示',
      content: '您确定要撤销此商品吗',
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
              dataId: self.data.goods.productId,
              type: 'product_cancel'
            },
            success: function (res) {
              if (util.checkRequestSuccess(res)) {
                //撤销成功
                WxNotificationCenter.postNotificationName('infoRefreshNotification');
                wx.showToast({
                  title: '撤销商品成功',
                  success: function (res) {
                    wx.navigateBack({})
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
  // 去私聊
  goC2C: function () {
    var model = encodeURIComponent(JSON.stringify(global.userInfo.model))
    wx.navigateTo({
      url: '../chat/chat?msgType=0&model=' + model
    })
  },
  // 进入群聊
  goGroup: function () {
    var model = encodeURIComponent(JSON.stringify(global.userInfo.model))
    wx.navigateTo({
      url: '../chat/chat?msgType=1&model=' + model
    })
  },

  // 发布者下架商品
  btnCancel: function () {
    var details = this;
    wx.showModal({
      title: '提示',
      content: '确定下架该商品吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: globalUrls.baseUrl + globalUrls.cancelGoods,
            method: 'GET',
            //请求头
            header: {
              Authorization: globalUrls.authorization
            },
            // 传参
            data: {
              productId: details.data.goodsId,
              status: '0'
            },
            success: function (res) {
              var data = res.data.data
              console.log(res.data.data)
              //返回上一级关闭当前页面
              wx.navigateBack({
                delta: 1
              })
              details.changeParentData()
            },
            fail: function (err) {
              console.log(err.errMsg)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 删除商品
  btnDelete: function (e) {
    console.log(e)
    let that = this;
    let productId = e.currentTarget.dataset.productid
    wx.showModal({
      title: '提示',
      content: '您确定删除？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后    
          wx.request({
            url: globalUrls.baseUrl + '/product/product/delete',
            data: {
              productId: productId
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              Authorization: globalUrls.authorization
            }, // 设置请求的 header
            success: function (res) {
              console.log("11", res)
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 1000
              })
              //返回上一级关闭当前页面
              wx.navigateBack({})
              that.changeParentData()
            },
            fail: function (err) {
              wx.showToast({
                title: err.errMsg,
              })
            }
          })
        } else { //这里是点击了取消以后     
          console.log('用户点击取消')
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
   * 登录成功后刷新商品详情
   */
  refresh: function () {

    this.getGoodsDetail()
  },

  goC2C: function () {
    var shapDetial = encodeURIComponent(JSON.stringify(this.data.shapDetial))
    wx.navigateTo({
      url: '../chat/chat?&shapDetial=' + shapDetial
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
    this.data.current = 1
    // 置空后再次请求
    this.setData({
      commentList: []
    })
    this.getGoodsDetail()
    // this.getCommentList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.current + 1
    // 刷新评论列表
    // this.getCommentList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})