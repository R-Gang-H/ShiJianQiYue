const globalUrls = {
  baseUrl: "https://admin.shijianqiyue.com",
  authorization: wx.getStorageSync("access_token") ? "Bearer" + " " + wx.getStorageSync("access_token") : "Basic cGlnOnBpZw==",
  // 图片地址
  imgUrl: "https://sjqy-bj-oss.oss-cn-beijing.aliyuncs.com",
  // 本地阿里云图片
  aliImg: "https://sjqy-bj-oss.oss-cn-beijing.aliyuncs.com/images/xiaochengxu/",
  /**
   * 登录
   */
  getCode: "/user/mobile/", //获取验证码
  login: "/auth/mobile/token/code?", //登录
  getUserInfo: "/user/user/info", //获取个人信息
  setUserInfo: "/user/user/edit", //编辑个人信息. POST
  selectRole: "/user/user/editRole?", //选择身份
  attention: "/user/follow/follow?", //关注
  cancelAttention: "/user/follow/cancel?", //取消关注
  joinInfo: "/information/informationjoin/join?", //应约信息
  pay: "/pay/pay/pay?", //支付 和确认应约等,
  cancelInfo: "/pay/pay/payCannel?", //撤销信息
  /**
   * 首页模块
   */
  homeCategories: "/information/commondict/page?", //首页分类列表
  homeMessages: "/information/information/page?", //首页信息离别奥
  infoDetail: "/information/information/detail?", //信息详情
  getRedPackets: '/information/gift/page?', //红包信息
  redPacketDetail: '/information/gift/detail?', //红包详情
  cancelRedPacket: '/information/gift/cancel?', //撤销红包
  joinRedPacket: '/information/giftjoin/join?', //红包应约
  broadcastList: '/information/broadcast/page?', // 广播列表
  banners: '/app/ad/page',
  broadcastDetail: '/information/broadcast/detail?', //广播详情
  joinBroadcast: "/information/broadcastjoin/join?", //广播应约
  cancelBroadcast: "/information/broadcast/cancel?", //撤销广播
  /**
   * 集市模块
   */
  productList: "/information/product/page?", // 商品列表
  productDetails: "/information/product/detail?", // 商品详情
  productcomment: "/information/productcomment/page?", // 评论列表
  productJoin: "/information/productjoin/join", //商品应约
  productjoinlist: "/information/productjoin/list?", // 应约者列表
  productcategory: "/information/productcategory/page?", // 商品分类列表
  addressList: "/user/address/page?", // 我的地址列表
  addOrder: "/product/order/add", //47,商品下订单
  goPay: "/pay/pay/pay?", // 33 发起支付 （商品购买）
  getOpenID: "/user/user/bindMiniCodeToUser?", //89楼微信小程序支付绑定openID
  cancelGoods: "/product/product/updateStatus?", //23 商品下架
  cityList: '/information/city/page?', //城市选择
  productforward: '/product/productforward/forward?',
  /**
   * 用户模块
   */
  userWallet: "/pay/wallet/detail", //用户钱包信息
  getBackBzjList: '/information/information/getBackBzjList?',

  // 用户详情
  userInfo: "/user/user/info/",

  // 获取userSig
  imUserSig: "/message/chat/getSig",
  // 38. 我关注的人发布的信息列表
  myFollow: "/information/information/myFollow?"
}
//个人信息
var userInfo = {

  isLogin: '', //是否登录

  access_token: '',
  userId: '',
  avatar: '', //头像
  birthday: '', //生日
  createTime: '',
  intro: '', //简介
  mobile: '', //手机号
  name: '', //昵称
  role: '', //身份. xfz普通人,  shop2商户 sj书记

  userSig: '', // im sig，

  avatarIm: '',
  txIm: {},
  model: {},
  categories: [], //分类

}

export {
  globalUrls,
  userInfo
}