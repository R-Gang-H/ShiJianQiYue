// pages/userInfo/userInfo.js
import {
    globalUrls
} from "../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
    // 用户详情页面
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId: '',
        shop: aliImg + "ic_shop_certifi.png",
        shuji: aliImg + "ic_sheik_certifi.png",
        type: 'now',
        status: '1',
        sjHidden: true,
        currentIndex: 0,
        pages: 1,    // 总页数
        current: 1,  // 当前页数  默认是1
        hasmore: true,
        hasNextPage: true,
        newRecords: [],
        hasempty: false,
        longitude: '',
        latitude: '',
        shield:"屏蔽",
        cancelshield:"取消屏蔽",
        isShow:true,
        isShow1:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.setData({
        userId: options.userId
      })
      this.getUserInfo()
      this.getData()
    },
    // 获取用户详情
    getUserInfo: function() {
        var details = this;
        wx.showLoading({
          title: '正在加载',
        })
        wx.request({
            url: globalUrls.baseUrl + globalUrls.userInfo + details.data.userId,
            method: 'GET',
            //请求头
            header: {
                Authorization: globalUrls.authorization
            },
            success: function(res) {
              var data = res.data.data
              console.log(data)
              // 头像显示
              let img = data.avatar
              let avatar=""
              var imgtype = img.toLowerCase().split('.');
              if ((imgtype[1]) == "tiff" || (imgtype[1]) == "png" || (imgtype[1]) == "jpeg" || (imgtype[1]) == "bmp" || (imgtype[1]) == "jpg" || (imgtype[1]) == "tga") {
                avatar = imgUrl + img
              } else {
                avatar = aliImg +"no_login.png"
              }
              
              data.avatar = avatar
              console.log(data.avatar)
              // 性别
              let sex=data.sex
              if(sex==1){
                sex="男"
              }else{
                sex="女"
              }
              data.sex=sex

              // 关注
              let isFollow1 = data.isFollow
              if (isFollow1 == 1) {
                isFollow1 = "取消关注"
              }else{
                isFollow1 = "+ 关注"
              }
              data.isFollow1 = isFollow1

              // 图片部分
              let pics = data.photos
              let photo = pics.split(',')
              let photos = []
              for (var i = 0; i < photo.length; i++) {
                if (photo[i].length>0){
                  photos.push(imgUrl + photo[i])
                }else{
                  photos.push(aliImg + "ic_def.png") 
                }
              }
              data.photos = photos

              details.setData({
                  userInfo: data
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
    //图片点击事件
    imgYu:function(event){
      var src = event.currentTarget.dataset.src;//获取data-src
      var imgList = event.currentTarget.dataset.list;//获取data-list
      //图片预览
      wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
      })
    },
    // tab栏切换
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
      if (currentIndex == 0) {
        this.getData()
      } else if (currentIndex == 1) {
        this.getGoods()
      } 
    },
    // 获取发布的信息数据
    getData: function () {
      let that = this;
      wx.showLoading({
        title: '正在加载',
      })
      let userId = that.data.userId
      var pageIndex = that.data.current;
      if (pageIndex == 1 || pageIndex == undefined) {
        that.data.newRecords = []
        that.data.current = 1
        pageIndex = 1
      }
      wx.request({
        url: globalUrls.baseUrl + '/information/information/otherList',
        method: 'GET',
        data: {
          current: pageIndex,
          size: 10,
          type: "now",
          userId: userId
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
    // 获取发布的商品数据
    getGoods: function (e) {
      let that = this;
      wx.showLoading({
        title: '正在加载',
      })

      var pageIndex = that.data.current;
      let userId = that.data.userId
      if (pageIndex == 1 || pageIndex == undefined) {
        that.data.newRecords = []
        that.data.current = 1
        pageIndex = 1
      }
      wx.request({
        url: globalUrls.baseUrl + '/product/product/pageOtherShop',
        method: 'GET',
        data: {
          current: pageIndex,
          size: 10,
          status: "1",
          userId: userId
        },
        header: {
          Authorization: globalUrls.authorization
        }, // 设置请求的 header
        success: function (res) {
          // 关闭下来刷新
          wx.stopPullDownRefresh()
          let records = res.data.data.records
          console.log(records)
          that.data.pages = res.data.data.pages
          for (var i = 0; i < records.length; i++) {
            records[i].isData = true

            // 修改时间
            var createTime = records[i].createTime
            createTime = createTime.substring(0, 16)
            records[i].createTime = createTime

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
                console.log(productImages)
              } else {
                productImages = ''
              }
            }
            records[i].productImages = productImages

            let jiage = records[i].price
            let price = "￥" + jiage
            records[i].price = price

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
    cancelFollow: function (e) {
      console.log(e)
      let that = this;
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
                that.getUserInfo()
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
                that.getUserInfo()
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

    // 屏蔽
    shield: function (e) {
      console.log(e)
      let that = this;
      let pbUserId = e.currentTarget.dataset.pbuserid
      wx.showModal({
        title: '提示',
        content: '您确定屏蔽？',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后    
            wx.request({
              url: globalUrls.baseUrl + '/user/shield/add',
              data: {
                pbUserId: pbUserId
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                Authorization: globalUrls.authorization,
                "Content-Type": "application/x-www-form-urlencoded"
              }, // 设置请求的 header
              success: function (res) {
                console.log("11", res)
                wx.showToast({
                  title: '屏蔽成功',
                  icon: 'none',
                  duration: 1000
                })

                that.data.isShow = false
                that.data.isShow1 = true
                that.setData({
                  isShow: that.data.isShow,
                  isShow1: that.data.isShow1
                })
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
    // 取消屏蔽
    cancelshield:function(e){
      console.log(e)
      let that = this;
      let pbUserId = e.currentTarget.dataset.pbuserid
      wx.showModal({
        title: '提示',
        content: '您确定取消屏蔽？',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后    
            wx.request({
              url: globalUrls.baseUrl + '/user/shield/delete',
              data: {
                pbUserId: pbUserId
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                Authorization: globalUrls.authorization
              }, // 设置请求的 header
              success: function (res) {
                console.log("11", res)
                wx.showToast({
                  title: '取消屏蔽成功',
                  icon: 'none',
                  duration: 1000
                })
                that.data.isShow=true
                that.data.isShow1 = false
                that.setData({
                  isShow: that.data.isShow,
                  isShow1: that.data.isShow1
                })
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
  //进入信息详情
  didSelectedCell: function (e) {
    var that = this
    let infoDesc = e.currentTarget.dataset.infodesc
    if (infoDesc == "") {
      let infoId = e.currentTarget.dataset.infoid
      let infoTitle = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/infoDetail/infoDetail?infoId=' + infoId + '&infoTitle',
      })
    } else {
      let bdcId = e.currentTarget.dataset.infoid
      let infoTitle = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/broadcastDetail/broadcastDetail?bdcTitle=' + bdcTitle + '&bdcId=' + bdcId,
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

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
      if (this.data.currentIndex == 0) {
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
          that.getGoods(curpage + 1)
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
    onShareAppMessage: function() {

    }
})