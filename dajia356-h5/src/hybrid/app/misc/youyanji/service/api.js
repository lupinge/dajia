var Util = require('hybrid/common/lib/util/util.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');
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


exports.initDataBrand = Util.promisify(function (callback) {
    get('activity/get_brands', {product_category: 'zaojuyanji', act_name: '烟机点评活动'}, resultWraper(callback));
});
exports.add = Util.promisify(function (param, callback) {
    post('brand_comment/add', param, resultWraper(callback));
});