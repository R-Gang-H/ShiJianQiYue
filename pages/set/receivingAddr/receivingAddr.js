// pages/set/receivingAddr/receivingAddr.js
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
    editIcon: aliImg + "edit_icon.png",
    records: [],
    tempindex: 0,
    pages: 1, // 总页数
    current: 1, // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    hasempty: false,
    addressId: '',
    name: "",
    mobile: "",
    sex: "",
    address: "",
    address2: "",
    checked: true,
    // 初始化定义 不是从确认订单页面来的
    isConfirmOrder: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isConfirmOrder: options.isConfirmOrder
    })
    this.getData()
    let that = this;
    var flag = true; //判断是从哪个页面跳转过来
    // flag = options.flag;
    console.log(options)
    //var data = options.model
    // let obj = JSON.parse(data)
    var data = ""
    let obj = {
      "name": '',
      "mobile": '',
      "sex": '',
      "address": '',
      "address2": ''
    }
    // if (null != options && {} != options) {
    //   data = options.model
    //   obj = JSON.parse(data)
    // }

    if (flag) {
      that.data.records.push({
        "name": obj.name,
        "mobile": obj.mobile,
        "sex": obj.sex,
        "address": obj.address + obj.address2,
      })
      that.setData({
        records: that.data.address,
        hasempty: false,
      })
    };

  },
  // 获取数据
  getData() {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    var pageIndex = that.data.current;
    if (pageIndex == 1) {
      that.data.newRecords = []
    }
    wx.request({
      url: globalUrls.baseUrl + '/user/address/page',
      data: {
        current: pageIndex,
        size: 10,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Authorization": globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        let records = res.data.data.records
        that.data.pages = res.data.data.pages
        that.data.records = records
        for (var i = 0; i < records.length; i++) {
          that.data.newRecords.push(records[i])
        }
        records = that.data.newRecords
        if (records.length < 10 || res.data.data.pages <= that.data.current) {
          that.setData({
            hasmore: false,
            hasNextPage: true,
            hasempty: false,
            current: res.data.current,
            records: records,
          })
        } else {
          that.setData({
            hasempty: false,
            hasNextPage: false,
            hasmore: false,
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
      }
    })
  },
  // 跳转新增地址
  addAddress: function () {
    // console.log(11)
    wx.redirectTo({
      url: '/pages/set/newAddress/newAddress',
    })
    // wx.navigateTo({
    //   url: '/pages/set/newAddress/newAddress',
    // })
  },
  // 编辑地址
  editAddress: function (e) {
    var that = this;
    // console.log(e)
    var data = e.currentTarget.dataset
    let addressId = data.addressid
    // let infoTitle = data.title
    let name = data.name
    let mobile = data.mobile
    let sex = data.sex
    let address = data.address
    let address2 = data.address2
    // wx.navigateTo({
    //   url: '/pages/set/newAddress/newAddress?addressId=' + addressId + "&name=" + name + "&sex=" + sex + "&mobile=" + mobile + "&address=" + address + "&address2=" + address2
    // })
    wx.redirectTo({
      url: '/pages/set/newAddress/newAddress?addressId=' + addressId + "&name=" + name + "&sex=" + sex + "&mobile=" + mobile + "&address=" + address + "&address2=" + address2
    })
  },
  // 从确认订单页面过来的 修改收货地址
  changeAddress: function (e) {
    // 证明是从确认订单页面过来的 点击要切换地址 回到确认订单页面
    if (this.data.isConfirmOrder) {
      // 返回上一页携带参数
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        name: e.currentTarget.dataset.index.name,
        mobile:e.currentTarget.dataset.index.mobile,
        address:e.currentTarget.dataset.index.address+e.currentTarget.dataset.index.address2,
        isChangeAddress:true
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1 //想要返回的层级
        })
      }, 1000)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})