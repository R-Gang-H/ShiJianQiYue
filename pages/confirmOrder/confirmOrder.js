// pages/confirmOrder/confirmOrder.js
// 购买商品确认订单
import {
  globalUrls
} from "../../utils/global.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsId: '', //商品ID
    remark: '', //下单备注
    shareUid: '', //转发人ID

    isChangeAddress: false, //默认不是从选择地址页面过来的要请求地址
    addressName: '', //收货人姓名
    addressMobile: '', //收货人手机号
    addressAddress: '', //收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsId: options.productId,
      isChangeAddress: options.isChangeAddress
    })
    // 获取商品详情
    this.getGoodsDetail()
    // 如果是从选取地址页过来的话就直接设置 不再请求地址列表
    
    // 获取地址列表
    this.getMyAddress()



  },
  // 获取收货地址
  getMyAddress: function () {
    var addressData = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.addressList,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        current: '1'
      },
      success: function (res) {
        var data = res.data.data
        if (data.records == null) {
          addressData.setData({
            addressName: '还没有地址 去添加'
          })
          return
        }
        var addressBean = data.records[0]
        console.log(addressBean)
        // 下单数据
        addressData.setData({
          addressName: addressBean.name,
          addressMobile: addressBean.mobile,
          addressAddress: addressBean.address + addressBean.address2,
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  // 获取商品详情
  getGoodsDetail: function () {
    var details = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productDetails,
      method: 'GET',
      //请求头
      header: {
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        productId: details.data.goodsId
        // productId: '18'
      },
      success: function (res) {
        var data = res.data.data
        data.price = '￥' + data.price
        //截取第一张图片
        data.productImages = data.productImages.split(',')[0]
        console.log(res.data.data)
        details.setData({
          goods: data
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  // 商品下订单
  addOrder: function () {
    if (this.data.addressMobile == "") {
      wx.showToast({
        title: '请完善后货人信息',
        icon: 'none',
        duration: 1000
      })
      return
    } 
    var orderData = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.addOrder,
      method: 'POST',
      //请求头
      header: {
        Authorization: globalUrls.authorization,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      // 传参
      data: {
        productIds: orderData.data.goodsId,
        uname: orderData.data.addressName,
        mobile: orderData.data.addressMobile,
        address: orderData.data.addressAddress,
        remark: '',
        shareUid: ''
      },
      success: function (res) {
        var data = res.data.data
        var orderId = data.orderId //商品下单ID
        var price = data.price //商品下单价钱
        console.log(res.data.data)
        // 支付后不再回到这个页面
        wx.redirectTo({
          url: '/pages/pay/pay?price=' + price + '&dataId=' + orderId + '&payType=product_order'
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
    var options=this
    var pages = getCurrentPages(); 
    var prevPage = pages[pages.length - 1];   //上一页
    prevPage.setData({
      addressName: options.data.name,
      addressMobile: options.data.mobile,
      addressAddress: options.data.address
    })
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