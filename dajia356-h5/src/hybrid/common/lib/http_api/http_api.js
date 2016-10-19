var $ = require('$');
var HybridAPI = require('hybrid/common/lib/api/index.js');
var server = G.config('mobile_domain');
var SUCESS_CODE = 10000;
function MobdsAPI (config) {
    this.config = config;
}

MobdsAPI.prototype.request = function(type, headers, query, data, callback) {
    var defer = $.Deferred();
    var config = this.config;
    server = config.domain || server;
    if (typeof data === 'function') {
        callback = data;
        data = undefined;
    }

    if (callback) {
        defer
            .done(function (result) {
                callback(null, result);
            })
            .fail(function (err) {
                callback(err);
            });
    }

    HybridAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
        if (err) {
            defer.reject(new Error('无法获取设备信息!'));
            return;
        }
        var ext = '?' + 'mid='+ deviceInfo.mid + '&sign=' + deviceInfo.sign + '&time='+ deviceInfo.time;
        var timeout = deviceInfo.network_type === 'wifi' ? 10 : 30;
        if (type === 'get' || type === 'GET') {
            ext = '';
        }
        $.ajax({
            type: type,
            url: server + config.path + (query || '') + ext,
            xhrFields: {
                withCredentials: true
            },
            data: $.extend({
                'uid': deviceInfo.user_id || deviceInfo.userId,
                'token': deviceInfo.token,
                'sign':deviceInfo.sign,
                'time':deviceInfo.time,
                'mid':deviceInfo.mid
            }, data),
            timeout: timeout * 1000,
            dataType: 'json'
        })
            .done(function (data) {
                if (!data) {
                    return defer.resolve(data);
                }
                resultWraper(data);
            })
            .fail(function (err) {
                if (err.responseText) {
                    try{
                        resultWraper(JSON.parse(err.responseText));
                    }
                    catch(e){
                        defer.reject(new Error('网络异常'));
                    }
                } else {
                    defer.reject(new Error('网络异常'));
                }
            });
    });

    function resultWraper (data) {
        var err = null;
        if ('code' in data && 'data' in data && 'msg' in data) {
            if (data.code !== SUCESS_CODE) {
                err = new Error(data.msg);
                err.code = data.code;

                defer.reject(err);
            } else {
                defer.resolve(data.data);
            }
        } else {
            defer.resolve(data);
        }
    }

    return defer.promise();
};
MobdsAPI.prototype.get = function (params, callback) {
    return this.request(
        'GET',
        null,
        params.uri || '',
        params.data,
        resultWraper(callback)
    );
};
MobdsAPI.prototype.post = function (params, callback ) {
    return this.request(
        'POST',
        null,
        params.uri || '',
        params.data,
        resultWraper(callback)
    );
};
function resultWraper (callback) {
    if (!callback) {
        return;
    }
    return function (err, data) {
        if (err) {
            return callback(err);
        }

        return callback(null, data);
    };
}

module.exports = MobdsAPI;