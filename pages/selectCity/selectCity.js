// pages/selectCity/selectCity.js
let City = require('../../utils/allcity.js');
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var longitude = '';
var latitude = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: [],
    config: {
      animation: true, // 过渡动画是否开启
      search: false, // 是否开启搜索
      suctionTop: true, // 是否开启标题吸顶
      myCity: false,
    },
    height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



    console.log(options)
    this.setData({
      city: City,
      myCityName:options.city,
      config: {
        animation: true, // 过渡动画是否开启
        search: false, // 是否开启搜索
        suctionTop: true, // 是否开启标题吸顶
        myCity: false,
        myCityName: options.city
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

  },



   bindtap(e) {
    console.log(e.detail)

     WxNotificationCenter.postNotificationName("selectCity",e.detail.name)
     wx.navigateBack({
      
    })
  },
  custombindtap(e) {
    WxNotificationCenter.postNotificationName("selectCity", e.detail)
    wx.navigateBack({

    })
  },
  /**
   * 重新定位 
   * */
  regetlocation() {
    console.log('传递过来了')
    var self = this
    wx.showLoading({
      title: '获取地理位置中',
    })
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        longitude = res.longitude + 0.006256;
        latitude = res.latitude + 0.001276;
        self.ReGeo()
      },
      fail: function (err) {
        console.log('地理位置获取失败')
        console.log(err)
      }
    })
  },
  ReGeo: function () {

    var self = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '951e199bdaa15a1fe91ecd2a8dc04895',
        location: longitude + "," + latitude,

      },
      success: function (res) {
        // WxNotificationCenter.postNotificationName("selectCity", res.data.regeocode.addressComponent.city.length == 0 ? res.data.regeocode.addressComponent.province : res.data.regeocode.addressComponent.city)
        // wx.navigateBack({

        // })
        wx.hideLoading()
        self.setData({
          config: {
            animation: true, // 过渡动画是否开启
            search: false, // 是否开启搜索
            suctionTop: true, // 是否开启标题吸顶
            myCity: false,
            myCityName: res.data.regeocode.addressComponent.city.length == 0 ? res.data.regeocode.addressComponent.province : res.data.regeocode.addressComponent.city
          }
        })
      },
      fail: function (res) {

      }
    })
  }
})