var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');

var BaseAPI = new HttpAPI({
    path: '/shaibei',
    domain: G.config('mobile_domain')
});

exports.get = function (uri, data, callback) {
    BaseAPI.get({uri:uri, data:data}, callback);
};

exports.post = function (uri, data, callback){
    BaseAPI.post({uri:uri, data:data}, callback);
};
