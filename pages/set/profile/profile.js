// pages/set/profile/profile.js
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
      image: [],
      intro: "",
      arrow: aliImg + "arrow_right.png",
      photos:"",
      addImg:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      let intro = options.intro; //简介内容
      let photos = options.photos; //获取图片
      this.data.photos = options.photos;
    console.log(photos)
      var arrPhotos = photos.split(',')
      for (var i = 0; i < arrPhotos.length; i++) {
        if (arrPhotos[i]!=""){
          var images = imgUrl + "/" + arrPhotos[i]
          this.data.image.push({
            imageHide:"",
            imageAddress: images
          })
        }
      }
      // this.photos
      this.setData({
        intro: intro,
        image: this.data.image,
      })
      this.data.intro = intro;
  },
  // 提交
  formSubmit: function(e) {
    let information = e.detail.value;
    let intro = information.intro
    let photoTsr = "";
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认提交吗？',
      success(res) {
        if (res.confirm) {
          that.data.image.forEach((val, i) => {
            if (i == that.data.image.length - 1) {
              photoTsr += val.imageAddress.replace(globalUrls.imgUrl+"/","");
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
                if(url===false){
                  wx.showToast({
                    title: '上传出错',
                  })
                }
                /**每回调一次检查是否传完 */
                if (i == that.data.addImg.length - 1) {
                  photoTsr += "," + url;
                  that.data.photos = photoTsr;
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
            that.data.photos = photoTsr;
            console.log(photoTsr);
            that.saveImgData();
          }
        }
      }
    })
  },
  // 上传图片
  uploadImg: function(res) {
    let tempFilePaths = res.detail.tempFilePaths;
    this.data.addImg=[];
    this.data.image=[];
    // console.log(tempFilePaths)
    tempFilePaths.forEach((val)=>{
      // val.imageAddress = val.imageAddress.replace(globalUrls.imgUrl + "/", "");
      if (val.isadd){
        this.data.addImg.push(val.imageAddress)
      } else if (typeof (val.isadd) =="undefined"){
        this.data.image.push(val)
      }
    })
  },
  /**数据保存 */
  saveImgData(){
    var text = this.data.intro;
    var photostr = this.data.photos;
    console.log(photostr)
    console.log(text)
  //  return false;
    wx.request({
      url: globalUrls.baseUrl + '/user/user/edit',
      method: 'POST',
      data: {
        intro: text,
        photos: photostr
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
          //做一个事件,告诉上一个页面数据更新了
          // wx.navigateTo({
          //   url: '/pages/set/personalInfor/personalInfor',
          // })
          wx.redirectTo({
            url: '/pages/set/personalInfor/personalInfor',
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
  bindTextAreaBlur:function(e){
    this.data.intro = e.detail.value;
    
  }
})