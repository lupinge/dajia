var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');

var BaseAPI = new HttpAPI({
    path: '/',
    domain: G.config('store_domain')
});

exports.get = function (uri, data, callback) {
    return BaseAPI.get({uri:uri, data:data}, callback);
};

exports.post = function (uri, data, callback){
    return BaseAPI.post({uri:uri, data:data}, callback);
};
