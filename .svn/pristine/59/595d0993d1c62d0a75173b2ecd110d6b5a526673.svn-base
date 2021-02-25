// pages/group/group.js
import TIM from 'tim-wx-sdk';

import {
  globalUrls
} from "../../utils/global.js"
import WxNotificationCenter from '../../utils/WxNotificationCenter.js';

var message = require('../../utils/message.js')
var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
let aliImg = globalUrls.aliImg,
  imgUrl = globalUrls.imgUrl;
var that, conversationID, tim, longitude = "",
  latitude = "",
  uSig, imSuc;
var currentPage = 1 //初始化当前页面

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    tempindex: 0,
    array: [],
    head: '/images/no_login.png',
    group: '/images/group_icon_conversa.png',
    audioImg: aliImg + "iv_plau.png",
    audioImg1: aliImg + "ic_paush.png",
    shop: aliImg + "ic_shop_certifi.png",
    shuji: aliImg + "ic_sheik_certifi.png",
    gift: aliImg + "ic_27.png",
    records: [{
      isData: true,
    }], // 列表显示的数据源
    pages: 1, // 总页数
    current: 1, // 当前页数  默认是1
    hasmore: true,
    hasempty: false,
    hasNextPage: true,
    longitude: '',
    latitude: '',
    keyWord: "", //初始化输入框内容
    recordsData: []

  },
  changeTab: function (e) {
    var currentIndex = e.currentTarget.dataset.index;
    console.log("changeTab=>" + currentIndex);
    this.setData({
      currentIndex: currentIndex,
      hasempty: false,
    })
    if (that.data.currentIndex == 0) {
      that.getConversationList();
    } else {
      currentPage = 1;

      console.log("下拉")
      this.data.current = 1
      this.setData({
        hasNextPage: true,
        current: 1
      })
      that.getMyFollow();

    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    tim = global.userInfo.txIm;

    uSig = wx.getStorageSync('userSig');
    imSuc = wx.getStorageSync('imLoginSuccess');
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
      // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
      // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
      var array = event.data; // - 存储 Conversation 对象的数组 - [Conversation]
      that.setData({
        array: array,
        hasempty: array.length == 0,
        hasmore: array.length == 0,
      });

      console.log("会话列表更新通知 TIM.EVENT.MESSAGE_REVOKED ==>" + that.data.array.length);
    });

    if (uSig && uSig.length > 0 && imSuc && imSuc.length > 0) {
      message.updateMyProfile(global.userInfo.txIm, global.userInfo, (userinfo) => {
        console.log("imLogin 更新资料成功=>" + JSON.stringify(userinfo));
      });
    }

  },
  // 搜索事件
  btnSearch: function (e) {
    currentPage = 1

    this.setData({
      keyWord: e.detail.value
    })
    if (this.data.currentIndex == 0) {
      this.getConversationList(); //会话列表
    } else {
      this.getMyFollow(); //筛选关注的人发的消息
    }
  },
  /* 获取会话列表*/
  getConversationList: function () {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    message.getConversationList(tim, (array) => {
      var unreadCounts = 0 //未读计数
      var nameArray = []
      var isName = 0
      that.setData({
        array: array,
        hasempty: array.length == 0,
        hasmore: array.length == 0,
      });
      // 根据名字搜索
      if (that.data.keyWord) {
        for (let index = 0; index < that.data.array.length; index++) {
          if (that.data.array[index].type == "C2C") {
            if (that.data.array[index].userProfile.nick == that.data.keyWord) {
              nameArray[isName] = that.data.array[index]
              isName += 1
            }
          }
          if (that.data.array[index].type == "GROUP") {
            if (that.data.array[index].groupProfile.name == that.data.keyWord) {
              nameArray[isName] = that.data.array[index]
              isName += 1
            }
          }
          console.log("Sunny", nameArray)
          // 未读计数
          unreadCounts += that.data.array[index].unreadCount
          console.log("Sunny", unreadCounts)

          if (isName != 0) {
            that.setData({
              array: nameArray,
            });
          }
        }
      }
      if (unreadCounts == 0) {
        wx.removeTabBarBadge({ //这个方法为移除当前tabbar右上角的文本
          index: 2, //代表哪个tabbar（从0开始）
        })
      } else {
        // 根据count的状态判断红点显示与否
        wx.setTabBarBadge({ //这个方法的意思是，为小程序某一项的tabbar右上角添加文本
          index: 2, //代表哪个tabbar（从0开始）
          text: unreadCounts.toString() //显示的内容
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
      console.log("拿到会话列表=>" + JSON.stringify(array));
    });
  },
  //touch start
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
    //console.log(" startTime = " + e.timeStamp);  
  },

  //touch end
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
    //console.log(" endTime = " + e.timeStamp);  
  },

  handleClick: function (e) {
    //console.log("endTime - startTime = " + (this.endTime - this.startTime));    
    if (this.endTime - this.startTime < 350) {
      console.log("点击");
    }
  },

  handleLongPress: function (e) {
    //console.log("endTime - startTime = " + (this.endTime - this.startTime));
    console.log("长按");
    var conver = JSON.stringify(that.data.array[e.currentTarget.id]);

    wx.showModal({
      title: '提示',
      content: '确认删除当前会话？',
      success(res) {
        if (res.confirm) {
          let promise = tim.deleteConversation(JSON.parse(conver).conversationID);
          promise.then(function (imResponse) {
            //删除成功。
            const {
              conversationID
            } = imResponse.data; // 被删除的会话 ID。
          }).catch(function (imError) {
            console.warn('deleteConversation error:', imError); // 删除会话失败的相关信息
          });
        } else if (res.cancel) {

        }
      }
    })
  },
  goChat: function (e) {
    var conver = JSON.stringify(that.data.array[e.currentTarget.id]);

    if (this.endTime - this.startTime < 350) { //去聊天
      console.log("坐标:" + e.currentTarget.id + ",会话Conver:" + conver);
      wx.navigateTo({
        url: '../chat/chat?conver=' + encodeURIComponent(conver),
        success: function (res) {
          console.log("成功回调", res);
        },
        fail: function (res) {
          console.log("失败回调", res);
        }
      })
    } else {


    }

  },
  /** 获取关注列表 */
  getMyFollow: function () {
    let that = this;
    var type = that.data.type;
    console.log(currentPage)

    wx.request({
      url: globalUrls.baseUrl + globalUrls.myFollow,
      method: 'GET',
      header: {
        Authorization: globalUrls.authorization
      },
      data: {
        current: currentPage,
        size: 10,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude"),
        infoTitle: that.data.keyWord.toString(),
      },
      success: function (res) {
        // 关闭下来刷新
        wx.stopPullDownRefresh()
        var self = this;


        var records = res.data.data.records

        console.log(records)
        that.data.pages = res.data.data.pages
        // 修改时间
        for (var i = 0; i < records.length; i++) {
          records[i].isData = true
          // 计算时间差
          records.forEach(item => {
            item.createTime = util.getDateWithTime(item.createTime)
            if (util.getTimeDistance(item.expireTime) == '已结束' || util.getTimeDistance(item.expireTime) == '马上结束') {
              item.msg = util.getTimeDistance(item.expireTime)
            } else {
              item.msg = '距离结束还有' + util.getTimeDistance(item.expireTime)
            }
          })
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
        }
        var array = res.data.data.current == 1 ? records : that.data.recordsData.concat(records)
        that.setData({
          recordsData: res.data.data.current == 1 ? records : that.data.recordsData.concat(records),
          hasempty: array.length == 0,
          hasmore: records.length == 10,
        })
      },
      fail: function (err) {
        console.log("关注 fail" + err)
      }
    })
  },

  //进入信息详情
  didSelectedCell: function (e) {
    var that = this
    console.log(e)
    let type = e.currentTarget.dataset.type
    var infoId = e.currentTarget.dataset.infoid
    var infoTitle = e.currentTarget.dataset.title
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
    }
    else if (type == "product") {
      wx.navigateTo({
        url: '/pages/marketDeatil/marketD?productId=' + infoId + '&tvTitle=' + infoTitle,
      })
    }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 首先判断当前是否有用户登录
    let loginflag = false
    loginflag = util.checkIsLogin()
    if (!loginflag) {
      wx.showModal({
        title: '提示',
        content: '现在去登录吗？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
              success: s => {
                wx.setStorageSync("group", "group")
              }
            })
          } else if (res.cancel) {
            console.log("返回上一页")
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      if (!uSig && uSig.length == 0 || !imSuc && imSuc.length == 0) {
        util.imLogin(tim, callback => {
          wx.showToast({
            title: 'imLogSuc_group',
            success: s => {
              that.getConversationList();
            }
          })
        });

      } else {
        that.getConversationList();
      }
    }
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
    currentPage = 1
    this.setData({
      recordsData: []
    })
    if (that.data.currentIndex == 0) {
      that.getConversationList();
    } else {
      that.getMyFollow();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    currentPage++

    if (that.data.currentIndex == 0) {
      that.getConversationList();
    } else {
      that.getMyFollow()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})