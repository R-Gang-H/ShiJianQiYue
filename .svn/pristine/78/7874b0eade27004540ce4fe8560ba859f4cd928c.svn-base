// pages/transactionDetails/transactionDetails.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buy: "购买人数",
    forward: "转发收入",
    tempindex: 0,
    pages: 1, // 总页数
    current: 1, // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    hasempty: false,
    fromType: '' //判断是从哪个页面过来的
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromType: options.from
    })
    if (this.data.fromType == "me") { //从个人页面进来 请求待退还保证金数据
      this.getBackBzjList();
      // 设置标题
      wx.setNavigationBarTitle({
        title: "待退保证金"
      })
    } else { //从钱包页面进来 请求我的余额
      this.getData();
      wx.setNavigationBarTitle({
        title: "余额明细"
      })
    }
  },
  // 查询待退还保证金
  getBackBzjList: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    var pageIndex = that.data.current;
    if (pageIndex == 1) {
      that.data.newRecords = []
    }
    wx.request({
      url: globalUrls.baseUrl + globalUrls.getBackBzjList,
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
          var amount = records[i].amount
          records[i].amount = amount.toFixed(2)

          var createTime = records[i].createTime
          createTime = createTime.substring(0, 16)
          records[i].createTime = createTime
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
      url: globalUrls.baseUrl + '/pay/balancelog/myList',
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

          var initAmount = records[i].initAmount
          var afterAmount = records[i].afterAmount
          // var amount = afterAmount - initAmount
          // amount = amount.toFixed(2)
          // console.log(amount)
          // let str = amount+""
          // if (str.indexOf(".") != -1 && str.substr(str.length - 1, 1) == '0'){
          //   amount = parseInt(str)
          // }
          // if (amount > 0) {
          //   amount = "+" + amount
          // }
          records[i].remark=records[i].typeName
          // records[i].amount = amount
          records[i].isClear = 0
          var createTime = records[i].createTime
          createTime = createTime.substring(0, 16)
          records[i].createTime = createTime

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
    if (this.data.fromType == "me") { //退还保证金
      that.getBackBzjList()
    } else {
      this.getData() //余额明细 
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var curpage = that.data.current;
    that.data.current = curpage + 1
    if ((curpage + 1) <= that.data.pages) {
      if (that.data.fromType == "me") { //退还保证金
        that.getBackBzjList(curpage + 1)
      } else {
        that.getData(curpage + 1) //余额明细 
      }
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },
})