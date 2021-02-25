// pages/myForward/myForward.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buy:"购买人数",
    forward:"转发收入",
    tempindex: 0,
    pages: 1,    // 总页数
    current: 1,  // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    hasempty: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    var pageIndex = that.data.current;
    if (pageIndex == 1) {
      that.data.newRecords = []
    }
    wx.request({
      url: globalUrls.baseUrl + '/product/product/pageForward',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10,
      },
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
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
  //进入详情
  goodDetail: function (e) {
    // console.log(e)
    let productId = e.currentTarget.dataset.productid
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/marketDeatil/marketD?productId=' + productId + "&tvTitle=" + title
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log(111)
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
})