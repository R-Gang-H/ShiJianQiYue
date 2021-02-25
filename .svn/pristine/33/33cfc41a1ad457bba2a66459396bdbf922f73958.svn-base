import {
  globalUrls
} from "global.js"
//正式
// const accessid = '';
// const accesskey = '';
// const host = '';
//测试
const host = 'https://sjqy-bj-oss.oss-cn-beijing.aliyuncs.com';

function upload(fileName, path,fcall){
  console.log(fileName);
  console.log(path);
  // return false;
  wx.uploadFile({
    url: globalUrls.baseUrl +"/upload/upload/upload",
    filePath: path,
    fileType: "image",
    name: 'file',
    header:{
      "Authorization": globalUrls.authorization,
    },
    formData:{},
    success: (res) => {
      var ret = res.data;
      if(res.statusCode!==200){
        fcall(false);
      }
      var retObj = JSON.parse(ret);
      console.log(retObj)
      console.log(retObj.data.path)
      if(typeof(fcall)=="function"){
        fcall((retObj.data.path ? retObj.data.path:""));

      }
    },
    fail: (err) => {
    
    }
  })
}
module.exports={  
  upload,host
}