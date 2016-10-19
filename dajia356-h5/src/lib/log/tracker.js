var Cookie = require('lib/cookie/cookie.js');
var $ = require('$');

var userInfo = JSON.parse(Cookie.get('GanjiUserInfo') || '{}');
var server   = 'analytics.ganji.com';
var gjch     = $('head').data('gjch') || '-';
var guid     = Cookie.get('__utmganji_v20110909') || '-';
var sid      = Cookie.get('GANJISESSID') || '-';
var ifid     = Cookie.get('ifid') || '-';
var caInfo   = $('head').data('cainfo') || {};
var userId   = userInfo.user_id;
var ua       = navigator.userAgent;
var refer    = document.referrer ? encodeURIComponent(document.referrer) : '-';
var caName   = encodeURIComponent(caInfo.ca_name || '-');
var caSource = encodeURIComponent(caInfo.ca_source || '-');
var caKw     = encodeURIComponent(caInfo.ca_kw || '-');
var caId     = encodeURIComponent(caInfo.ca_id || '-');

exports.listen = function () {
    $('body').on('tap', '[data-gjalog]', function (e) {
        var gjalog = $(e.currentTarget).data('gjalog');
        if (gjalog.indexOf('atype=click') !== -1) {
            exports.send(gjalog);
        }
    });
};

var showLogCache = {};
exports.sendShow = function() {
    $('[data-gjalog]').each(function() {
        var gjalog = $(this).data('gjalog');
        if (showLogCache[gjalog]) {
            return;
        }

        showLogCache[gjalog] = true;

        if(gjalog.indexOf('atype=') !== -1) {
            var arr = gjalog.split('atype=');
            if(arr[1] && arr[1].indexOf('show') !== -1) {
                exports.send(gjalog);
            }
        }
    });
};

exports.send = function (gjalog, cb) {

    var img = new Image();
    var done = false;
    var url = '//' + server + '/wape.gif?';
    url += [
        'gjch=' + gjch,
        'uuid=' + guid,
        'gjuser=' + userId,
        'sid=' + sid,
        'ca_name=' + caName,
        'ca_source=' + caSource,
        'ca_kw=' + caKw,
        'ca_id=' + caId,
        'refer=' + refer,
        'ua=' + ua,
        'gjalog=' + gjalog,
        'ifid=' + ifid,
        'rnd=' + Math.random()
    ].join('&');

    function callback (err) {
        if (done) {
            return;
        }

        done = true;
        if (cb) {
            cb(err || null);
        }
    }

    img.onload = function () {
        callback();
    };

    img.onerror = function () {
        callback(new Error('network error'));
    };

    setTimeout(function () {
        callback(new Error('timeout'));
    }, 10000);

    img.src = url;
};