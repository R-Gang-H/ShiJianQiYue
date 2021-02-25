// pages/market/market.js
// 导包接口请求
import {
  globalUrls
} from "../../utils/global.js"
var WxNotificationCenter = require("../../utils/WxNotificationCenter.js");
var currentPage = 1 //初始化当前页面

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 3, //默认都不进行筛选
    lastIndex: 3, //记录上次点击的标签
    filterRecorder: [], //初始化筛选列表
    sortType: 'sales', //排序方式 默认综合排序
    keywords: '', //搜索内容
    productCateId: '', //按类型搜索
    listCity: [], //城市列表
    listZone: [], //区县列表
    listStreet: [], //街道列表
    pid: '0', //查询城市列表 默认查阳泉 初始化为0 城市ID
    cityId: '', //当前选中的城市ID  用于商品列表
    cityLevel: '2', //当前城市等级  默认是第一级  阳泉
    sortList: [{
        name: '综合排序',
        btnId: 'sales',
        isSelect: true
      },
      {
        name: '低价优先',
        btnId: 'low price',
        isSelect: false
      },
      {
        name: '高价优先',
        btnId: 'high price',
        isSelect: false
      }
    ]
  },
  // 所有弹窗触碰事件 隐藏所有弹窗
  hideMask: function () {
    this.setData({
      currentIndex: 3
    })
  },
  // 标题栏切换事件
  click: function (e) {
    this.setData({
      // 标题栏切换
      currentIndex: e.currentTarget.dataset.index,
    })
    // 如果两次点击了同一个标签
    if (this.data.lastIndex == this.data.currentIndex) {
      this.setData({
        // 标题栏切换
        currentIndex: 3,
        lastIndex: 3
      })
    } else {
      this.setData({
        lastIndex: this.data.currentIndex
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获取商品列表
    this.getGoodsList()
    // 获取筛选列表
    this.getFilterList()
    // 获取城市列表
    this.getCityList()
  },

  // 商品列表
  getGoodsList: function () {
    // 集市商品列表
    var goodsList = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productList,
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        cityId: goodsList.data.cityId,
        orderBy: goodsList.data.sortType,
        keywords: goodsList.data.keywords,
        productCateId: goodsList.data.productCateId,
        status: '1',
        current: currentPage,
      },
      success: function (res) {
        //停止刷新
        wx.stopPullDownRefresh()
        let data = res.data.data
        let records = data.records //数据列表
        console.log(data)
        records.forEach(item => {
          // 截取第一张图片
          item.iconPic = item.productImages.split(',')[0]
          item.listName = item.productName
          item.listContent = item.productDesc
          item.listTime = '￥' + item.price
          item.state = item.cityName
        })
        goodsList.setData({
          itemContent: data.current == 1 ? records : goodsList.data.itemContent.concat(records)
        })

      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  // 获取筛选列表数据
  getFilterList: function () {
    // 集市商品列表
    var filterList = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.productcategory,
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        status: '1'
      },
      success: function (res) {
        let data = res.data.data
        filterList.data.filterRecorder = data.records //数据列表
        var filter = {
          productCateName: '全部',
          productCateId: '',
          isSelect: false
        }
        filterList.data.filterRecorder[filterList.data.filterRecorder.length] = filter
        // 为点击事件添加ID
        filterList.data.filterRecorder.forEach(function (item, index) {
          filterList.data.filterRecorder[index].id = index
        })
        filterList.setData({
          filterRecorder: data.records
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  // 获取城市筛选列表
  getCityList: function () {
    var cityData = this;
    wx.request({
      url: globalUrls.baseUrl + globalUrls.cityList,
      method: 'GET',
      header: { //请求头
        Authorization: globalUrls.authorization
      },
      // 传参
      data: {
        size: '20',
        pid: cityData.data.pid
      },
      success: function (res) {
        let data = res.data.data
        var Recorder = data.records
        var city = {
          cityName: '全部区域',
          cityId: '',
          cityLevel: 2
        }
        if (cityData.data.cityLevel == '2') {
          cityData.data.listCity = Recorder
          // 添加全部区域选项
          cityData.data.listCity[1] = city
          // 添加索引值
          for (let index = 0; index < cityData.data.listCity.length; index++) {
            cityData.data.listCity[index].id = index
          }
        }
        if (cityData.data.cityLevel == '3') {
          cityData.data.listZone = Recorder
          for (let index = 0; index < cityData.data.listZone.length; index++) {
            cityData.data.listZone[index].id = index
          }
        }
        if (cityData.data.cityLevel == '4') {
          cityData.data.listStreet = Recorder
          for (let index = 0; index < cityData.data.listStreet.length; index++) {
            cityData.data.listStreet[index].id = index
          }
        }
        console.log(data)
        cityData.setData({
          listCity: cityData.data.listCity,
          listZone: cityData.data.listZone,
          listStreet: cityData.data.listStreet,
        })
      },
      fail: function (err) {
        console.log(err.errMsg)
      }
    })
  },
  // 城市列表点击事件
  cityClick: function (e) {
    var position = 0
    this.setData({
      position: e.currentTarget.dataset.index.id,
      cityLevel: e.currentTarget.dataset.index.cityLevel + 1,
      pid: e.currentTarget.dataset.index.cityId
    })
    if (this.data.cityLevel == 3) { //证明是点击了城市列表
      this.data.listCity.forEach(item => {
        item.isSelect = false
      })
      this.data.listZone.forEach(item => {
        item.isSelect = false
      })
      this.data.listStreet.forEach(item => {
        item.isSelect = false
      })
      this.data.listCity[this.data.position].isSelect = true
      if (this.data.pid == '') { //证明点击了全部区域
        // 隐藏弹窗 进行筛选
        this.GetCityId()
      }
    }
    if (this.data.cityLevel == 4) { //证明是点击了区县列表
      this.data.listZone.forEach(item => {
        item.isSelect = false
      })
      this.data.listStreet.forEach(item => {
        item.isSelect = false
      })
      if (this.data.pid == '') { //证明点击了全部区域
        // 隐藏弹窗 进行筛选
        this.GetCityId()
      }
      this.data.listZone[this.data.position].isSelect = true
    }
    if (this.data.cityLevel == 5) { //证明是点击了街道列表
      this.data.listStreet.forEach(item => {
        item.isSelect = false
      })
      this.data.listStreet[this.data.position].isSelect = true
    }
    if (this.data.cityLevel != 5) {
      this.getCityList()
    }
    this.setData({
      listCity: this.data.listCity,
      listZone: this.data.listZone,
      listStreet: this.data.listStreet,
    })
  },
  // 城市列表筛选点击了确定按钮
  GetCityId: function () {
    this.setData({
      cityId: this.data.pid, //获取当前选中的城市ID
      currentIndex: 3 //隐藏城市选择弹窗
    })
    // 城市选择完成后刷新商品列表
    this.getGoodsList()
  },
  // 排序弹窗点击事件
  sortClick: function (e) {
    this.setData({
      sortType: e.currentTarget.dataset.index,
    })
    var model = this
    WxNotificationCenter.addNotification("selectCity", model.refresh, model)
    for (let index = 0; index < this.data.sortList.length; index++) {
      const element = this.data.sortList[index];
      element.isSelect = false
    }
    if (this.data.sortType == 'sales') {
      this.data.sortList[0].isSelect = true
    }
    if (this.data.sortType == 'low price') {
      this.data.sortList[1].isSelect = true
    }
    if (this.data.sortType == 'high price') {
      this.data.sortList[2].isSelect = true
    }
    // 设置成功后重置排序数据
    this.setData({
      sortList: this.data.sortList
    })
    // 刷新商品列表
    this.getGoodsList()
  },
  // 筛选弹窗点击事件
  filterClick: function (e) {
    for (let index = 0; index < this.data.filterRecorder.length; index++) {
      const element = this.data.filterRecorder[index];
      if (e.currentTarget.dataset.index == index) {
        element.isSelect = true
        this.data.productCateId = element.productCateId //赋值所选类型
      } else {
        element.isSelect = false
      }
    }
    this.setData({
      filterRecorder: this.data.filterRecorder,
      productCateId: this.data.productCateId
    })
    // 刷新商品列表
    this.getGoodsList()
  },
  btnSearch: function (e) {
    currentPage = 1
    this.setData({
      keywords: e.detail.value
    })
    this.getGoodsList()
  },
  /**
   * 登录成功刷新数据
   */
  refresh: function () {
    currentPage = 1
    // 置空后再次请求
    this.setData({
      itemContent: []
    })
    this.getGoodsList()
  },
  // 跳转商品详情页
  goDetail: function (e) {
    // 判断是否绑定信息通知事件
    wx.getStorageSync("isBindMsg") ? '' : this.goBind()
    wx.navigateTo({
      url: '/pages/marketDeatil/marketD?productId=' + e.currentTarget.dataset.index.productId + '&tvTitle=' + e.currentTarget.dataset.index.productName
    })
  },
  goBind: function () {
    //绑定订阅事件  收益到账提醒
    wx.requestSubscribeMessage({
      tmplIds: ['HHWJWjOuUS7s5ffC527s189I6UD-fB7HHFZ7ZNGBSGg', 'Wz3UDlDe_wIggDey8xpKvNGExDSeE8KIjrIVqr0cDcI'],
      success(res) {
        wx.setStorageSync('isBindMsg', true)
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
    currentPage = 1
    // 置空后再次请求
    this.setData({
      itemContent: []
    })
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    currentPage++
    this.getGoodsList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})