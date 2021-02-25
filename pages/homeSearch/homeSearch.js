// pages/homeSearch/homeSearch.js

import {
  globalUrls
} from "../../utils/global.js"

const app = getApp()
var util = require('../../utils/util.js')
var page = 1;
var keyword = '';
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoType:'',
    messages:[],
    longitude:'',
    latitude:'',
    becomeFirst:false, //是否自动弹出键盘
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options.model)

    //注册通知. 登录完成后会自动调用
    var self = this
    WxNotificationCenter.addNotification("loginNotification", self.refresh, self)

      wx.setNavigationBarTitle({
        title: options.title,
      })

      this.setData({
        infoType: options.infoType ? options.infoType :'',
        longitude: options.longitude,
        latitude: options.latitude,
        becomeFirst: options.title == '搜索'
      })
      keyword = "";
      this.getHomeMessages()
  },
  getHomeMessages: function () {

    var self = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.homeMessages,
      method: 'GET',
      data: {
        orderBy: 'createTime',
        size: '20',
        current: page,
        latitude: self.data.latitude,
        longitude: self.data.longitude,
        infoType:self.data.infoType?self.data.infoType:'',
        infoTitle:keyword ? keyword : ''
      },
      header: {
        Authorization: globalUrls.authorization
      },
      success: function (res) {
        let data = res.data.data
        let records = data.records;
        console.log(data)
        records.forEach(item => {
          //遍历修改图片的值.
          item.infoImages = item.infoImages.split(',')[0]
          item.createTime = util.getDateWithTime(item.createTime)

          if (util.getTimeDistance(item.expireTime) == '已结束' || util.getTimeDistance(item.expireTime) == '马上结束') {
            item.customTime = util.getTimeDistance(item.expireTime)

          } else {
            item.customTime = '距离结束还有' + util.getTimeDistance(item.expireTime)
          }
          item.juli = util.tranformDistance(item.juli)

        })
        data.records = records
        wx.stopPullDownRefresh()
        self.setData({
          messages: self.data.messages.concat(data.records)
        })

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
    page = 1
    this.setData({
      messages: []

    })
    this.getHomeMessages()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    page++
    this.getHomeMessages()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //进入详情
  didSelectedCell: function (sender) {
    var self = this
    wx.navigateTo({
      url: '/pages/infoDetail/infoDetail?infoId=' + sender.currentTarget.dataset.infoid + '&infoTitle=' + sender.currentTarget.dataset.title,
    })
  },
/**
 * 搜索框改变
 */
  textFieldDidChange: function (textField) {
    keyword = textField.detail.value;
    if(keyword.length == 0) {
      page = 1;
      var self = this
      self.setData({
        messages: []
      })
      self.getHomeMessages()
    }
  },

/**
 * 开始搜索
 */
  searchBarDidSearch: function (searchBar) {
    page = 1;
    var self = this
    self.setData({
      messages:[]
    })
    self.getHomeMessages()
  },

  refresh: function () {
    page = 1;
    var self = this
    self.setData({
      messages: []
    })
    self.getHomeMessages()
  }
})