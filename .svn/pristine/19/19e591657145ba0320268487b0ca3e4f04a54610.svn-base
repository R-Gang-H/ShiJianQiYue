import {
  globalUrls
} from "../utils/global.js"
var global = require("../utils/global.js");
var WxNotificationCenter = require("../utils/WxNotificationCenter.js");

/**
 * 日期转时间戳
 * date:传入日期
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，Y/M/D h:m:s
 */
function getDateTime(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

/**
 * 
 * 根据天数间隔获取时间,传入时间, 返回传入的时间和当前时间对比后的数值
 */
function getDateWithTime(time) {
  //当前时间的时间戳
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;

  var arr = time.split(/[- :]/);
  let nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  time = Date.parse(nndate)
  //传入时间转换成时间戳
  time = new Date(time).getTime() / 1000
  //时间间隔  
  var timeInterval = timestamp - time;
  if (timeInterval <= 60) {
    return '刚刚'
  }
  if (timeInterval <= 60 * 60) {

    //一小时以内
    var minutes = timeInterval / 60;
    return parseInt(minutes) + '分钟前'
  }

  //传入的日期
  var newTime = time * 1000
  var dateTime = new Date(newTime)
  //当前日期
  var newTimeStamp = timestamp * 1000;
  var currentDate = new Date(newTimeStamp)

  if (timeInterval <= 60 * 60 * 24) {
    //两天内的

    //传入的日期年月日
    var dateTimeYearMonthDay = dateTime.getFullYear() + '-' + dateTime.getMonth() + '-' + dateTime.getDay()

    //当前的日期年月日
    var currentTimeYearMonthDay = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDay()

    if (dateTimeYearMonthDay == currentTimeYearMonthDay) {

      //同一天
      var h = dateTime.getHours();
      //分  
      var m = dateTime.getMinutes();
      return h + ':' + m;


    } else {
      return '昨天'
    }

  } else {

    //判断是否是同一年
    var Y = dateTime.getFullYear()
    var M = (dateTime.getMonth() + 1 < 10 ? '0' + (dateTime.getMonth() + 1) : dateTime.getMonth() + 1);
    //日  
    var D = dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
    var currentY = currentDate.getFullYear()
    if (Y == currentY) {
      //同一年

      return M + '-' + D
    } else {
      //不是同一年
      return Y + '-' + M + '-' + D
    }
  }
}
/**
 * 
 * 根据传入时间判断还有多久结束
 */
function getTimeDistance(time) {
  //当前时间的时间戳
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  //传入时间转换成时间戳

  //必须处理,不然iOS显示有问题. 这是一个坑.
  var arr = time.split(/[- :]/);
  let nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
  time = Date.parse(nndate)
  time = new Date(time).getTime() / 1000

  //时间间隔  
  var timeInterval = time - timestamp;
  if (timeInterval < 0) {
    return '已结束'
  }

  if (timeInterval < 60 * 60 * 24) {
    //小于一天

    return '马上结束'

  }
  //传入的日期
  var newTime = time * 1000
  var dateTime = new Date(newTime)
  //当前日期
  var newTimeStamp = timestamp * 1000;
  var currentDate = new Date(newTimeStamp)

  //传入的日期年月日
  var dateTimeYearMonthDay = dateTime.getFullYear() + '-' + dateTime.getMonth() + '-' + dateTime.getDay()

  //当前的日期年月日
  var currentTimeYearMonthDay = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDay()

  if (timeInterval >= 60 * 60 * 24) {
    //大于一天

    if (dateTimeYearMonthDay == currentTimeYearMonthDay) {
      //同一天
      //计算有几小时
      var numberOfHours = timeInterval / (60 * 60)
      return parseInt(numberOfHours) + '小时';
    }
    var numberOfDays = timeInterval / (60 * 60 * 24)
    return parseInt(numberOfDays) + '天'
  }
}

function tranformDistance(juli) {
  //不足1km
  if (juli < 1) {
    //小于100m
    if (juli < 0.1) {
      return '<100m'
    }
    return juli * 1000 + 'm'

  }
  //大于1km 并且小于100km
  if (juli > 1 && juli < 100) {
    return parseFloat(juli).toFixed(1) + 'km';
  }
  return parseFloat(juli).toFixed(0) + 'km';
}

/**
 *特殊写法:比较数组date日期
 */
function compare() {
  return function (a, b) {
    var value1 = a.time;
    var value2 = b.time;
    return value1 - value2; // 正序
  }
}


//判断网络请求是否成功
function checkRequestSuccess(res) {
  //code为1说明失败

  if (res.data.code == 1) {
    //失败
    wx.showToast({
      title: res.data.msg,
    })

    if (res.data.msg == "invalid_token") {
      //登录失效 
      console.log("登录失效")
      logout()
    }
    return false
  }
  return true
}

/**
 * 登录接口调用成功后
 * res:接口返回值
 */
function loginSuccess(res) {
  //把access存入缓存
  goLogin()
  wx.setStorageSync('access_token', res.data.access_token)
  globalUrls.authorization = wx.getStorageSync("access_token") ? "Bearer" + " " + wx.getStorageSync("access_token") : "Basic cGlnOnBpZw=="
  global.userInfo.isLogin = true
  wx.setStorageSync('isLogin', true)
  wx.setStorageSync('userId', res.data.user_id)
}
function goLogin() {
  //  去登录微信 绑定用户token
  // 微信登录
  wx.login({
    success(res) {
      if (res.code) {
        //发起网络请求  绑定code  后台获取用户oppenID
        wx.request({
          url: globalUrls.baseUrl + globalUrls.getOpenID,
          method: 'GET',
          header: { //请求头
            Authorization: globalUrls.authorization
          },
          data: {
            code: res.code
          },
          success: function (res) {
            var data = res.data
          },
          fail: function (err) {
            console.log(err.errMsg)
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}
/**
 * 退出登录
 */
function logout() {
  global.userInfo.isLogin = false
  wx.setStorageSync('isLogin', false)
  wx.setStorageSync('userId', '')
  wx.setStorageSync('access_token', '')
  globalUrls.authorization = "Basic cGlnOnBpZw=="
  WxNotificationCenter.postNotificationName('loginNotification')
  wx.switchTab({
    url: '/pages/index/index'
  })
  imLoginOut(callback => {
    
  });
}

/**
 * 更新个人信息
 * data: 个人信息对象
 */
function updateUserInfo(data) {
  global.userInfo.userId = data.userId;
  global.userInfo.avatar = data.avatar;
  global.userInfo.birthday = data.birthday;
  global.userInfo.createTime = data.createTime;
  global.userInfo.intro = data.intro;
  global.userInfo.mobile = data.mobile;
  global.userInfo.name = data.name;
  global.userInfo.role = data.role;
  global.userInfo.userId = data.userId;

  global.userInfo.avatarIm = globalUrls.imgUrl + global.userInfo.avatar;
}


/**
 * 判断是否登录了
 */
function checkIsLogin() {

  if (global.userInfo.isLogin) {
    //已登录
    return true
  } else {
    return false

  }
}

// 获取IM UserSig
function getUserSig() {
  //获取Im UserSig
  wx.request({
    url: globalUrls.baseUrl + globalUrls.imUserSig,
    method: 'GET',
    header: {
      Authorization: globalUrls.authorization
    },
    success: function (res) {
      console.log(res);
      if (checkRequestSuccess(res)) {
        //网络请求成功 
        var data = res.data.data
        wx.setStorageSync('userSig', data)
        imLogin(global.userInfo.txIm, callback => {

          //网络请求成功
          wx.showToast({
            title: '登录成功',
            success: s => {
              if (wx.getStorageSync("group") != '') {
                wx.switchTab({
                  url: '/pages/index/index',
                })
              } else {
                wx.navigateBack({

                })
              }

              global.userInfo.avatar = globalUrls.imgUrl + global.userInfo.avatar;
              message.updateMyProfile(global.userInfo.txIm, global.userInfo, (userinfo) => {
                console.log("imLogin 更新资料成功=>" + JSON.stringify(userinfo));
              });

            }
          })
        });
      }
    },
    fail: function (err) {
      wx.showToast({
        title: err.errMsg,
      })
    },
  })
}

/** 登录 */
function imLogin(tim, callback) {
  var userId = wx.getStorageSync('userId').toString()
  var userSig = wx.getStorageSync('userSig')

  let promise = tim.login({
    userID: userId,
    userSig: userSig,
  });
  promise.then(function (imResponse) {
    callback();
    console.log('login success:' + JSON.stringify(imResponse.data)); // 登录成功
    wx.setStorageSync('imLoginSuccess', JSON.stringify(imResponse.data));
  }).catch(function (imError) {
    switch (imError.code) {
      case 70001: //UserSig 已过期
      case 70003: //UserSig 非法
      case 70005: //UserSig 非法
        getUserSig();
        break;
    }
    console.warn('login error:', imError); // 登录失败的相关信息
  });
}

/** 登出 */
function imLoginOut(callback) {
  var tim = global.userInfo.txIm
  let promise = tim.logout();
  promise.then(function (imResponse) {
    console.log(imResponse.data); // 登出成功
    callback();
  }).catch(function (imError) {
    console.warn('logout error:', imError);
  });
}

/**
 * 检查个人信息
 */
function checkUserInfo() {
  //获取个人信息
  wx.request({
    url: globalUrls.baseUrl + globalUrls.getUserInfo,
    method: 'GET',
    header: {
      Authorization: globalUrls.authorization
    },
    success: function (res) {
      console.log(res);
      if (checkRequestSuccess(res)) {
        //网络请求成功 
        var data = res.data.data
        updateUserInfo(data)
        if (!data.role) {
          //说明没身份, 需要选择身份和完善个人信息
          //选择身份普通人
          wx.request({
            url: globalUrls.baseUrl + globalUrls.selectRole,
            method: 'GET',
            header: {
              Authorization: globalUrls.authorization
            },
            data: {
              roleId: 4,
            },
            success: function () {
              console.log('选择身份成功')
            },
            fail: function () {
              console.log('选择身份失败')
            }
          })
          wx.redirectTo({
            url: '/pages/setUserInfo/setUserInfo',
          })

        } else {
          //有身份, 直接返回到首页并且刷新数据
          // 发送通知 告诉其他注册通知的界面刷新数据
          WxNotificationCenter.postNotificationName('loginNotification')
        }

      }

    },
    fail: function (err) {
      wx.showToast({
        title: err.errMsg,
      })
    },
  })
}

module.exports = {
  formatTime: formatTime,
  getDateTime: getDateTime,
  getDateWithTime: getDateWithTime,
  getTimeDistance: getTimeDistance,
  tranformDistance: tranformDistance,
  checkRequestSuccess: checkRequestSuccess,
  loginSuccess: loginSuccess,
  updateUserInfo: updateUserInfo,
  checkIsLogin: checkIsLogin,
  checkUserInfo: checkUserInfo,
  getUserSig: getUserSig,
  imLogin: imLogin,
  imLoginOut: imLoginOut,
  logout: logout,
  compare: compare,
}