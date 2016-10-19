var Util = require('hybrid/common/lib/util/util.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');

var BaseAPI = new HttpAPI({
    domain:G.config('api_domain'),
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
var post = function post(query, data, callback) {
    BaseAPI.request(
        'POST',
        null,
        query || '',
        data,
        callback
    );
};

exports.initData = Util.promisify(function (param, callback) {
    get(param.uri, param.params, resultWraper(callback));
});
exports.pushData = Util.promisify(function (param, callback) {
    post(param.uri, param.params, resultWraper(callback));
});