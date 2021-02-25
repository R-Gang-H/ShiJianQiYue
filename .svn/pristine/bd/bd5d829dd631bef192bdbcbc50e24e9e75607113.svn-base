// pages/set/newAddress/newAddress.js
import {
  globalUrls
} from "../../../utils/global.js"
let imgUrl = globalUrls.imgUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    mobile:"",
    sex:"",
    address:"",
    address2:"",
    isEdit: false,
    hasempty: false,
    addressId:'',
    isEdit:true
  },
  //移动选点
  onChangeAddress: function () {
    var _page = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        _page.setData({
          chooseAddress: res.address
        });
      },
      fail: function (err) {
        console.log(err)
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // let bol = that.data.isEdit
    let addressId = options.addressId
    console.log(88888888, addressId)
    let flag = false
    that.data.addressId = addressId
    if (null != addressId && undefined != addressId && "" != addressId){
      // that.data.isEdit = true
      flag = true
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })

    }else{
      // that.data.isEdit = false
      flag = false
    }
    that.setData({
      "name": options.name,
      "sex": options.sex,
      "mobile": options.mobile,
      "address": options.address,
      "address2": options.address2,
      addressId: addressId,
      isEdit:flag
    })
  },
  // 保存
  formSubmit: function (e) {
    let that=this
    let infor = e.detail.value;
    let name = infor.name;
    let sex = infor.radio;
    let mobile = infor.phone;
    let address = infor.address;
    let address2 = infor.number;
    let addressId = that.data.addressId
    if (null != addressId && undefined != addressId && "" != addressId) {
      // 编辑收货地址
       wx.request({
        url: globalUrls.baseUrl + '/user/address/edit',
        method: 'POST',
        data: {
          addressId: addressId,
          name: name,
          sex: sex,
          mobile: mobile,
          address: address,
          address2: address2,
        },
        header: {
          "Authorization": globalUrls.authorization,
          "Content-Type": "application/x-www-form-urlencoded"
        }, // 设置请求的 header
        success:function(res){
          wx.showToast({
            title: '修改成功',
            // icon: 'none',
            duration: 1000
          })
          that.setData({
            name: name,
            sex: sex,
            mobile: mobile,
            address: address,
            address2: address2,
          })
          // wx.navigateTo({
          //   url: '/pages/set/receivingAddr/receivingAddr'
          // })
          wx.redirectTo({
            url: '/pages/set/receivingAddr/receivingAddr'
          })
        },
        fail: function (err) {
          wx.showToast({
            title: err.errMsg,
          })
        }
      })
    } else {
      // 新增收货地址
      var flag = false;
      if (name == "") {
        wx.showToast({
          title: '联系人不能为空',
          icon: 'none',
          duration: 1000
        })
      } else if (mobile == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1000
        })
      }
      else if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1000
        })
      } 
      else if (address == "") {
        wx.showToast({
          title: '收货地址不能为空',
          icon: 'none',
          duration: 1000
        })
      } else if (address2 == "") {
        wx.showToast({
          title: '门牌号不能为空',
          icon: 'none',
          duration: 1000
        })
      } else {
        flag = true;
        wx.request({
          url: globalUrls.baseUrl + '/user/address/add',
          method: 'POST',
          data: {
            name: name,
            sex: sex,
            mobile: mobile,
            address: address,
            address2: address2,
          },
          header: {
            "Authorization": globalUrls.authorization,
            "Content-Type": "application/x-www-form-urlencoded"
          }, // 设置请求的 header
          success: function (res) {
            // console.log("11", res)
            wx.showToast({
              title: '保存成功',
              // icon: 'none',
              duration: 1000
            })
            var model = JSON.stringify({ name: name, mobile: mobile, sex: sex, address: address, address2: address2 })
            // console.log("123", model)
            // wx.navigateTo({
            //   url: '/pages/set/receivingAddr/receivingAddr?model=' + model,
            // })
            wx.redirectTo({
              url: '/pages/set/receivingAddr/receivingAddr?model=' + model,
            })
          },
          fail: function (err) {
            wx.showToast({
              title: err.errMsg,
            })
          }
        })
      } 
      flag = false
    }
  },
  // 删除地址
  deleteAddress:function(e){
    let that =this
    let addressId = that.data.addressId
    wx.request({
      url: globalUrls.baseUrl + '/user/address/delete',
      method: 'GET',
      data: {
        addressId: addressId
      },
      header: {
        "Authorization": globalUrls.authorization
      }, // 设置请求的 header
      success: function (res) {
        // console.log("11", res)
        wx.showToast({
          title: '删除地址成功',
          // icon: 'none',
          duration: 1000
        })
        // console.log("123", model)
        // wx.navigateTo({
        //   url: '/pages/set/receivingAddr/receivingAddr'
        // })
        wx.redirectTo({
          url: '/pages/set/receivingAddr/receivingAddr'
        })
      },
      fail: function (err) {
        wx.showToast({
          title: err.errMsg,
        })
      }
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