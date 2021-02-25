// pages/set/complaint/complaint.js
import {
  globalUrls
} from "../../../utils/global.js"
let imgUrl = globalUrls.imgUrl
let aliImg = globalUrls.aliImg
var ossUp = require('../../../utils/ossUp.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedContent: "请输入您的投诉或建议，我们会尽快处理...",
    image: [],
    addImg: [],
    fbImages: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  }, 
  formSubmit: function (e) {
    let information = e.detail.value;
    let feedContent = information.feedContent
    let photoTsr = "";
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认提交吗？',
      success(res) {
        if (res.confirm) {
          that.data.image.forEach((val, i) => {
            if (i == that.data.image.length - 1) {
              photoTsr += val.imageAddress.replace(globalUrls.imgUrl + "/", "");
            } else {
              photoTsr += val.imageAddress.replace(globalUrls.imgUrl + "/", "") + ",";
            }
          })
          var imgCount = that.data.addImg.length;
          if (imgCount >= 1) {
            /*有图片需要上传*/
            var i = 0;
            that.data.addImg.forEach((val) => {
              var filename = new Date().getTime;
              var hz = val.split(".");

              ossUp.upload("images_ts/" + filename + "_xximg." + hz[hz.length - 1], val, (url) => {
                wx.showLoading({
                  title: '正在上传中',
                })
                if (url === false) {
                  wx.showToast({
                    title: '上传出错',
                  })
                }
                /**每回调一次检查是否传完 */
                if (i == that.data.addImg.length - 1) {
                  photoTsr += "," + url;
                  that.data.fbImages = photoTsr;
                  console.log(photoTsr);
                  that.saveImgData();
                } else {
                  photoTsr += "," + url;
                }
                i += 1;
              });
            })
          } else {
            /**没有图片需要上传，直接调用保存接口 */
            that.data.fbImages = photoTsr;
            console.log(photoTsr);
            that.saveImgData();
          }
        }
      }
    })
  },
  // 上传图片
  uploadImg: function (res) {
    let tempFilePaths = res.detail.tempFilePaths;
    this.data.addImg = [];
    this.data.image = [];
    // console.log(tempFilePaths)
    tempFilePaths.forEach((val) => {
      // val.imageAddress = val.imageAddress.replace(globalUrls.imgUrl + "/", "");
      if (val.isadd) {
        this.data.addImg.push(val.imageAddress)
      } else if (typeof (val.isadd) == "undefined") {
        this.data.image.push(val)
      }
    })
  },
  /**数据保存 */
  saveImgData() {
    var text = this.data.feedContent;
    var photostr = this.data.fbImages;
    console.log(photostr)
    console.log(text)
    //  return false;
    wx.request({
      url: globalUrls.baseUrl + '/feedback/feedback/submit',
      method: 'POST',
      data: {
        feedContent: text,
        fbImages: photostr
      },
      header: {
        "Authorization": globalUrls.authorization,
        "Content-Type": "application/x-www-form-urlencoded"
      }, // 设置请求的 header
      success: function (res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '上传成功',
            // icon: 'none',
            duration: 1000
          })
          wx.navigateBack({
            
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      },
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})