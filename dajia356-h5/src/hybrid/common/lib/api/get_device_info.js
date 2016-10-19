var Cookie = require('lib/cookie/cookie.js');
var NativeAPI = require('hybrid/common/lib/native/native.js');
var getUuid = require('hybrid/common/lib/log/uuid.js');


var DJtoken = 'sign=654c7195ff7db8a08d8d20486fed66ff&time=1466501670263&mid=864690022593456';
var config = DJtoken.split('&').map(function (item) {
    var ii = item.split('=');
    return ii[1];
});
module.exports = function(params, callback) {
    params = params || {};

    NativeAPI.invoke('getDeviceInfo', null, function(err, deviceInfo) {
        if (err) {
            if (err.code !== -32603) {
                return callback(err);
            } else {
                var token = (Cookie.get('ssid') || '').split('').map(function(l) {
                    return l.charCodeAt(0).toString(16);
                }).join('');
                var uuid = getUuid();
                uuid = 'b5a52f8f7e2da66a';
                token = '2a38532f611311fb08ce83976ca84f57';

                deviceInfo = {
                    'user_id': uuid,
                    'token': token,
                    'sign':config[0],
                    'time':config[1],
                    'mid':config[2],

                    'os': /android/i.test(window.navigator.userAgent) ? 'android' : 'ios'
                };
            }
        }

        return callback(null, deviceInfo);
    });
};