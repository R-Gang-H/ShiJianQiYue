//index.js
//获取应用实例
import TIM from 'tim-wx-sdk';
import {
  globalUrls
} from "../../utils/global.js"

const app = getApp()
var util = require('../../utils/util.js')
var global = require('../../utils/global.js')
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");


var page = 1;

Page({
  data: {
    banners: [],
    buttons: [],
    buttons: [{
      buttonName: '粮油',
      buttonImage: ''
    },
    {
      buttonName: '果蔬',
      buttonImage: ''
    },
    {
      buttonName: '家禽',
      buttonImage: ''
    },
    {
      buttonName: '农业观光',
      buttonImage: ''
    },
    {
      buttonName: '三农服务',
      buttonImage: ''
    }

    ],
    threeButtons: [{
      buttonName: '第一书记',
      buttonImage: '../../images/home_sj_btn.png'
    },
    {
      buttonName: '契约红包',
      buttonImage: '../../images/home_hb_btn.png'
    },
    {
      buttonName: '绿色广播',
      buttonImage: '../../images/home_gb_btn.png'
    }


    ],
    longitude: '',
    latitude: '',
    city: '北京市',
  },
  //获取轮播图数据
  loadBanners: function () {
    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.banners,
      method: 'GET',
      header: {
        Authorization: 'Basic cGlnOnBpZw=='
      },
      success: function (res) {
        var data = res.data.data
        self.setData({
          banners: data.records
        })
        console.log(data)
      },
      fail: function (res) {
        console.log(res.errMsg);
      }

    })

  },
  //获取分类列表
  getButtonTitles: function () {
    var self = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.homeCategories,
      method: 'GET',
      header: {
        Authorization: 'Basic cGlnOnBpZw=='
      },
      data: {
        commonType: 'info_type',
        commonStatus: '1'

      },
      success: function (res) {
        var data = res.data.data
        global.userInfo.categories = data.records
        self.setData({
          buttons: data.records
        })
      },
      fail: function (err) {

      }
    })
  },

  //获取首页信息列表
  getHomeMessages: function () {

    var self = this;
    console.log('请求时的header=' + globalUrls.authorization)
    wx.request({
      url: globalUrls.baseUrl + globalUrls.homeMessages,
      method: 'GET',
      data: {
        orderBy: 'createTime',
        size: '20',
        current: page,
        latitude: self.data.latitude,
        longitude: self.data.longitude
      },
      header: {
        Authorization: globalUrls.authorization
      },
      success: function (res) {

        if (util.checkRequestSuccess(res)) {
          let data = res.data.data
          let records = data.records;
          console.log(data)
          //关闭下拉刷新
          wx.stopPullDownRefresh()

          records.forEach(item => {
            //遍历修改图片的值.
            item.infoImages = item.infoImages.split(',')[0]
            item.createTime = util.getDateWithTime(item.createTime)
            if (util.getTimeDistance(item.expireTime) == '已结束' || util.getTimeDistance(item.expireTime) == '马上结束') {
              item.customTime = util.getTimeDistance(item.expireTime)

            } else {
              item.customTime = '距离结束还有' + util.getTimeDistance(item.expireTime)
            }
            item.juli = util.tranformDistance(item.juli)

          })
          data.records = records
          self.setData({
            messages: data.current == 1 ? records : self.data.messages.concat(records)
          })
        }

      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },

  //事件处理函数
  onLoad: function () {
    var self = this

    //选择城市通知
    WxNotificationCenter.addNotification("selectCity", self.selectCityNotification, self)
    //注册通知. 登录完成后会自动调用
    WxNotificationCenter.addNotification("loginNotification", self.refresh, self)
    WxNotificationCenter.addNotification("infoRefreshNotification", self.refresh, self)


    //已登录账号获取个人信息

    if (util.checkIsLogin()) {
      self.getUserInfo()
    }

    wx.getStorage({
      key: 'access_token',
      success: function (res) {

        console.log('取到了')
        console.log(res)
      },
    })
    this.setData({

      messages: [

      ]

    })

    //模拟登陆数据
    app.userInfo = {
      userId: '12',
      userName: '2',

    }
    //获取一下下轮播图图
    this.loadBanners()
    this.getButtonTitles()

    //获取一下位置奥
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        self.data.messages = []
        self.data.longitude = res.longitude + 0.006256;
        self.data.latitude = res.latitude + 0.001276;
        self.getHomeMessages()
        self.ReGeo()
      },
      fail: function (err) {
        console.log('地理位置获取失败')
        console.log(err)
      }
    })

    // 检测是否被踢线下
    self.kickedOut();
  },
  kickedOut() {
    let tim = global.userInfo.txIm;
    tim.on(TIM.EVENT.KICKED_OUT, function (event) {
      // 收到被踢下线通知
      // event.name - TIM.EVENT.KICKED_OUT
      // event.data.type - 被踢下线的原因，例如:
      //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
      //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
      //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
      console.log("收到被踢下线通知 TIM.EVENT.KICKED_OUT");
      wx.showToast({
        title: '被踢下线',
        duration: 2000,
        success(res) {
          setTimeout(function () {
            util.logout();
          }, 2000);
        }
      })
    });
  },

  //点击5个小按钮的其中一个哟
  fiveButtonDidClicked: function (sender) {
    var self = this
    var model = JSON.stringify({
      title: sender.currentTarget.dataset.title,
      infoType: sender.currentTarget.dataset.infotype,
      longitude: self.data.longitude,
      latitude: self.data.latitude
    })

    console.log(sender)
    wx.navigateTo({

      url: '/pages/homeSearch/homeSearch?title=' + sender.currentTarget.dataset.title + '&infoType=' + sender.currentTarget.dataset.infotype + '&longitude=' + self.data.longitude + '&latitude=' + self.data.latitude
    })
  },

  searchBarDidSearch: function () {

    var self = this
    var model = JSON.stringify({
      title: '搜索',
      longitude: self.data.longitude,
      latitude: self.data.latitude
    })

    wx.navigateTo({

      url: '/pages/homeSearch/homeSearch?title=搜索' + '&longitude=' + self.data.longitude + '&latitude=' + self.data.latitude,
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    page = 1
    this.setData({
      messages: []

    })
    this.getHomeMessages()

  },

  //上拉加载了奥!
  onReachBottom: function () {
    page++
    this.getHomeMessages()
  },

  // 第一书记 && 契约红包 &&绿色广播点击事件
  threeButtonOnClicked: function (sender) {
    var self = this
    var model = JSON.stringify({
      longitude: self.data.longitude,
      latitude: self.data.latitude
    })
    let str = 'latitude=' + self.data.latitude + '&longitude=' + self.data.longitude
    if (sender.currentTarget.dataset.buttonname == '第一书记') {
      console.log('跳转第一书记信息列表')

      wx.navigateTo({
        url: '/pages/shield/shield?' + str,
      })
      return;

    }
    if (sender.currentTarget.dataset.buttonname == '契约红包') {
      console.log('跳转红包列表');
      // 判断是否绑定信息通知事件
      wx.getStorageSync("isBindMsg") ? '' : self.goBind()
      wx.navigateTo({
        url: '/pages/redPacket/redPacket?' + str,
      })
      return;
    }
    // 判断是否绑定信息通知事件
    wx.getStorageSync("isBindMsg") ? '' : self.goBind()
    //跳转绿色广播列表
    wx.navigateTo({
      url: '/pages/broadcast/broadcast?' + str,
    })
  },
  //进入详情
  didSelectedCell: function (sender) {
    var self = this
    var model = JSON.stringify({
      infoId: sender.currentTarget.dataset.infoid,
      infoTitle: sender.currentTarget.dataset.title,
      longitude: self.data.longitude,
      latitude: self.data.latitude
    })
    // 判断是否绑定信息通知事件
    wx.getStorageSync("isBindMsg") ? '' : self.goBind()
    wx.navigateTo({
      url: '/pages/infoDetail/infoDetail?infoTitle=' + sender.currentTarget.dataset.title + '&infoId=' + sender.currentTarget.dataset.infoid,
    })
  },



  //获取个人信息
  getUserInfo: function () {

    var self = this
    wx.request({
      url: globalUrls.baseUrl + globalUrls.getUserInfo,
      method: 'GET',
      header: {
        Authorization: globalUrls.authorization
      },
      success: function (res) {
        console.log(res);
        if (util.checkRequestSuccess(res)) {
          //网络请求成功 
          var data = res.data.data
          util.updateUserInfo(data)

        }

      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      },
    })


  },

  //登录或者退出登录的刷新事件
  refresh: function () {
    var self = this

    page = 1
    self.setData({
      messages: []

    })
    self.getHomeMessages()
    if (util.checkIsLogin()) {
      self.getUserInfo()
    }
  },

  /**
   * 跳转选择城市
   */
  goSelectCity: function () {

    wx.navigateTo({
      url: '/pages/selectCity/selectCity?city=' + this.data.city,
    })

  },

  /**
   * 选择完城市的回调
   */
  selectCityNotification: function (notification) {
    console.log('选择完城市')
    console.log(notification)
    this.GeoWithCityName(notification)
  },

  /**
   * 地理编码
   */
  GeoWithCityName: function (cityName) {
    var self = this
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/geo',
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      data: {
        key: '951e199bdaa15a1fe91ecd2a8dc04895',
        address: cityName,
        city: cityName,

      },
      success: function (res) {
        console.log(res)
        if (res.data.count > 0) {
          var geocode = res.data.geocodes[0]
          var locationArr = geocode.location.split(',')
          var latitude = ''
          var longitude = ''
          latitude = locationArr[1];
          longitude = locationArr[0];
          // 经纬度存到本地
          wx.setStorageSync('latitude', latitude)
          wx.setStorageSync('longitude', longitude)
          self.setData({
            city: cityName,
            longitude: longitude,
            latitude: latitude,
            messages: [],
          })
        }

        page = 1;
        self.getHomeMessages()


      },

      fail: function (err) {
        console.log(err);
      }
    })
  },


  /**
   * 逆地理编码
   */
  ReGeo: function () {

    var self = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '951e199bdaa15a1fe91ecd2a8dc04895',
        location: self.data.longitude + "," + self.data.latitude,

      },
      success: function (res) {
        self.setData({

          city: res.data.regeocode.addressComponent.city.length == 0 ? res.data.regeocode.addressComponent.province : res.data.regeocode.addressComponent.city

        })
      },
      fail: function (res) {

      }
    })
  },
  goBind: function () {
    // 登录成功后绑定订阅事件  收益到账提醒  提现到账提醒
    wx.requestSubscribeMessage({
      tmplIds: ['HHWJWjOuUS7s5ffC527s189I6UD-fB7HHFZ7ZNGBSGg', 'Wz3UDlDe_wIggDey8xpKvNGExDSeE8KIjrIVqr0cDcI'],
      success(res) {
        wx.setStorageSync('isBindMsg', true)
      }
    })
  },
  // 进入图片详情页
  intoImgDetails: function (event) {
    wx.navigateTo({
      url: '/pages/imgDetails/imgDetails?title=' +event.currentTarget.dataset.title + '&url=' + event.currentTarget.dataset.url
    })
  },

})