// pages/set/personalInfor/personalInfor.js
import {
  globalUrls
} from "../../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    userId:"",
    intro:"",
    arrow: aliImg + "arrow.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      url: globalUrls.baseUrl + '/user/user/info',
      method: 'GET',
      data: {
      },
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success:function(res){
        if(res.data.code==0){
          let data = res.data.data
          let name = data.name
          let sex = data.sex
          let intro = data.intro
          let userId = data.userId
          let photos = data.photos
          let avatar = data.avatar

          if (sex == 1) {
            sex = "女"
          } else {
            sex = "男"
          }
          let birthday = data.birthday
          that.setData({
            name: name,
            sex: sex,
            birthday: birthday,
            intro: intro,
            photos: photos,
            userId: userId,
          })
        }
        wx.hideLoading();
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      },
    })
  },
  onShow:function(){

  },
  // 跳转到个人简介
  bindProfile:function(){
    var that=this;
    let intro = that.data.intro
    let photos = that.data.photos
    let userId = that.data.userId
    // wx.navigateTo({
    //   url: '/pages/set/profile/profile?intro=' + intro + "&photos=" + photos + "&id=" + userId
    // })
    wx.redirectTo({
      url: '/pages/set/profile/profile?intro=' + intro + "&photos=" + photos + "&id=" + userId
    })
  },
  // 提交
  formSubmit(e) {
    let information = e.detail.value;
    let name = information.name;
    let intro = this.data.intro
    wx.showModal({
      title: '提示',
      content: '确认提交吗？',
      success(res) {
        if (res.confirm) {
          // wx.showLoading({
          //   title: '正在提交',
          // })
          wx.request({
            url: globalUrls.baseUrl + '/user/user/edit',
            method: 'POST',
            data: {
              name:name,
              intro: intro
            },
            header: {
              "Authorization": globalUrls.authorization,
              "Content-Type": "application/x-www-form-urlencoded"
            }, // 设置请求的 header
            success: function (res) {
              console.log("11", res)
              global.userInfo.name = name;
              message.updateMyProfile(global.userInfo.txIm, global.userInfo, (userinfo) => {
                console.log("更新资料成功=>" + JSON.stringify(userinfo));
                wx.showToast({
                  title: '提交成功',
                  // icon: 'none',
                  duration: 1000
                })
              });
            },
            fail: function (err) {
              wx.showToast({
                title: err.errMsg,
              })
            },
          })

          setTimeout(function () {
            // wx.redirectTo({
            //   url: '/pages/set/setlist/setlist',
            // })
            wx.navigateBack({
              
            })
          }, 600)

        } else if (res.cancel) {

        }
      }
    })
  },
  // 性别不能修改
  prohibitsex:function(){
    wx.showToast({
      title: '性别不能修改',
      icon: 'none',
      duration: 2000//持续的时间
    })
  },
  // 生日不能修改
  prohibitbirthday:function(){
    wx.showToast({
      title: '生日不能修改',
      icon: 'none',
      duration: 2000//持续的时间
    })
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
})