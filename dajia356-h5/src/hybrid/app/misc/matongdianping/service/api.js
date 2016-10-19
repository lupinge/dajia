var Util = require('hybrid/common/lib/util/util.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');
var BaseAPI = new HttpAPI({
    path: '/activity/index'
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


exports.initData = Util.promisify(function (callback) {
    get('', {act_name: 'dianpingmatong201508'}, resultWraper(callback));
});