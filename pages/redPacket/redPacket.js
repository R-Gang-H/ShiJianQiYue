// pages/redPacket/redPacket.js

import {
  globalUrls
} from "../../utils/global.js"

const app = getApp()
var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");

var page = 1;
var keyword = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redPackets: [],
    longitude: '',
    latitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this
    WxNotificationCenter.addNotification("redPacketRefresh", self.refresh, self)
    WxNotificationCenter.addNotification("loginNotification", self.refresh, self)


    self.setData({
      longitude: options.longitude,
      latitude: options.latitude,
    })

    self.getRedPackets()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var self = this
    page = 1
    this.setData({
      redPackets: []

    })
    self.getRedPackets()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    page++
    var self = this
    self.getRedPackets()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getRedPackets: function() {

    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.getRedPackets,
      header: {
        Authorization: globalUrls.authorization
      },
      method: 'GET',
      data: {
        longitude: self.data.longitude,
        latitude: self.data.latitude,
        current: page,
        size: '20',
        giftTitle:keyword? keyword : ''

      },
      success: function(res) {

        if (util.checkRequestSuccess(res)) {
          let data = res.data.data
          let records = data.records;
          //关闭下拉刷新
          console.log(data)
          wx.stopPullDownRefresh()

          records.forEach(item => {
            //遍历修改图片的值.
            item.giftImages = item.giftImages.split(',')[0]
            item.createTime = util.getDateWithTime(item.createTime)
            item.juli = util.tranformDistance(item.juli)

          })
          data.records = records

          self.setData({

            redPackets: data.current == 1 ? records : self.data.messages.concat(records)
          })
        }
      },
      fail: function(err) {
        console.log(err)
      },
    })
  },
  /**
   * 跳转红包详情
   */
  didSelectedCell: function(sender) {
    var self = this
    
    wx.navigateTo({
      url: '/pages/redPacketDetail/redPacketDetail?giftId=' + sender.currentTarget.dataset.giftid + '&giftTitle=' + sender.currentTarget.dataset.title,
    })
  },
  /**
 * 搜索框改变
 */
  textFieldDidChange: function (textField) {
    keyword = textField.detail.value;
    if (keyword.length == 0) {
      var self = this
      self.refresh()
    }
  },

  /**
   * 开始搜索
   */
  searchBarDidSearch: function (searchBar) {
    var self = this
    self.refresh()
  },
  /**
   * 刷新
   */
  refresh:function (){
    page = 1;
    var self = this
    self.setData({
      redPackets:[]
    })
    self.getRedPackets()
  }
})