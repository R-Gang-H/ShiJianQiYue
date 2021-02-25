// pages/shopOrderDetail/shopOrderDetail.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fh: "x",
    status: '',
    orderId: '',
    orderNum:"订单编号"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.orderId
    if (orderId == null || undefined == orderId || "" == undefined) {
      orderId = this.data.orderId
    }
    this.data.orderId = orderId
    this.getData()
  },
  onShow: function () {
    this.getData(orderId)
  },
  getData: function () {
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
        let remark = data.remark
        if(remark==null){
          remark=""
        }
        data.remark = remark
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
  productDetail: function (e) {
    let productId = e.currentTarget.dataset.productid
    wx.navigateTo({
      url: '/pages/marketDeatil/marketD?productId=' + productId,
    })
  },
  /**
   * 弹窗
   */
  showDialogBtn: function (e) {
    let orderId = e.currentTarget.dataset.orderid
    console.log(orderId)
    this.setData({
      showModal: true,
      orderId: orderId
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  formSubmit: function (e) {
    let that = this
    console.log(e)
    let orderId = e.detail.target.dataset.orderid
    console.log(orderId)
    let information = e.detail.value;
    let logisticsName = information.logisticsName
    let logisticsSku = information.logisticsSku
    var flag = false;
    if (logisticsName == "") {
      wx.showToast({
        title: '物流信息不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (logisticsSku == "") {
      wx.showToast({
        title: '物流单号不能为空',
        icon: 'none',
        duration: 1000
      })
    } else {
      flag = true;
      wx.request({
        url: globalUrls.baseUrl + '/product/order/sendOutGoods',
        method: 'GET',
        data: {
          orderId: orderId,
          logisticsName: logisticsName,
          logisticsSku: logisticsSku
        },
        header: {
          "Authorization": globalUrls.authorization
        }, // 设置请求的 header
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            wx.showToast({
              title: '发货成功',
              icon: 'none',
              duration: 1000
            })
            that.hideModal();
            that.getData()
          }
        },
        fail: function (err) {
          wx.showToast({
            title: err.errMsg,
          })
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