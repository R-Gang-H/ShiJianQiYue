// pages/groupInfo/groupInfo.js

var message = require('../../utils/message.js')
var global = require('../../utils/global.js')

var that, tim, groupId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    head: '/images/no_login.png',
    nNotification: '群主很懒,什么都没有留下',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    tim = global.userInfo.txIm;

    groupId = options.groupId;
    console.log("groupId" + groupId);

    that.getGroupProfile();
    that.getGroupMemberList();
  },

  // 获取群详细资料
  getGroupProfile: function() {
    message.getGroupProfile(tim, groupId, (datas) => {
      console.log("群资料==>" + datas);
      that.setData({
        group: datas,
      })
    });
  },

  // 获取群成员列表
  getGroupMemberList: function() {
    message.getGroupMemberList(tim, groupId, (datas) => {
      that.setData({
        groupMember: datas,
        userNumber: datas.length, // 群成员
      })
      wx.setStorageSync(groupId, that.data.userNumber);
      console.log("群成员数量==>" + datas.length);
    });
  },

  // 点击头像查看个人信息
  getUserInof: function(e) {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userId=' + e.currentTarget.dataset.userid,
    })
  },

  // 退出群聊
  quitGroup: function() {
    wx.showModal({
      title: '提示',
      content: '你确定要退出此圈子吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          message.quitGroup(tim, groupId, (datas) => {
            wx.switchTab({
              url: '/pages/group/group',
            })
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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

  }
})