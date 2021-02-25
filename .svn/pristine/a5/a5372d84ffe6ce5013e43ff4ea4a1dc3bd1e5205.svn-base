// pages/myInitiation/myInitiation.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, // 是否显示左上角图标   1表示显示    0表示不显示
      title1: '信息', // 导航栏 中间的标题   0表示不显示
      title2: '商品', // 导航栏 中间的标题   0表示不显示
      textColor: '#fff', // 标题颜色
      bgColor: '#fff', // 导航栏背景颜色
      btnBgColor: '#2B6ED9', // 胶囊按钮背景颜色
      iconColor: 'white', // icon颜色 black/white
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.systeminfo.statusBarHeight * 2 + 20,
    curIndex: 0,
    currentIndex: 0,

    isShow: false,
    isLine: false,
    isBorder: false,
    type: 'now', //选择状态
    tempindex: 0,
    action: {
      method: 'pause'
    },
    audioSrc: aliImg + "a.mp3",
    audioImg: aliImg + "iv_plau.png",
    audioImg1: aliImg + "ic_paush.png",
    shop: aliImg + "ic_shop_certifi.png",
    shuji: aliImg + "ic_sheik_certifi.png",
    gift: aliImg + "ic_27.png",
    infoId: "",
    records: [{
      isData: true,
    }], // 列表显示的数据源
    pages: 1, // 总页数
    current: 1, // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    hasempty: false,
    longitude: '',
    latitude: ''
  },
  // 头部切换
  changeheadTab: function (e) {
    let curIndex = e.detail.curIndex
    this.setData({
      curIndex: e.detail.curIndex
    })
    if (curIndex == 0) {
      this.getData()
      // this.data.isLine = false
      // this.data.isBorder = false
    } else { //商品
      this.setData({
        currentIndex: 0,
        type: 'now'
      })
      this.getGoods()
      // this.data.isLine = true
      // this.data.isBorder = true
    }
  },
  // 信息切换
  changeTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    var currentIndex = e.currentTarget.dataset.index;
    if (currentIndex == 0) {
      this.data.type = 'now'
    } else if (currentIndex == 1) {
      this.data.type = 'cancel'
    } else {
      this.data.type = 'end'
    }
    if (this.data.tempindex != currentIndex) {
      this.data.newRecords = []
      this.data.tempindex = currentIndex
      this.data.current = 1
    }
    this.setData({
      type: this.data.type
    })
    // 判断是请求信息数据还是商品数据
    if (this.data.curIndex == 0) {
      this.getData()
    } else {
      this.getGoods()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    // this.getGoods();
  },
  // 获取信息
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    var pageIndex = that.data.current;
    if (pageIndex == 1 || pageIndex == undefined) {
      that.data.newRecords = []
      that.data.current = 1
      pageIndex = 1
    }
    wx.request({
      url: globalUrls.baseUrl + '/information/information/myList',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10,
        type: that.data.type,
      },
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        // 关闭下来刷新
        wx.stopPullDownRefresh()
        console.log(res)
        let records = res.data.data.records
        console.log(records)
        that.data.pages = res.data.data.pages
        // 修改时间
        for (var i = 0; i < records.length; i++) {
          records[i].isData = true
          //小时分钟
          var temptime = records[i].createTime
          var timearr = temptime.split(" ")
          if (null != timearr && timearr.length > 1) {
            temptime = timearr[0].substring(6, 10)
            records[i].createTime2 = temptime
          }
          //时间差
          var msg = ""
          var date1 = new Date()
          var date2 = new Date(records[i].expireTime)
          var s1 = date1.getTime(),
            s2 = date2.getTime();
          var total = (s2 - s1) / 1000
          var day = parseInt(total / (24 * 60 * 60)); //计算整数天数
          if (day > 0) {
            msg = "距离结束还有" + day + "天"
          } else if (day == 0) {
            var afterDay = total - day * 24 * 60 * 60 //取得算出天数后剩余的秒数
            var hour = parseInt(afterDay / (60 * 60)) //计算整数小时数
            if (hour >= 1) {
              msg = "距离结束还有" + hour + "小时"
            } else if (hour > 0 && hour < 1) {
              msg = "马上结束"
            } else {
              msg = "已结束"
            }
          } else {
            msg = "已结束"
          }

          if (that.data.type == "end") {
            msg = "已结束"
          }
          records[i].msg = msg

          //补全img的网址
          var img = ""
          var infoImages = ""
          img = records[i].infoImages
          var arr = img.split(",")
          if (null != arr && arr.length > 0) {
            var imgtype = arr[0].toLowerCase().split('.');
            //BMP格式；2、JPEG格式；3、GIF格式；4、PSD格式；5、PNG格式；6、TIFF格式；7、TGA格式、8、EPS格式
            if ((imgtype[1]) == "tiff" || (imgtype[1]) == "png" || (imgtype[1]) == "jpeg" || (imgtype[1]) == "bmp" || (imgtype[1]) == "jpg" || (imgtype[1]) == "tga") {
              infoImages = imgUrl + arr[0]
              console.log(infoImages)
            } else {
              infoImages = ''
            }
          }
          records[i].infoImages = infoImages

          // 补全audio路径
          var audiosrc = "";
          var infoDesc = ""
          audiosrc = records[i].infoDesc
          if (/.*[\u4e00-\u9fa5]+.*$/.test(records[i].infoDesc)) {
            infoDesc = ''
          } else {
            infoDesc = imgUrl + records[i].infoDesc
          }
          records[i].infoDesc = infoDesc

          // 应约人
          var joinNum = ""
          joinNum = "应约" + records[i].joinNum + "人"
          records[i].joinNum = joinNum

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
            isLine: that.data.isLine,
            isBorder: that.data.isBorder
          })
        } else {
          that.setData({
            hasNextPage: false,
            hasempty: false,
            records: records,
            isLine: that.data.isLine,
            isBorder: that.data.isBorder
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
  // 播放录音
  audioPlay: function (e) {
    var index = e.currentTarget.dataset.curindex;
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index,
      index: index
    })
    console.log(this.data.records[index])
    // var that=this;
    if (this.data.records[index]) {
      var audioContext = wx.createAudioContext("myAudio" + _index)
      var hasChange = this.data.records[index].isData;
      // console.log(hasChange)
      // console.log(hasChange)
      if (hasChange !== undefined) {
        // var onum = this.data.list[index].praise;
        // console.log("11",onum)
        if (hasChange) {
          // this.data.list[index].praise = (onum - 1);
          this.data.records[index].isData = false;

          audioContext.play();
          // this.data.list[index].action.method = play;
        } else {
          // this.data.list[index].praise = (onum + 1);
          this.data.records[index].isData = true;

          audioContext.pause();
        }
        this.setData({
          records: this.data.records
        })
      }
    }
  },
  // 获取商品
  getGoods: function (e) {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })
    var pageIndex = that.data.current;
    if (pageIndex == 1 || pageIndex == undefined) {
      that.data.newRecords = []
      that.data.current = 1
      pageIndex = 1
    }
    wx.request({
      url: globalUrls.baseUrl + '/information/product/myList',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10,
        type: that.data.type,
      },
      header: {
        Authorization: globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        // 关闭下来刷新
        wx.stopPullDownRefresh()
        console.log(res)
        let records = res.data.data.records
        console.log(records)
        that.data.pages = res.data.data.pages
        // 修改时间
        for (var i = 0; i < records.length; i++) {
          records[i].isData = true
          //小时分钟
          var temptime = records[i].createTime
          if (records[i].createTime != null) {
            var timearr = temptime.split(" ")
            if (null != timearr && timearr.length > 1) {
              temptime = timearr[0].substring(6, 10)
              records[i].createTime2 = temptime
            }
          }
          //时间差
          var msg = ""
          var date1 = new Date()
          var date2 = new Date(records[i].expireTime)
          var s1 = date1.getTime(),
            s2 = date2.getTime();
          var total = (s2 - s1) / 1000
          var day = parseInt(total / (24 * 60 * 60)); //计算整数天数
          if (day > 0) {
            msg = "距离结束还有" + day + "天"
          } else if (day == 0) {
            var afterDay = total - day * 24 * 60 * 60 //取得算出天数后剩余的秒数
            var hour = parseInt(afterDay / (60 * 60)) //计算整数小时数
            if (hour >= 1) {
              msg = "距离结束还有" + hour + "小时"
            } else if (hour > 0 && hour < 1) {
              msg = "马上结束"
            } else {
              msg = "已结束"
            }
          } else {
            msg = "已结束"
          }

          if (that.data.type == "end") {
            msg = "已结束"
          }
          records[i].msg = msg

          //补全img的网址
          var img = ""
          var infoImages = ""
          img = records[i].productImages
          var arr = img.split(",")
          if (null != arr && arr.length > 0) {
            var imgtype = arr[0].toLowerCase().split('.');
            //BMP格式；2、JPEG格式；3、GIF格式；4、PSD格式；5、PNG格式；6、TIFF格式；7、TGA格式、8、EPS格式
            if ((imgtype[1]) == "tiff" || (imgtype[1]) == "png" || (imgtype[1]) == "jpeg" || (imgtype[1]) == "bmp" || (imgtype[1]) == "jpg" || (imgtype[1]) == "tga") {
              infoImages = imgUrl + arr[0]
              console.log(infoImages)
            } else {
              infoImages = ''
            }
          }
          records[i].infoImages = infoImages

          var audiosrc = ""
          var infoDesc = ""
          audiosrc = records[i].productDesc
          if (/.*[\u4e00-\u9fa5]+.*$/.test(records[i].infoDesc)) {
            infoDesc = ''
          } else {
            infoDesc = imgUrl + records[i].productDesc
          }
          records[i].infoDesc = infoDesc
          records[i].infoId = records[i].productId

          // 应约人
          var joinNum = ""
          joinNum = "应约" + records[i].joinNum + "人"
          records[i].joinNum = joinNum

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
            isLine: that.data.isLine,
            isBorder: that.data.isBorder
          })
        } else {
          that.setData({
            hasNextPage: false,
            hasempty: false,
            records: records,
            isLine: that.data.isLine,
            isBorder: that.data.isBorder
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
    this.data.current = 1
    this.setData({
      hasNextPage: true,
      current: 1
    })
    if (this.data.curIndex == 0) {
      this.getData()
    } else {
      this.getGoods()
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
    if (that.data.curIndex == 0) {
      if ((curpage + 1) <= that.data.pages) {
        that.getData(curpage + 1)
      } else {
        that.setData({
          "hasmore": false
        })
      }
    } else {
      if ((curpage + 1) <= that.data.pages) {
        that.getGoods(curpage + 1)
      } else {
        that.setData({
          "hasmore": false
        })
      }
    }
  },
  //进入信息详情
  didSelectedCell: function (e) {
    var that = this
    console.log(e)
    let type = e.currentTarget.dataset.type
    var infoId = e.currentTarget.dataset.infoid
    var infoTitle = e.currentTarget.dataset.infoTitle
    if (type == "info") {
      wx.navigateTo({
        url: '/pages/infoDetail/infoDetail?infoId=' + infoId + '&infoTitle=' + infoTitle,
      })
    } else if (type == "broadcast") {
      wx.navigateTo({
        url: '/pages/broadcastDetail/broadcastDetail?bdcId=' + infoId + '&bdcTitle=' + infoTitle,
      })
    } else if (type == "gift") {
      wx.navigateTo({
        url: '/pages/redPacketDetail/redPacketDetail?giftId=' + infoId + '&giftTitle=' + infoTitle,
      })
    } else {
      wx.navigateTo({
        url: '/pages/marketDeatil/marketD?productId=' + infoId,
      })
    }
  },
  // 进入商品详情
  goodDetail: function (e) {
    let productId = e.currentTarget.dataset.productid
    let title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/marketDeatil/marketD?productId=' + productId + "&tvTitle=" + title
    })
  },
  // 刷新页面的方法
  changeData: function () {
    // var options = { 'id': this.data.id }
    this.getGoods(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})