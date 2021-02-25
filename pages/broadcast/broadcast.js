// pages/broadcast/broadcast.js
import {
  globalUrls
} from "../../utils/global.js"

const app = getApp()
const audioPlayer = wx.createInnerAudioContext({});

var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");

var page = 1;
var latitude = '';
var longitude = '';
var infoType = '';
var index = 0;
Page({

  /**
   * 页面的初始数据
   */

  data: {
    messages: [],
    totalNumber: '',
    allPlay:false,
    showFill:false,
    categories: global.userInfo.categories,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    
    var self = this
  self.setData ({
    categories: global.userInfo.categories
  })
    longitude = options.longitude
    latitude = options.latitude
    this.getBroadcastList()

    audioPlayer.onEnded((res) => {

      console.log('播放结束!');
      console.log(audioPlayer)
      for(var i = 0; i < self.data.messages.length; i ++) {

        var item = self.data.messages[i];
        if(item.bdcAudio == audioPlayer.src) {
          item.isPlay = false
            break;
        }
      }
      self.setData({
        messages:self.data.messages
      })
      var model = {}

      for (var i = 0; i < this.data.messages.length; i++) {
        var obj = this.data.messages[i];
        if (obj.bdcAudio == audioPlayer.src) {

          model = obj;
          break;
        }
      }

      this.pauseWithModel(model)
    })

    // 播放音频失败的回调

    audioPlayer.onError((res) => {

      console.log('播放音频失败' + res);
      console.log(audioPlayer)
      var model = {}

      for(var i = 0; i < this.data.messages.length; i++ ) {
        var obj = this.data.messages[i];
        if(obj.bdcAudio == audioPlayer.src) {

          model = obj;
          break;
        }
      }

      this.pauseWithModel(model)
    })

    audioPlayer.onStop((res) => {

      console.log('停止播放!');
      console.log(res)
      console.log(audioPlayer)
      
    })
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
    audioPlayer.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // audioPlayer.destroy();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    page = 1;
  this.setData({
    messages:[]
  })
  this.getBroadcastList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    page++
    this.getBroadcastList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取广播列表
   */
  getBroadcastList: function() {

    var self = this;
    console.log('请求时的header=' + globalUrls.authorization)
    wx.request({
      url: globalUrls.baseUrl + globalUrls.broadcastList,
      method: 'GET',
      data: {
        bdcType: infoType? infoType : '',
        size: '20',
        current: page,
        latitude: latitude,
        longitude: longitude
      },
      header: {
        Authorization: globalUrls.authorization
      },
      success: function(res) {
        let data = res.data.data
        let records = data.records;
        console.log(data)
        //关闭下拉刷新
        wx.stopPullDownRefresh()

        records.forEach(item => {
          //遍历修改图片的值.
          item.createTime = util.getDateWithTime(item.createTime)
          if (util.getTimeDistance(item.expireTime) == '已结束' || util.getTimeDistance(item.expireTime) == '马上结束') {
            item.customTime = util.getTimeDistance(item.expireTime)

          } else {
            item.customTime = '距离结束还有' + util.getTimeDistance(item.expireTime)
          }
          item.juli = util.tranformDistance(item.juli)
          item.bdcAudio = globalUrls.imgUrl + item.bdcAudio
          item.isPlay = false
        })
        data.records = records

        self.setData({

          messages: data.current == 1 ? records : self.data.messages.concat(records),
          totalNumber: data.total
        })
      },
      fail: function(err) {
        console.log(err.errMsg)
      }
    })

  },
  /**
   * 暂停
   */
  
  pauseWithSender: function (sender) {
    var self = this
    var model = sender.currentTarget.dataset.model;
    self.setData({
      allPlay:false
    })
    index=0;
    self.pauseWithModel(model)
  },
  pauseWithModel: function (model) {
    var self = this
    audioPlayer.src = model.bdcAudio;
    audioPlayer.stop();


    for (var i = 0; i < self.data.messages.length; i++) {

      var item = self.data.messages[i];
      item.isPlay = false
    }

    self.setData({
      messages: self.data.messages
    })

    if(this.data.allPlay) {
      if(index < self.data.messages.length - 1) {
        index ++;
      }else {
        this.setData({
          allPlay:false
        })

        this.pauseWithModel(self.data.messages[index])
        return
      }
      var nextPlayModel =  self.data.messages[index]
      this.playWithModel(nextPlayModel)
    }
  },
/**
   * 播放
   */

  playWithSender: function (sender) {
    var self = this
    var model = sender.currentTarget.dataset.model;

    self.playWithModel(model)
    self.setData({
      allPlay: false
    })
    index = 0;
  },
  playWithModel: function (model) {
    var self = this
    audioPlayer.src = model.bdcAudio;
    audioPlayer.play();

    model.isPlay = true

    for (var i = 0; i < self.data.messages.length; i++) {

      var item = self.data.messages[i];
      if (item.bdcAudio == model.bdcAudio) {
        console.log('播放的是' + model.bdcTitle)
        item.isPlay = true
      }else {
        item.isPlay = false;
      }
    }

    self.setData({
      messages: self.data.messages
    })

  },

  /**
   * 全部播放
   */

  allPlayButtonDidClicked : function () {
    var allPlay = !this.data.allPlay

    if(allPlay == true) {
      //全部播放
      index = 0
      this.playWithModel(this.data.messages[0])
    }else {
      //暂停
    index = 0

      for (var i = 0; i < this.data.messages.length; i++) {
        var obj = this.data.messages[i];
        obj.isPlay = false
      }
      audioPlayer.stop()
      this.setData ({
        messages : this.data.messages
      })
    }
    this.setData ({
      allPlay:allPlay
    })
  },
  didSelectedCell: function (sender){
    var self = this
    wx.navigateTo({
      url: '/pages/broadcastDetail/broadcastDetail?bdcId=' + sender.currentTarget.dataset.bdcid + '&bdcTitle=' + sender.currentTarget.dataset.title,
    })
  },


  /**
   * 筛选
   */
  fillButtonDidClicked : function () {
    this.setData({
      showFill:true
    })
  },


  touchmove : function (){
    this.setData({
      showFill:false
    })
  },

  didSelectedType : function(sender) {

    infoType = sender.currentTarget.dataset.typeid;
    page = 1;
    this.setData ({
      showFill:false,
      messages:[]
    })
    this.getBroadcastList()
    
  },
})