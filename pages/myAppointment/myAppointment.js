// pages/myAppointment/myAppointment.js
import {
  globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
var longitude = "";
var latitude = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    isShow: false,
    type: 'now',
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
    records: [
      {
        isData: true,
      }
    ], // 列表显示的数据源
    pages: 1,    // 总页数
    current: 1,  // 当前页数  默认是1
    hasmore: true,
    hasNextPage: true,
    newRecords: [],
    hasempty: false,
    longitude: '',
    latitude: ''
  },
  changeTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    var currentIndex = e.currentTarget.dataset.index;
    let type;
    if (currentIndex == 0) {
      type = 'now'
    } else {
      type = 'end'
    }
    if (this.data.tempindex != currentIndex) {
      this.data.newRecords = []
      this.data.tempindex = currentIndex
      this.data.current = 1
    }
    this.setData({
      type: type
    })
    this.getData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    longitude = options.longitude
    latitude = options.latitude
    this.getData();
  },
  getData: function () {
    let that = this;
    wx.showLoading({
      title: '正在加载',
    })

    var pageIndex = that.data.current;
    var type = that.data.type;
    if (pageIndex == 1) {
      that.data.newRecords = []
    }
    wx.request({
      url: globalUrls.baseUrl + '/information/information/myJoinList',
      method: 'GET',
      data: {
        current: pageIndex,
        size: 10,
        type: type,
        latitude: latitude ? latitude : 1,
        longitude: longitude ? longitude : 1
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
    console.log("aaaaaaa", curpage)
    that.data.current = curpage + 1
    console.log("bbbb", that.data.pages)

    if ((curpage + 1) <= that.data.pages) {
      that.getData(curpage + 1)
    } else {
      that.setData({
        "hasmore": false
      })
    }
  },
  //进入详情
  //进入信息详情
  didSelectedCell: function (e) {
    var that = this
    console.log(e)
    let type = e.currentTarget.dataset.type
    if (type == "info") {
      let infoId = e.currentTarget.dataset.infoid
      let infoTitle = e.currentTarget.dataset.title
      var model = JSON.stringify({ infoId: infoId, infoTitle: infoTitle, longitude: that.data.longitude, latitude: that.data.latitude })
      wx.navigateTo({
        url: '/pages/infoDetail/infoDetail?infoId=' + infoId + '&infoTitle=' + infoTitle,
      })
    } else if (type == "broadcast") {
      let bdcId = e.currentTarget.dataset.infoid
      let infoTitle = e.currentTarget.dataset.title
      var model = JSON.stringify({ bdcId: bdcId, bdcTitle: infoTitle })
      wx.navigateTo({
        url: '/pages/broadcastDetail/broadcastDetail?bdcId=' + bdcId + '&bdcTitle=' + infoTitle,
      })
    } else if (type == "gift") {
      let giftId = e.currentTarget.dataset.infoid
      let giftTitle = e.currentTarget.dataset.giftTitle
      let longitude = that.data.longitude
      let latitude = that.data.latitude
      var model = JSON.stringify({
        giftId: giftId,
        giftTitle: giftTitle,
        longitude: longitude,
        latitude: latitude
      })
      wx.navigateTo({
        url: '/pages/redPacketDetail/redPacketDetail?giftId=' + giftId + '&giftTitle=' + giftTitle,
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})