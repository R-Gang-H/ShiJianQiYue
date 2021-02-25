import {
  globalUrls
} from "../utils/global.js"
var global = require("../utils/global.js");

/** 获取会话列表 */
function getConversationList(tim, callback) {
  // 拉取会话列表
  var promise = tim.getConversationList();
  promise.then(function (imResponse) {
    const conversationList = imResponse.data.conversationList; // 会话列表
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(conversationList);
      console.log("会话列表数量===>" + conversationList.length);
    }
  }).catch(function (imError) {
    console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
  });
}

/** 获取某会话的消息列表 */
function getMessageList(tim, conversationID, nextReqMessageID, callback) {
  console.log("conversationID===>" + conversationID);
  var promise
  if (nextReqMessageID == "") {
    // 打开某个会话时，第一次拉取消息列表
    promise = tim.getMessageList({
      conversationID: conversationID,
      count: 15
    });
  } else {
    // 下拉查看更多消息
    promise = tim.getMessageList({
      conversationID: conversationID,
      nextReqMessageID,
      count: 15
    });
  }
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse.data); // 会话消息
      console.log("会话消息数量===>" + imResponse.data.messageList.length);
    }
  }).catch(function (imError) {
    console.warn('getMessageList error:', imError); // 获取会话消息失败的相关信息
  });
}

/** 将某会话下所有未读消息已读上报 */
function setMessageRead(tim, conversationID) {
  var promise = tim.setMessageRead({
    conversationID: conversationID,
  });
  promise.then(function (imResponse) {
    // 已读上报成功
    console.log('setMessageRead success:' + imResponse.data);
  }).catch(function (imError) {
    // 已读上报失败
    console.warn('setMessageRead error:', imError);
  });
}

/**
 * 创建文本消息
 */
function sendTextMessage(tim, toID, conversationType, text, callback) {
  // 发送文本消息，Web 端与小程序端相同
  // 1. 创建消息实例，接口返回的实例可以上屏
  var message = tim.createTextMessage({
    to: toID,
    conversationType: conversationType,
    payload: {
      text: text
    }
  });
  sendMessage(tim, message, callback);
}

/**
 * 创建图片消息
 */
function sendImageMessage(tim, toID, conversationType, res, callback, progress) {
  // 2. 创建消息实例，接口返回的实例可以上屏
  var message = tim.createImageMessage({
    to: toID,
    conversationType: conversationType,
    payload: {
      file: res
    },
    onProgress: function (event) {
      progress(event);
      console.log('image uploading:', event)
    }
  });
  sendMessage(tim, message, callback);
}

/**
 * 创建音频消息
 */
function sendAudioMessage(tim, toID, conversationType, res, callback) {
  // 4. 创建消息实例，接口返回的实例可以上屏
  const message = tim.createAudioMessage({
    to: toID,
    conversationType: conversationType,
    payload: {
      file: res
    },
    onProgress: function (event) {
      console.log('audio uploading:', event)
    }
  });
  sendMessage(tim, message, callback);
}
/*
创建表情消息 
*/
function senFaceMessage(tim, toID, conversationType, res, callback) {
  // 发送表情消息，Web端与小程序端相同。
  // 1. 创建消息实例，接口返回的实例可以上屏
  var message = tim.createFaceMessage({
    to: toID,
    conversationType: conversationType,
    payload: {
      data: res  // String 额外数据
    },
    onProgress: function (event) {
      console.log('face uploading:', event)
    }
  });
  sendMessage(tim, message, callback);

}
/**
 * 创建视频消息
 */
function sendVideoMessage(tim, toID, conversationType, res, callback) {
  // 2. 创建消息实例，接口返回的实例可以上屏
  var message = tim.createVideoMessage({
    to: toID,
    conversationType: conversationType,
    payload: {
      file: res
    },
    onProgress: function (event) {
      console.log('video uploading:', event)
    }
  })
  sendMessage(tim, message, callback);
}

/**
 * 自定义消息
 */
function setCustomMessage(tim, toID, conversationType, payload, callback) {
  // 2. 创建消息实例，接口返回的实例可以上屏
  var message = tim.createCustomMessage({
    to: toID,
    conversationType: conversationType,
    payload: payload,
  });
  sendMessage(tim, message, callback);
}

/** 
 * 发送消息
 */
function sendMessage(tim, message, callback) {
  // 2. 发送消息
  var promise = tim.sendMessage(message);
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse); // 发送成功
      console.log("发送成功===>" + JSON.stringify(imResponse.data));
    }
  }).catch(function (imError) {
    // 发送失败
    console.warn('sendMessage error:', imError);
  });
}

/** 获取其他用户资料 */
function getUserProfile(tim, userID, callback) {
  console.log("userID===>" + userID);
  var promise = tim.getUserProfile({
    userIDList: userID, // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
  });
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse.data); // 存储用户资料的数组 - [Profile]
      console.log("其他用户资料===>" + imResponse.data);
    }
  }).catch(function (imError) {
    console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
  });
}

/** 修改个人资料 */
function updateMyProfile(tim, data, callback) {
  // 修改个人标配资料
  var promise = tim.updateMyProfile({
    nick: data.name,
    avatar: data.avatarIm,
  });
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse.data); // 更新资料成功
      console.log("更新成功===>" + imResponse.data);
    }
  }).catch(function (imError) {
    console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
  });
}

/** 获取群详细资料 */
function getGroupProfile(tim, groupID, callback) {
  var promise = tim.getGroupProfile({
    groupID: groupID,
    // groupCustomFieldFilter: ['key1', 'key2']
  });
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse.data.group); // 更新资料成功
      console.log("获取群详细资料===>" + JSON.stringify(imResponse.data.group));
    }
  }).catch(function (imError) {
    console.warn('getGroupProfile error:', imError); // 获取群详细资料失败的相关信息
  });
}
/** 获取群成员列表 */
function getGroupMemberList(tim, groupID, callback) {
  var promise = tim.getGroupMemberList({
    groupID: groupID,
    count: 30,
    offset: 0
  }); // 从0开始拉取30个群成员
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse.data.memberList); // 群成员列表
      console.log("群成员列表===>" + JSON.stringify(imResponse.data.memberList));
    }
  }).catch(function (imError) {
    console.warn('getGroupMemberList error:', imError);
  });
}

/** 退出群组。*/
function quitGroup(tim, groupID, callback) {
  var promise = tim.quitGroup(groupID);
  promise.then(function (imResponse) {
    //回调函数，判定是否存在，有的话再操作
    if (callback != null) {
      callback(imResponse.data.groupID); // 退出成功的群 ID
      console.log("退出成功的群 ID===>" + JSON.stringify(imResponse.data.groupID));
    }
  }).catch(function (imError) {
    console.warn('quitGroup error:', imError); // 退出群组失败的相关信息
  });
}

module.exports = {
  getConversationList: getConversationList,
  getMessageList: getMessageList,
  setMessageRead: setMessageRead,
  getUserProfile: getUserProfile,
  sendTextMessage: sendTextMessage,
  sendImageMessage: sendImageMessage,
  sendAudioMessage: sendAudioMessage,
  sendVideoMessage: sendVideoMessage,
  senFaceMessage: senFaceMessage,
  setCustomMessage: setCustomMessage,
  updateMyProfile: updateMyProfile,
  getGroupProfile: getGroupProfile,
  getGroupMemberList: getGroupMemberList,
  quitGroup: quitGroup,
}