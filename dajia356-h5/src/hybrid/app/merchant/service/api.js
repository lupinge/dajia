/*
列表页接口
http://m.yebin.dajia365.com/merchant/get_list_from_h5?type=1&page=2
type: 0/热门商家；1/建材商家；2/家居商家   默认：0
page：默认1

商家详情页接口
http://m.yebin.dajia365.com/merchant/get_info_from_h5?merchant_id=36

商家评论列表接口
http://m.yebin.dajia365.com/merchant_comment/list?merchant_id=36&score=0&page=1
*/


var Util = require('hybrid/common/lib/util/util.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');
var NativeAPI   = require('hybrid/common/lib/native/native.js');


var BaseAPI = new HttpAPI({
    path: '/'
});

var resultWraper = function (callback) {
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        return callback(null, data);
    };
};

var get = function (query, data, callback) {
    BaseAPI.request(
        'GET',
        null,
        query || '',
        data,
        callback
    );
};
var post = function (query, data, callback) {
    BaseAPI.request(
        'POST',
        null,
        query || '',
        data,
        callback
    );
};


exports.initData = Util.promisify(function (param, callback) {
    get('merchant/get_list_from_h5', param, resultWraper(callback));
});
exports.fetchDetail = Util.promisify(function (param, callback) {
    get('merchant/get_info_from_h5', param, resultWraper(callback));
});
exports.getComments = Util.promisify(function (param, callback) {
    get('merchant_comment/list', param, resultWraper(callback));
});
exports.like = Util.promisify(function (param, callback) {
    if (NativeAPI.isSupport()) {
        NativeAPI.invoke('forumLike', param, resultWraper(callback));
    } else {
        get('like', param, resultWraper(callback));
    }
});
exports.reply = Util.promisify(function (param, callback) {
    if (NativeAPI.isSupport()) {
        NativeAPI.invoke('forumReply', param, function (err, data) {
            if (err) {
                return callback(err);
            }
            var tdata = data || {};
            if (tdata.code !== 10000) {
                return callback(tdata.msg);
            }
            callback(null, tdata.data);
        });
    } else {
        get('reply', param, resultWraper(callback));
    }
});
exports.page = Util.promisify(function (param, callback) {
    post('page', param, resultWraper(callback));
});