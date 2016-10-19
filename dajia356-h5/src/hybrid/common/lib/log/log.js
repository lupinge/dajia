var Cookie = require('lib/cookie/cookie.js');
var Storage = require('lib/storage/storage.js');
var UUID = require('lib/uuid/uuid.js');
var NativeAPI = require('hybrid/common/lib/native/native.js');
var HybridAPI = require('hybrid/common/lib/api/index.js');
var getInstallId = require('../mobds/api/get_install_id.js');
var async = require('lib/async/async.js');
var moduleDone = module.async();

var settings = {};
var DEFAULT_SERVER = '//analytics.ganji.com/h.gif?';
var DEFAULT_PV_SERVER = '//analytics.ganji.com/h5p.gif?';
var DEFAULT_EV_SERVER = '//analytics.ganji.com/h5e.gif?';

async.auto({
    deviceInfo: function (callback) {
        HybridAPI.invoke('getDeviceInfo', null, function (err, deviceInfo) {
            callback(null, {
                error: err,
                data: deviceInfo
            });
        });
    },
    userInfo: function (callback) {
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
            callback(null, {
                error: err,
                data: userInfo
            });
        });
    },
    installId: function (callback) {
        if (NativeAPI.isSupport()) {
            getInstallId(function (err, installId) {
                callback(null, {
                    error: err,
                    data: installId
                });
            });
        } else {
            callback(null, {
                error: null,
                data: null
            });
        }
    }
}, function (err, result) {
    setupLogInfo(
        result.deviceInfo.data,
        result.userInfo.data || {},
        result.installId.data);

    moduleDone();
});

function setupLogInfo (deviceInfo, userInfo, installId) {
    settings.view = settings.gc || '';
    settings.uuid = installId || deviceInfo.userId || '-';
    settings.userId = userInfo.user_id || '-';
    settings.sid = getSid();
    settings.referGjch = getReferGjch();
    settings.ua = getUaInfo();
    settings.appInfo = deviceInfo.customerId + '@' + deviceInfo.versionId || '-';
}

function getReferGjch () {
    var s = new Storage('GANJI_LOGGER');
    return s.get('refer-gjch') || '-';
}

function getSid () {
    var sid = Cookie.get('GANJI_SID');
    if (sid) {
        return sid;
    }

    sid = UUID.generateUUIDV4();

    Cookie.set('GANJI_SID', sid, {
        domain: window.location.host.replace(/.*(\.[\w]*\.[\w]*)$/, '$1'),
        path: '/'
    });
    return sid;
}

function getUaInfo () {
    var ua = window.navigator.userAgent || '';
    var match = ua.match(/Mozilla\/5.0 \((.*)\) AppleWebKit(.*?) .*like Gecko\)([\S]*) (.*)/);
    var device, os;

    if (!match || !match[1]) {
        return 'UNKNOW ' + ua;
    }
    try {
        if (/like Mac OS X/.test(match[1])) {
            os = 'iOS ' + ((match[1].match(/([\d_]*)* like Mac OS X/) || [])[1] || '');
        } else if (/Android/.test(match[1])) {
            os = (match[1].match(/Android.*?;/) || [])[0];
        } else {
            os = 'unknow';
        }

        device = (match[1].match(/^(iPad[^;]*|iPhone[^;]*|iPod[^;]*)/) || match[1].match('.*;(.*)') || [])[1];
        device = device ? device.trim() : '';

        ua = [
            'de:' + device, // 设备名称
            'os:' + os,  // 系统版本
            'cv:' + (match[2] || '').replace('/', ''), // 核心版本
            'bn:' + match[4],   // 浏览器名字
            'ln:' + (window.navigator.language || window.navigator.browserLanguage), // 设备语言设置
            'sc:' + [window.screen.width, window.screen.height].join(',') // 屏幕比例
        ].join('|');
        return ua;
    } catch (ex) {
        return 'UNKNOW ' + ua;
    }
}

exports.setCaInfo = function (caInfo) {
    settings.ca_s = caInfo.ca_s;
    settings.ca_i = caInfo.ca_i;
    settings.ca_n = caInfo.ca_n;
    settings.ca_kw = caInfo.ca_kw;
};

exports.getCaInfo = function () {
    return {
        ca_s: settings.ca_s || '-',
        ca_i: settings.ca_i || '-',
        ca_n: settings.ca_n || '-',
        ca_kw: settings.ca_kw || '-'
    };
};

exports.setGjch = function (gjch) {
    var s = new Storage('GANJI_LOGGER');

    s.set('refer-gjch', gjch);
    settings.gc = gjch;
};

exports.sendPv = function (gjch, cb) {
    if (gjch) {
        exports.setGjch(gjch);
    }

    exports.send(null, [DEFAULT_PV_SERVER, DEFAULT_SERVER], cb);
};

exports.sendEv = function (log, cb) {
    exports.send(log, [DEFAULT_EV_SERVER, DEFAULT_SERVER], cb);
};

exports.send = function (log, server, cb) {
    var done = false;
    var url = '';
    var count;

    if (typeof server === 'function') {
        cb = server;
        server = null;
    }

    if (!log) {
        log = '';
    } else if (log && /^\d*$/.test(log.split('@')[0])) {
        log = 'ge=' + log;
    } else {
        log = 'gjalog=' + (log || '-');

        // 不符合ge规范的日志仅发送到h.gif
        server = server || [DEFAULT_SERVER];
    }

    if (!server) {
        server = [DEFAULT_EV_SERVER, DEFAULT_SERVER];
    }

    if (!Array.isArray(server)) {
        server = [server];
    }

    count = server.length;

    url += [
        'gc=' + (settings.gc || '-'),
        'uuid=' + (settings.uuid || '-'),
        'ucuser=' + (settings.userId || '-'),
        'sid=' + (settings.sid || '-'),
        'refer_gc=' + (settings.referGjch || '-'),
        'ua=' + (settings.ua || '-'),
        'appinfo=' + (settings.appInfo || '-'),
        log,
        'ca_s=' + (settings.ca_s || '-'),
        'ca_n=' + (settings.ca_n || '-'),
        'ca_kw=' + (settings.ca_kw || '-'),
        'ca_i=' + (settings.ca_i || '-'),
        'rnd=' + Math.random()
    ].join('&');

    function callback (err) {
        cb = cb || function ignore () {};
        if (done) {
            return;
        }
        if (err) {
            done = true;
            return cb(err);
        }

        count --;

        if (!count) {
            done = true;
            cb();
        }
    }

    server.forEach(function (server) {
        var img = new Image();

        img.onload = function () {
            callback();
        };

        img.onerror = function () {
            callback(new Error('network error'));
        };

        setTimeout(function () {
            callback(new Error('timeout'));
        }, 10000);

        img.src = server + url.toLowerCase();
    });
};

var listenFlag = false;

exports.listen = function () {
    if (listenFlag) {
        return;
    }

    require.async('$', function ($) {
        $('body').on('click', '[data-gjalog]', function (e) {
            var gjalog = $(e.currentTarget).attr('data-gjalog');
            var match;
            if ((match = /^(\d*)$/.exec(gjalog.split('@')[0])) && match[1].substr(-2)[0] === '1') {
                exports.send(gjalog.replace(/\d{8}($|@)/, '00000010$1'));
            } else if (gjalog.indexOf('atype=click') !== -1) {
                exports.send(gjalog);
            }
        });
    });

    listenFlag = true;
};
