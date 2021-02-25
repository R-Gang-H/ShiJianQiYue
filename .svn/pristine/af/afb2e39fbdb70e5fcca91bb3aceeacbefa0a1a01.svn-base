import { globalUrls } from "../utils/global.js"
const network = {
    getReceivable: function(params) {
        wx.request({
            url: globalUrls.baseUrl + 'pay/cashout/myList',
            method: 'get',
            data: {

            },
            success: function(res) {
                console.log(res)

            }
        })
    }


}
export { network }