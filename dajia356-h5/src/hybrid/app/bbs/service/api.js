var Util = require('hybrid/common/lib/util/util.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');
var NativeAPI   = require('hybrid/common/lib/native/native.js');

var BaseAPI = new HttpAPI({
    domain: G.config('bbs_api_domain'),
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
    get('native-read-info', param, resultWraper(callback));
});
exports.add = Util.promisify(function (param, callback) {
    post('brand_comment/add', param, resultWraper(callback));
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
exports.deletePost = Util.promisify(function (param, callback) {
    post('native-post-deleteThread', param, resultWraper(callback));
});
exports.deleteReply = Util.promisify(function (param, callback) {
    post('native-post-deletePost', param, resultWraper(callback));
});