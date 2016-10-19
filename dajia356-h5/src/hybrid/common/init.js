var $ = require('$');
var hash = window.location.hash.replace(/^#/, '').split('?');

var ATTACHE_URL = 'hybrid/app/';
var viewPath = /^https?:\/\//.test(hash[0]) ? null : hash[0]; // 避免XSS漏洞
viewPath = viewPath.indexOf(ATTACHE_URL) >= 0 ? viewPath : ATTACHE_URL + viewPath;
if (viewPath.lastIndexOf('/') + 1 === viewPath.length) {
    viewPath = viewPath + 'index';
}

var config = getConfig() || {};
var timing = {START: Date.now() - window.GJ_START_TIMESTAMP};

$('body')
    .on('touchstart', 'a, .js-touch-state', function () {
        $(this).addClass('touch');
    })
    .on('touchmove', 'a, .js-touch-state', function () {
        $(this).removeClass('touch');
    })
    .on('touchend', 'a, .js-touch-state', function () {
        $(this).removeClass('touch');
    })
    .on('touchcancel', 'a, .js-touch-state', function () {
        $(this).removeClass('touch');
    })
    .on('tap', function () {
        if($(this).hasClass('offline')){
            window.location.reload();
        }
    });
function getConfig () {
    var config = '';
    config = hash[1] ? hash[1] : '';

    if (!config) {
        return null;
    }

    return config.split('&')
        .map(function (pair) {
            return pair.split('=');
        })
        .reduce(function (obj, pair) {
            var val, key;
            key = pair[0].trim();

            val = decodeURIComponent((pair[1] || '').replace(/\+/g, '%20'));
            val = $.zepto.deserializeValue(val);

            if (key) {
                obj[key] = val;
            }

            return obj;
        }, {});
}
// 兼容URL尾部被意外添加&或者?的问题
viewPath = viewPath.split(/&|\?/)[0];
require.async([viewPath], function (view) {
    timing.VIEW = Date.now() - timing.START - window.GJ_START_TIMESTAMP;
    timing.DURATION = Date.now() - window.GJ_START_TIMESTAMP;
    view.init(config);
    if (view.update && 'onhashchange' in window) {
        window.addEventListener('hashchange', function () {
            view.update(getConfig());
        }, false);
    }
})
    .fail(function () {
        $('body').removeClass('loading').addClass('offline');
    });
