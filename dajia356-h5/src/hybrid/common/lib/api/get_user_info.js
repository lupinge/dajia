var Cookie = require('lib/cookie/cookie.js');
var NativeAPI = require('hybrid/common/lib/native/native.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');
var BaseAPI = new HttpAPI({
    path: '/'
});
module.exports = function (params, callback) {
    params = params || {};
    if (params.need_fetch) {
        BaseAPI.get({
            uri:'userInfo'
        }, function (err, userInfo) {
            if (err) {
                callback(err);
            }else {
                return callback(err, userInfo);
            }
        });
        return false;
    }
    NativeAPI.invoke('getUserInfo', null, function (err, userInfo) {
        if (err) {
            if (err.code !== -32603) {
                return callback(err);
            } else {
                userInfo = JSON.parse(Cookie.get('DJUserInfo') || null);
                if (!userInfo) {
                    err = new Error('未登录');
                    err.code = -32001;
                } else {
                    err = null;
                    userInfo.username = userInfo.user_name;
                }
            }
        }

        return callback(err, userInfo);
    });
};
