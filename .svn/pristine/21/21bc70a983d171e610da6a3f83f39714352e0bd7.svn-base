// pages/pull/pull.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
    }, 
  upimg: function () {
    console.log('上传图片');
    var that = this;
    if (that.data.img_arr == null) {
      console.log('null张');
      wx.chooseImage({
        count: 9,  //最多可以选择的图片张数，默认为9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res);
          that.setData({
            img_arr: res.tempFilePaths     //concat
          });
        }
      })
    }
  },
  formSumbmit: function (e) {
    console.log('对话框确认按钮点击事件');
    console.log(e);

    var that = this;
    var data = [];
    data.photo_info = e.detail.value.photo_info;
    data.timestamp = Date.parse(new Date()) / 1000;  //当前时间戳
    data.i = 0;
    that.upload(data);
},
})