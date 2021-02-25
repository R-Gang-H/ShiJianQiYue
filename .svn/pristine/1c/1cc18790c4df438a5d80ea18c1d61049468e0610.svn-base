// pages/myfollow/myfollow.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    isShow: false,
    tempindex: 0,
    pages: 1,    // 总页数
    current: 1,  // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    hasempty: false,
    isFollow:''
  },
  changeTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    var currentIndex = e.currentTarget.dataset.index;
    if (this.data.tempindex != currentIndex) {
      this.data.newRecords = []
      this.data.tempindex = currentIndex
      this.data.current = 1
    }
    this.setData({
      current:1
    })
    if (currentIndex == 0) {
      this.getData()
    } else if (currentIndex == 1) {
      this.getFans()
    } 
  },
  onShow:function(){
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getData();
  },
  // 我关注的人
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })

    var pageIndex = that.data.current;
    var type = that.data.type;
    if (pageIndex == 1 ||pageIndex==undefined) {
      that.data.newRecords = []
      pageIndex =1
      that.data.current =1
    }
    wx.request({
      url: globalUrls.baseUrl + '/user/follow/myList',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10
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
          var avatar = ""
          img = records[i].avatar
          var arr = img.split(",")
          if (null != arr && arr.length > 0) {
            var imgtype = arr[0].toLowerCase().split('.');
            //BMP格式；2、JPEG格式；3、GIF格式；4、PSD格式；5、PNG格式；6、TIFF格式；7、TGA格式、8、EPS格式
            if ((imgtype[1]) == "tiff" || (imgtype[1]) == "png" || (imgtype[1]) == "jpeg" || (imgtype[1]) == "bmp" || (imgtype[1]) == "jpg" || (imgtype[1]) == "tga") {
              avatar = imgUrl + arr[0]
            } else {
              avatar = aliImg+'no_login.png'
            }
          }
          records[i].avatar = avatar
          let isFollow1 = records[i].isFollow
          if (isFollow1 == 0) {
            isFollow1 = "已关注"
          } else {
            isFollow1 = "互相关注"
          }
          records[i].isFollow1 = isFollow1
          that.data.newRecords.push(records[i])
        }
        records = that.data.newRecords
        that.data.records = records
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
            hasNextPage: false,
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
  // 我的粉丝
  getFans: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })

    var pageIndex = that.data.current;
    var type = that.data.type;
    if (pageIndex == 1 || pageIndex == undefined) {
      that.data.newRecords = []
      pageIndex = 1
      that.data.current = 1
    }
    wx.request({
      url: globalUrls.baseUrl + '/user/follow/followMeList',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10
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
          var avatar = ""
          img = records[i].avatar
          var arr = img.split(",")
          if (null != arr && arr.length > 0) {
            var imgtype = arr[0].toLowerCase().split('.');
            //BMP格式；2、JPEG格式；3、GIF格式；4、PSD格式；5、PNG格式；6、TIFF格式；7、TGA格式、8、EPS格式
            if ((imgtype[1]) == "tiff" || (imgtype[1]) == "png" || (imgtype[1]) == "jpeg" || (imgtype[1]) == "bmp" || (imgtype[1]) == "jpg" || (imgtype[1]) == "tga") {
              avatar = imgUrl + arr[0]
            } else {
              avatar = aliImg + 'no_login.png'
            }
          }
          records[i].avatar = avatar
          let isFollow1 = records[i].isFollow
          if (isFollow1 == 1) {
            isFollow1 = "互相关注"
          } else {
            isFollow1 = "+ 关注"
          }
          records[i].isFollow1 = isFollow1
          console.log(isFollow1)
          that.data.newRecords.push(records[i])
        }
        records = that.data.newRecords
        that.data.records = records
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
            hasNextPage: false,
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
  // 取消关注
  cancelFollow:function(e){
    console.log(e)
    let that=this;
    let fUid = e.currentTarget.dataset.fuid
    wx.showModal({
      title: '提示',
      content: '您确定取消关注？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后    
          wx.request({
            url: globalUrls.baseUrl + '/user/follow/cancel',
            data: {
              fUid: fUid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              Authorization: globalUrls.authorization
            }, // 设置请求的 header
            success: function (res) {
              // console.log("11", res)
              wx.showToast({
                title: '取消关注成功',
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
  // 关注某人
  followPeoson: function (e) {
    console.log(11)
    let that = this;
    let fUid = e.currentTarget.dataset.fuid
    console.log(fUid)
    wx.showModal({
      title: '提示',
      content: '您确定关注？',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后    
          wx.request({
            url: globalUrls.baseUrl + '/user/follow/follow',
            data: {
              fUid: fUid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              Authorization: globalUrls.authorization
            }, // 设置请求的 header
            success: function (res) {
              // console.log("11", res)
              wx.showToast({
                title: '关注成功',
                icon: 'none',
                duration: 1000
              })
              that.getFans()
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
  // 个人详情
  personInfor:function(e){
    let userId = e.currentTarget.dataset.userid
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userId=' + userId
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

    if(this.data.currentIndex == 0){
      this.getData()
    }else{
      this.getFans()
    }

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var curpage = that.data.current;
    console.log("aaaaaaa", curpage)
    that.data.current = curpage + 1
    console.log("bbbb", that.data.pages)
    if (that.data.currentIndex == 0) {
      if ((curpage + 1) <= that.data.pages) {
        that.getData(curpage + 1)
      } else {
        that.setData({
          "hasmore": false
        })
      }
    } else {
      if ((curpage + 1) <= that.data.pages) {
        that.getFans(curpage + 1)
      } else {
        that.setData({
          "hasmore": false
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})