import TIM from 'tim-wx-sdk';

import {
  globalUrls
} from "../../utils/global.js"

var message = require('../../utils/message.js')
var util = require('../../utils/util.js');
var global = require('../../utils/global.js')
var recorder = wx.getRecorderManager(); // 录音
const innerAudioContext = wx.createInnerAudioContext() //获取播放对象

var isClick = true;
var that, tim, conversationID;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
    nextReqMessageID: "",
    head: '/images/no_login.png',
    custom: '/images/ic_custom_msg_rect.png',
    avatarH: globalUrls.imgUrl,
    bottomHeight: 100,
    hasempty: false,

    isFace: true,//当前是否选择的是表情
    isShow: true, //控制emoji表情是否显示
    emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a", "60b", "60c", "60d", "60f",
      "61b", "61d", "61e", "61f",
      "62a", "62c", "62e",
      "602", "603", "605", "606", "608",
      "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
      "63a", "63b", "63c", "63d", "63e", "63f",
      "64a", "64b", "64f", "681",
      "68a", "68b", "68c",
      "344", "345", "346", "347", "348", "349", "351", "352", "353",
      "414", "415", "416",
      "466", "467", "468", "469", "470", "471", "472", "473",
      "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
    ],
    emojis: [], //qq、微信原始表情
  },
  onLoad: function (options) {
    that = this;
    tim = global.userInfo.txIm;

    let title;
    var conver = decodeURIComponent(options.conver);
    if (conver != 'undefined') {

      var conversa = JSON.parse(conver);
      that.setData({
        conver: conver,
        conversationID: conversa.conversationID,
        imId: conversa.type == "C2C" ? conversa.userProfile.userID : conversa.groupProfile.groupID,
        imType: conversa.type,
        isGroup: conversa.type == "GROUP",
      })
      console.log('单个会话信息:' + that.data.conver);

      title = conversa.type == "C2C" ? conversa.userProfile.nick : conversa.groupProfile.name + "(" + wx.getStorageSync(conversa.groupProfile.groupID) + ")"

    }

    var model = decodeURIComponent(options.model);

    if (model != 'undefined') {

      var models = JSON.parse(model);
      that.setData({
        models: models,
        conversationID: options.msgType == 0 ? 'C2C' + models.userId : 'GROUP' + models.imGroupId,
        imId: options.msgType == 0 ? String(models.userId) : models.imGroupId,
        imType: options.msgType == 0 ? 'C2C' : 'GROUP',
        isGroup: options.msgType == 1,
      })
      console.log('信息详情:' + that.data.models);

      title = models.userName;
    }

    var shapDetial = decodeURIComponent(options.shapDetial);
    if (shapDetial != 'undefined') {

      var shapDetial = JSON.parse(shapDetial);
      that.setData({
        shapDetial: shapDetial,
        conversationID: 'C2C' + shapDetial.userId,
        imId: String(shapDetial.userId),
        imType: 'C2C',
        isGroup: false,
      })
      console.log('商品详情:' + that.data.shapDetial);

      title = shapDetial.shopName;
    }

    wx.setNavigationBarTitle({
      // 其他页面传过来的标题名
      title: title,
    })


    tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
      // event.name - TIM.EVENT.MESSAGE_RECEIVED
      // event.data - 存储 Message 对象的数组 - [Message]
      console.log("收到推送的新消息 TIM.EVENT.MESSAGE_RECEIVED" + JSON.stringify(event.data));
      var messageLists = that.data.messageList;
      that.setMessageList(false, messageLists.concat(event.data), "", true);
    });

    that.getMessageList(false);
    that.initFace(); //初始化表情框
  },
  initFace: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var em = {},
      that = this,
      emChar = that.data.emojiChar.split("-");
    var emojis = []
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v
      };
      emojis.push(em)
    });
    that.setData({
      emojis: emojis
    })

  },
  /* 获取会话消息列表*/
  getMessageList: function (e) {
    message.getMessageList(tim, that.data.conversationID, that.data.nextReqMessageID,
      (datas) => {
        var messageListDatas = datas.messageList; // 消息列表。
        const nextReqMessageID = datas.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
        const isCompleted = datas.isCompleted; // 表示是否已经拉完所有消息。

        if (messageListDatas.length == 0) { // 没有加载完
          wx.showToast({
            title: '没有更多消息了',
            icon: 'none',
          })
        }

        that.setMessageList(e, messageListDatas, nextReqMessageID, isCompleted);

        wx.stopPullDownRefresh();
      });
  },
  setMessageList(e, messageListDatas, nextReqMessageID, isCompleted) {
    var messageLists = that.data.messageList;
    messageListDatas = e ? messageListDatas.concat(messageLists) : messageListDatas;
    messageListDatas.sort(util.compare()); // 排序
    // 去重
    var arrry = [messageListDatas[0]];
    for (let i = 1; i < messageListDatas.length; i++) {
      const element = messageListDatas;
      if (element[i] !== element[i - 1]) {
        arrry.push(element[i]);
      }
    }

    this.setData({
      messageList: arrry,
      nextReqMessageID: nextReqMessageID,
      isCompleted: isCompleted,
      hasempty: messageListDatas.length == 0,
      userAvater: global.userInfo.avatarIm,
      userName: global.userInfo.name,
    });
    console.log("拿到会话消息列表=>" + JSON.stringify(that.data.messageList) +
      ",当前页=>" + that.data.nextReqMessageID +
      ",是否拉完所有=>" + that.data.isCompleted);

    if (e) { // 下拉
      // 将上一页的数据添加到原数据前面
      that.top();
    } else { // 上拉
      // 将下一页的数据添加到原数据后面
      that.bottom();
    }
    message.setMessageRead(tim, that.data.conversationID); // 会话置为已读
  },
  // 发送消息
  sendText: function (e) {
    console.log("sendOut", e)
    let title
    if (e.type == 'confirm') {
      title = e.detail.value
    }
    if (e.type == 'submit') {
      title = e.detail.value.sendText
    }
    if (isClick) {
      if (title == '' || title == "") {
        wx.showToast({
          title: '请输入聊天内容',
          icon: 'none',
        })
      } else {
        isClick = false;
        message.sendTextMessage(tim, that.data.imId, that.data.imType, title,
          (datas) => {
            isClick = true;
            that.setData({
              title: '', //将data的inputValue清空
              nextReqMessageID: '',
            });
            console.log("发送文本成功===>");
            that.getMessageList(false);
          });
      }
    }
  },
  // 发送表情
  emojiChoose: function (e) {
    //当前输入内容和表情合并
    this.setData({
      title: e.currentTarget.dataset.emoji
    })
    console.log("sendOut", e)
    let title = this.data.title
    if (title == '') {
      wx.showToast({
        title: '请输入聊天内容',
        icon: 'none',
      })
    } else {
      message.senFaceMessage(tim, that.data.imId, that.data.imType, title,
        (datas) => {
          that.setData({
            title: '', //将data的inputValue清空
            nextReqMessageID: '',
          });
          console.log("发送表情成功===>");
          that.getMessageList(false);
        });
    }
  },
  // 发送图片
  sendImage: function (e) {
    // 让用户选择一张图片
    wx.chooseImage({
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'], // 从相册选择
      success: res => {
        message.sendImageMessage(tim, that.data.imId, that.data.imType, res,
          (datas) => {
            console.log("发送图片成功===>");
            that.setData({
              nextReqMessageID: "",
            });
            that.getMessageList(false);
          }, (progress) => {
            wx.showLoading({
              title: '发送中',
            })
            if (progress == 1) {
              wx.hideLoading()
            }
          });
      },
    })
  },
  // 发送视频
  sendVideo: function (e) {
    // 小程序端发送视频消息示例：
    // 1. 调用小程序接口选择视频
    wx.chooseVideo({
      sourceType: ['album', 'camera'], // 来源相册或者拍摄
      maxDuration: 60, // 设置最长时间60s
      camera: 'back', // 后置摄像头
      success(res) {
        message.sendVideoMessage(tim, that.data.imId, that.data.imType, res,
          (datas) => {
            console.log("发送视频成功===>");
            that.setData({
              nextReqMessageID: "",
            });
            that.getMessageList(false);
          });
      }
    })
  },
  // 发送文件
  sendFile: function (e) {
    wx.showToast({
      title: '微信小程序目前不支持选择文件的功能',
      icon: 'none',
      duration: 2000,
    })
  },

  // 手指点击录语音
  voice_ing_start: function () {
    console.log('手指点击录音')
    wx.showToast({
      title: '按住录音，松开发送',
      icon: 'none',
    })
    this.setData({
      voice_ing_start_date: new Date().getTime(), //记录开始点击的时间
    })
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 8000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 24000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      audioSource: 'auto',
      frameSize: 12, //指定帧大小，单位 KB
    }
    recorder.start(options) //开始录音

    this.animation = wx.createAnimation({
      duration: 1200,
    }) //播放按钮动画
    that.animation.scale(0.8, 0.8); //还原
    that.setData({
      spreakingAnimation: that.animation.export()
    })
  },
  // 在新页面中全屏预览图片
  preImage: function (e) {
    let preSrc = e.currentTarget.dataset.src;
    console.log("预览的图片==>" + preSrc);
    wx.previewImage({
      current: preSrc,
      urls: [preSrc],
    })
  },
  // 点击头像查看个人信息
  getUserInof: function (e) {
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?userId=' + e.currentTarget.dataset.userid,
    })
  },
  // 点击自定义消息
  my_custom_click: function (e) {
    var datas = e.currentTarget.dataset.datas;
    wx.navigateTo({
      url: '/pages/marketDeatil/marketD?productId=' + datas.goodsId + '&tvTitle=' + datas.msgTitle,
    })
  },
  onReady: function () {
    this.on_recorder();
  },
  // 录音监听事件
  on_recorder: function () {
    console.log('录音监听事件');
    recorder.onStart((res) => {
      console.log('开始录音');
    })
    recorder.onStop((res) => {
      let {
        tempFilePath
      } = res;
      console.log('停止录音,临时路径', tempFilePath);
      var x = new Date().getTime() - this.data.voice_ing_start_date
      if (x > 1000) {
        message.sendAudioMessage(tim, that.data.imId, that.data.imType, res,
          (datas) => {
            console.log("发送语音成功===>");
            that.setData({
              nextReqMessageID: "",
            });
            that.getMessageList(false);
          });
      }
    })
    recorder.onFrameRecorded((res) => {
      return
      console.log('onFrameRecorded  res.frameBuffer', res.frameBuffer);
      string_base64 = wx.arrayBufferToBase64(res.frameBuffer)

      console.log('string_base64--', string_base64)
    })
  },
  // 手指松开录音
  voice_ing_end: function () {
    console.log('手指松开录音')

    this.animation = "";
    var x = new Date().getTime() - this.data.voice_ing_start_date
    if (x < 1000) {
      console.log('录音停止，说话小于1秒！')
      wx.showModal({
        title: '提示',
        content: '说话要大于1秒！',
      })
      recorder.stop();
    } else {
      // 录音停止，开始上传
      recorder.stop();
    }
  },
  // 点击录音开始播放事件
  my_sound_click: function (e) {
    var src = e.currentTarget.dataset.src;
    console.log('url地址', src);
    innerAudioContext.src = src
    innerAudioContext.seek(0);
    innerAudioContext.play();
  },
  // 播放语音
  playTop: function (e) {

    that.my_sound_click(e);

    let dataset = e.currentTarget.dataset;
    let j = 0,
      count = 0;
    that.data.timer = setInterval(function () {
      let time = +dataset.time * 2
      if (time > count) {
        j = j % 3;
        j++;
        count++;
        that.setData({
          playId: dataset.id,
          playing: j,
          showOrhidden: true,
        })
      } else {
        clearInterval(that.data.timer); //停止帧动画循环  
        that.setData({
          playId: -1,
          playing: 0,
          showOrhidden: false,
        })
      }
    }, 500)
  },
  // 点击语音图片
  voice_icon_click: function () {
    this.setData({
      voice_icon_click: !this.data.voice_icon_click,
      // 隐藏表情输入和文件选择
      // isShow:true,
      // add_icon_click:true,
    })
  },
  // 点击添加表情包
  addSmile: function () {
    this.setData({
      isShow: !this.data.isShow,
      add_icon_click: false,

    })
  },
  // 点击加号图片
  add_show_atta: function () {
    this.data.isShow = false
    this.setData({
      isShow: this.data.isShow,
      add_icon_click: !this.data.add_icon_click,
      bottomHeight: !this.data.add_icon_click ? 350 : 100,
    })
    that.bottom();
  },
  top: function () {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  bottom: function () {
    wx.createSelectorQuery().select('#x_chat').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom + 1000000,
      })
    }).exec()
  },
  /** 跳转圈子信息 */
  goGroupPrifile: function () {
    wx.navigateTo({
      url: '../groupInfo/groupInfo?groupId=' + that.data.imId,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.getMessageList(true);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
})