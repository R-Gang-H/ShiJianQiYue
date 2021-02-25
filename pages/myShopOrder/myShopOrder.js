// pages/myShopOrder/myShopOrder.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    isShow: false,
    status: '1',
    tempindex: 0,
    pages: 1, // 总页数
    current: 1, // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    orderId: '',
    totalJiage: '',
    hasempty: false,
    showModal: false,
    logisticsName:'',
    logisticsSku:''
  },
  changeTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    var currentIndex = e.currentTarget.dataset.index;
    let status;
    if (currentIndex == 0) {
      status = '待发货'
    } else if (currentIndex == 1) {
      status = '待收货'
    } else if (currentIndex == 2) {
      status = '已完成'
    } 
    if (this.data.tempindex != currentIndex) {
      this.data.newRecords = []
      this.data.tempindex = currentIndex
      this.data.current = 1
      this.data.currentIndex = 1

    }
    this.setData({
      status: status,
      current: 1
    })
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  // 获取订单列表数据
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })

    var pageIndex = that.data.current;
    var status = that.data.status;
    if (status == "待发货") {
      status = "1"
    } else if (status == "待收货") {
      status = "3"
    } else if (status == "已完成") {
      status = "4"
    } 

    if (pageIndex == 1 || pageIndex == undefined) {
      that.data.newRecords = []
      that.data.current = 1
      pageIndex = 1
    }
    wx.request({
      url: globalUrls.baseUrl + '/product/order/pageShop',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10,
        status: status
      },
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        // 关闭下来刷新
        wx.stopPullDownRefresh()
        let records = res.data.data.records
        that.data.pages = res.data.data.pages
        for (var i = 0; i < records.length; i++) {
          //补全img的网址
          var img = ""
          var productImages = ""
          img = records[i].productImages
          var arr = img.split(",")
          if (null != arr && arr.length > 0) {
            var imgtype = arr[0].toLowerCase().split('.');
            //BMP格式；2、JPEG格式；3、GIF格式；4、PSD格式；5、PNG格式；6、TIFF格式；7、TGA格式、8、EPS格式
            if ((imgtype[1]) == "tiff" || (imgtype[1]) == "png" || (imgtype[1]) == "jpeg" || (imgtype[1]) == "bmp" || (imgtype[1]) == "jpg" || (imgtype[1]) == "tga") {
              productImages = imgUrl + arr[0]
            } else {
              productImages = ''
            }
          }
          records[i].productImages = productImages

          var productNum = records[i].productNum
          // productNum ="￥"+records[i].productNum
          var totalPrice = records[i].totalPrice
          var totalJiage = productNum * totalPrice
          records[i].totalJiage = totalJiage

          that.data.newRecords.push(records[i])
        }
        records = that.data.newRecords
        that.data.records = records
        if (records.length < 10 || res.data.data.pages <= that.data.current) {
          that.setData({
            hasmore: false,
            hasempty: false,
            hasNextPage: true,
            current: res.data.current,
            records: records,
          })
        } else {
          that.setData({
            hasNextPage: false,
            hasmore: true,
            hasempty: false,
            records: records,
          })
        }
        wx.hideLoading();
        // 无数据时显示空页面
        if (records.length <= 0) {
          that.setData({
            hasmore: false,
            hasempty: true
          })
        }

      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.current = 1
    this.setData({
      hasNextPage: true,
      current: 1
    })
    this.getData()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var curpage = that.data.current;
    that.data.current = curpage + 1

    if ((curpage + 1) <= that.data.pages) {
      that.getData(curpage + 1)
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },
  //进入详情
  didSelectedCell: function (e) {
    let orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/shopOrderDetail/shopOrderDetail?orderId=' + orderId,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})