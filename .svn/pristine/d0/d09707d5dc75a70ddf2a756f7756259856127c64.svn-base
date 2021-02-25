// pages/orderDetail/orderDetail.js
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
    status:'',
    orderId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.orderId
    if (orderId==null|| undefined == orderId || "" == undefined){
     orderId =  this.data.orderId 
    }
    this.data.orderId = orderId
    this.getData()
  },
  onShow: function (options) {
    this.getData(orderId)
  },
  getData: function (){
    let that = this
    wx.showLoading({
      title: '正在加载',
    })
    let orderId = that.data.orderId
    wx.request({
      url: globalUrls.baseUrl + '/product/order/detail',
      data: {
        orderId: orderId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        var data = res.data.data
        console.log(data)
        let orderId = data.orderId
        that.data.orderId = orderId
        let productId = data.productIds
        that.data.productId = productId
        let status = data.status
        console.log(status)
        var img = ''
        var productImages = ''
        img = data.productImages
        productImages = imgUrl + img
        data.productImages = productImages
        that.setData({
          data: data
        })
        wx.hideLoading();
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },
  // 跳转商品详情
  productDetail:function(e){
    let productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/marketDeatil/marketD?productId=' + productId,
    })
  },
  // 取消订单
  cancelOrder: function (e) {
    let orderId = e.currentTarget.dataset.orderid

    console.log(orderId)
    let that = this
    that.data.orderId = orderId
    wx.showModal({
      title: '提示',
      content: '您确定要取消此订单吗？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后    
          wx.request({
            url: globalUrls.baseUrl + '/product/order/cancel',
            data: {
              orderId: orderId
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              Authorization: globalUrls.authorization
            }, // 设置请求的 header
            success: function (res) {
              // console.log("11", res)
              wx.showToast({
                title: '取消订单成功',
                icon: 'none',
                duration: 1000
              })
              that.getData()
            },
            fail: function (err) {
              wx.showToast({
                title: err.errMsg,
              })
            }
          })
        } else { //这里是点击了取消以后     
          console.log('用户点击取消')
        }
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },
  // 去支付
  goPay: function (e) {
    let that = this
    let dataId = e.currentTarget.dataset.orderid
    let price = e.currentTarget.dataset.price
    let product_order = "product_order"
    wx.navigateTo({
      url: '/pages/pay/pay?dataId=' + dataId + "&price=" + price + "&type=" + product_order,
    })
  },
  // 确认收货
  confirmReceipt: function (e) {
    let orderId = e.currentTarget.dataset.orderid
    let that = this
    wx.showModal({
      title: '提示',
      content: '您确认收货吗？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后    
          wx.request({
            url: globalUrls.baseUrl + '/product/order/confirmReceipt',
            data: {
              orderId: orderId
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              Authorization: globalUrls.authorization
            }, // 设置请求的 header
            success: function (res) {
              // console.log("11", res)
              wx.showToast({
                title: '确认收货成功',
                icon: 'none',
                duration: 1000
              })
              that.getData()
            },
            fail: function (err) {
              wx.showToast({
                title: err.errMsg,
              })
            }
          })
        } else { //这里是点击了取消以后     
          console.log('用户点击取消')
        }
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
    })
  },
  // 去评价
  goComment: function (e) {
    let orderId = e.currentTarget.dataset.orderid
    let productId = e.currentTarget.dataset.productids
    // wx.navigateTo({
    //   url: '/pages/orderComment/orderComment?orderId=' + orderId + "&startflag=detail",
    // })
    wx.redirectTo({
      url: '/pages/orderComment/orderComment?orderId=' + orderId + "&startflag=detail",
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

  }
})