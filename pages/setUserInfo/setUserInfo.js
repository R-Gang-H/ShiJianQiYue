// pages/setUserInfo/setUserInfo.js

var global = require("../../utils/global.js")
var util = require("../../utils/util.js")
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: [{
        placeholder: '请选择性别',
        title: '性别',
        text: '',
      },
      {
        placeholder: '请选择出生年月',
        title: '出生年月',
        text: '',
      },


    ],
    sex: [
      '男',
      '女'
    ],

    nickname: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindDateChange: function(picker) {
    console.log(picker)
    var self = this
    var data = self.data.titles
    if (picker.currentTarget.dataset.title == '性别') {

      //性别
      var dict = data[0]
      dict.text = picker.detail.value == 1 ? '女' : '男'
      self.setData({
        titles: data
      })
      return
    }
    var date = data[1]
    date.text = picker.detail.value
    self.setData({
      titles: data
    })
  },

  /**
   * 昵称输入框监听输入
   */
  textFieldDidChange: function(textField) {
    var self = this
    self.setData({
      nickname: textField.detail.value
    })
  },



  //确定
  doneButtonDidClicked: function() {

    var self = this
    if (self.data.nickname.length == 0) {
      wx.showToast({
        title: '昵称不能为空',
      })
      return
    }
    var sexObj = self.data.titles[0]
    if (sexObj.text.length == 0) {
      wx.showToast({
        title: '请选择性别',
      })
      return
    }
    var ageObj = self.data.titles[1]
    if (ageObj.text.length == 0) {
      wx.showToast({
        title: '请选择出生年月',
      })
      return
    }

    console.log('昵称是' + self.data.nickname)
    console.log('性别是' + sexObj.text)
    console.log('出生年月是' + ageObj.text)

    self.setUserInfo(self.data.nickname, sexObj.text == '男' ? '1' : '2', ageObj.text)

  },

  setUserInfo: function(nicknameValue, sexValue, birthdayValue) {

    wx.request({
      url: global.globalUrls.baseUrl + global.globalUrls.setUserInfo,
      method: 'POST',
      header: {
        Authorization: global.globalUrls.authorization,
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {
        sex: sexValue,
        birthday: birthdayValue,
        name: nicknameValue,
        user_id:global.userInfo.userId,
      },
      success: function(res) {
        if (util.checkRequestSuccess(res)) {
          global.userInfo.name = nicknameValue;
          WxNotificationCenter.postNotificationName('loginNotification')
          message.updateMyProfile(tim, global.userInfo, (userinfo) => {
            console.log("设置个人信息成功=>" + JSON.stringify(userinfo));
            wx.navigateBack({

            })
          });
        } else {

        }


      },
      fail: function(err) {

      }
    })
  }
})