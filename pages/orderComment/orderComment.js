// pages/orderComment/orderComment.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fh:"x",
    orderId:"",
    commentContent:"",
    productId:'',
    startflag :""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.orderId
    let that=this
    wx.showLoading({
      title: '正在加载',
    })
    that.data.startflag = options.startflag
    wx.request({
      url: globalUrls.baseUrl + '/product/order/detail',
      data: {
        orderId: orderId,
        startflag: that.data.startflag
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        var data=res.data.data
        let orderId = data.orderId
        that.data.orderId = orderId
        let productId = data.productIds
        that.data.productId = productId
        var img=''
        var productImages = ''
        img = data.productImages
        productImages = imgUrl + img
        data.productImages = productImages
        that.setData({
          data:data
        })
        wx.hideLoading();
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  // 发表评价
  formSubmit: function (e) {
    var that = this;
    let information = e.detail.value;
    let orderId = that.data.orderId;
    let startflag = that.data.startflag
    let returnurl = "/pages/myorder/myorder"
    // if (startflag == "list"){
    //   returnurl = "/pages/myorder/myorder"
    // }
    // if (startflag == "detail") {
    //   returnurl = "/pages/orderDetail/orderDetail?orderId="+orderId
    // }

    let commentContent = information.commentContent
    let productId=that.data.productId
    var flag = false;
    if (commentContent == "") {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 1000
      })
    }else{
      flag = true;
      wx.request({
        url: globalUrls.baseUrl + '/product/productcomment/add',
        method: 'POST',
        data: {
          commentContent: commentContent,
          orderId:orderId,
          productId: productId
        },
        header: {
          "Authorization": globalUrls.authorization,
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            wx.showToast({
              title: '评价成功',
              icon: 'none',
              duration: 1000
            })

            if (startflag == "detail") {
              returnurl = "/pages/orderDetail/orderDetail?orderId=" + orderId
              // wx.navigateTo({
              //   url: returnurl,
              // })
              wx.redirectTo({
                url: returnurl,
              })
            }else{
              returnurl = "/pages/myorder/myorder"
              // wx.navigateTo({
              //   url: returnurl,
              // })
              wx.redirectTo({
                url: returnurl,
              })
            }
            
          }
        }
      })
    }
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

  }
})