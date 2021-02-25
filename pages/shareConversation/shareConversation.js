// pages/shareConversation/shareConversation.js
import {
  globalUrls
} from "../../utils/global.js"

var message = require('../../utils/message.js')
var global = require('../../utils/global.js')
var that, conversationID, tim, shareIndex;

// 转发回话列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: '/images/no_login.png',
    hasmore: true,
    hasempty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    tim = global.userInfo.txIm;

    that.getConversationList();

    var goods = JSON.parse(options.goods);
    console.log("shareConversation 商品信息==>" + goods);
    // 获取商品信息
    this.setData({
      goods: goods
    })
  },

  /* 获取会话列表*/
  getConversationList: function () {
    message.getConversationList(tim, (array) => {
      this.setData({
        array: array,
        hasempty: array.length == 0,
        hasmore: array.length == 0,
      });
      wx.stopPullDownRefresh();
      console.log("拿到会话列表=>" + JSON.stringify(array));
    });
  },

  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    that.setData({
      details: e.detail.value,
      checkNum: '(' + e.detail.value.length + ')',
    })

  },

  // 发送自定义消息
  btnShare: function () {
    shareIndex = 0;
    that.data.details.forEach(function (item, index) {
      console.log("转发 id==>" + JSON.parse(item).ID); //这里的item就是从数组里拿出来的每一个每一组
      // 调用转发接口
      wx.request({
        url: globalUrls.baseUrl + globalUrls.productforward,
        method: 'GET',
        header: { //请求头
          Authorization: globalUrls.authorization
        },
        data:{
          productId:JSON.parse(that.data.goods).productId
        },
        success: function (res) {
          console.log(res.data.data)
          var data = res.data.data
          // 接口请求成功后转发到圈子
          that.setCustomMessage(item, index);
        },
      })
    })
  },
  // 发送自定义消息
  setCustomMessage: function (e, index) {
    console.log("setCustomMessage:" + index + ",Item:" + e)
    var item = JSON.parse(e)
    var imId = item.type == "C2C" ? item.userProfile.userID : item.groupProfile.groupID;
    var conversaType = item.type;
    let goods = JSON.parse(that.data.goods);
    var data = {
      goodsId: goods.productId,
      goodsImage: globalUrls.imgUrl + goods.productImages[0],
      msgContent: goods.productDesc,
      msgTitle: goods.productName,
      shopName: goods.shopName,
      userAvatar: globalUrls.imgUrl + global.userInfo.avatar,
      userId: global.userInfo.userId
    }
    var payload = {
      data: JSON.stringify(data), // 用于标识商品信息消息
      description: '', // 描述
      extension: '' // 扩展字段
    }
    message.setCustomMessage(tim, imId, conversaType, payload,
      (datas) => {
        console.log("发送自定义消息成功===>" + shareIndex);
        if (shareIndex == that.data.details.length - 1) {
          wx.showToast({
            title: '转发成功',
            success(res) {
              setTimeout(function () {
                wx.navigateBack({

                })
              }, 2000)
            }
          })
        } else {
          shareIndex++;
        }
      });
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
    that.getConversationList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    that.getConversationList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})