var NativeAPI   = require('hybrid/common/lib/native/native.js');
exports.init = function (config) {
    setTimeout(function () {
        NativeAPI.invoke('closeWebview');
    }, 0);
    window.location.href = config.uri;
};