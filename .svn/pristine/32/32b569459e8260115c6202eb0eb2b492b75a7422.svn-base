// pages/mine/mine.js
import {
  globalUrls
} from "../../utils/global.js"
const app = getApp()
var message = require('../../utils/message.js')
var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
let aliImg = globalUrls.aliImg
let imgUrl = globalUrls.imgUrl

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "登录",
    todayIncome: "--",
    balance: "--",
    avatar: aliImg + "no_login.png",
    arrow: aliImg + "arrow_right.png",
    fq_icon: aliImg + "fq_icon.png",
    yyue_icon: aliImg + "yyue_icon.png",
    zf_icon: aliImg + "zf_icon.png",
    ddan_icon: aliImg + "ddan_icon.png",
    gz_icon: aliImg + "gz_icon.png",
    sh_icon: aliImg + "sh_icon.png",
    set_icon: aliImg + "set_icon.png",
    rz_icon: aliImg + "rz_icon.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getMoney()
    // this.getUser()
  },
  // 获取余额
  getMoney: function() {
    let that = this
    // wx.showLoading({
    //   title: '正在加载',
    // })
    wx.request({
      url: globalUrls.baseUrl + '/pay/wallet/detail',
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      success: function(res) {
        if (res.data.code == 0) {
          var data = res.data.data
          var balance = data.balance
          balance = balance.toFixed(2)
          var todayIncome = data.returnedBzj
          todayIncome = todayIncome.toFixed(2)
          that.setData({
            todayIncome: todayIncome,
            balance: balance
          })
        }
      },
    })
  },
  // 获取用户信息
  getUser: function() {
    let that = this
    // wx.showLoading({
    //   title: '正在加载',
    // })
    wx.request({
      url: globalUrls.baseUrl + globalUrls.getUserInfo,
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      success: function(res) {
        if (res.data.code == 0) {
          var data = res.data.data
          console.log(data)
          let name = data.name
          let img = data.avatar
          let avatar = ""
          if (img == "") {
            avatar = aliImg + "no_login.png"
          } else {
            avatar = imgUrl + "/" + img
          }
          that.setData({
            name: name,
            avatar: avatar
          })
        }
      },
    })
  },
  // 判断是否登录
  onShow: function() {
    // 首先判断当前是否有用户登录
    let loginflag = false
    loginflag = util.checkIsLogin()
    if (!loginflag) {
      this.data.avatar = aliImg + "no_login.png"
      this.data.name = "未登录"
      this.data.todayIncome = "--"
      this.data.balance = "--"
      this.setData({
        avatar: this.data.avatar,
        todayIncome: this.data.todayIncome,
        balance: this.data.balance,
        name: this.data.name
      })
      wx.clearStorageSync("userinfo");
      wx.showModal({
        title: '提示',
        content: '现在去登录吗？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log("返回上一页")
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      // wx.navigateTo({
      //   url: '/pages/mine/mine',
      // })
      this.getMoney()
      this.getUser()
    }
  },
  // 跳转交易明细
  transactionDetails: function() {
    wx.navigateTo({
      url: '/pages/transactionDetails/transactionDetails?from=me',
    })
  },
  // 跳转余额
  withdrawal: function() {
    wx.navigateTo({
      url: '/pages/withdrawal/withdrawal',
    })
  },
  //  点击上传图片
  changeAvatar: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00B89E",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImageShop('album'); //从相册中选择
          } else if (res.tapIndex == 1) {
            that.chooseWxImageShop('camera'); //手机拍照
          }
        }
      }
    })

  },
  chooseWxImageShop: function(type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        // that.data.avatar = res.tempFilePaths[0],
        that.upload_file(res.tempFilePaths[0])
        // let avatar = res.tempFilePaths[0];
        // that.setData({
        //   avatar: avatar
        // })
      }
    })

  },
  // 上传头像
  upload_file: function(filePath) {
    var that = this;
    wx.uploadFile({
      url: globalUrls.baseUrl + "/upload/upload/upload",
      filePath: filePath,
      fileType: "image",
      name: 'file',
      header: {
        "Authorization": globalUrls.authorization,
      },
      formData: {},
      success: function(res) {
        let data = JSON.parse(res.data);
        console.log(data)
        if (res.statusCode == 200) {
          let path = data.data.path;
          let avatar = ""
          avatar = imgUrl + path
          that.data.avatar = avatar
          that.setData({
            avatar: avatar
          });
          that.edit()
        }
      },
      fail: function(res) {}

    })

  },
  // 获取编辑信息的接口
  edit: function() {
    let ava = this.data.avatar
    var avatar = ava.replace(imgUrl, "")
    console.log(avatar)
    wx.request({
      url: globalUrls.baseUrl + '/user/user/edit',
      method: 'POST',
      data: {
        avatar: avatar
      },
      header: {
        "Authorization": globalUrls.authorization,
        "Content-Type": "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function(res) {
        if (res.statusCode == 200) {
          global.userInfo.avatarIm = ava;
          message.updateMyProfile(global.userInfo.txIm, global.userInfo, (userinfo) => {
            console.log("更新资料成功=>" + JSON.stringify(userinfo));
            wx.showToast({
              title: '上传成功',
              // icon: 'none',
              duration: 1000
            })
          });
        }
      }
    })
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