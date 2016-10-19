var $         = require('$');
// var Util      = require('hybrid/common/lib/util/util.js');
var NativeAPI = require('hybrid/common/lib/native/native.js');
var HybridAPI = require('hybrid/common/lib/api/index.js');

exports.user = {
    login: function () {
        var userDefer = $.Deferred();
        if (exports.ua.isWeixin) {
            return window.location.href = 'http://bbs.dajia365.com/app-index-login?app=account&type=weixinexpress&backUrl=' + encodeURIComponent(window.location.href) +'?tryLogin="1"';
        }
        if (!NativeAPI.isSupport()){
            return window.location.href = 'http://bbs.dajia365.com/3g-login-run?backurl=' + encodeURIComponent(window.location.href + '?tryLogin="1"');
        }
        NativeAPI.invoke('login', null, function (err, userInfo) {
            if (err) {
                userDefer.reject(err);
            } else {
                userDefer.resolve(userInfo);
            }
        });
        return userDefer;
    },
    getUserInfo: function (callback) {
        var defer = $.Deferred();
        HybridAPI.invoke('getUserInfo', {nee_fetch: true}, function (err, userInfo) {
            if (err) {
                defer.reject(err);
                return;
            }
            defer.resolve(userInfo);
        });
        if (callback) {
            defer
                .done(function (userInfo) {
                    callback(null, userInfo);
                })
                .fail(function (err) {
                    callback(err);
                });
        }
        return defer.promise();
    },
    tryLogin: function () {
        var defer = $.Deferred();
        var self  = this;
        this.getUserInfo()
            .done(function (userInfo) {
                defer.resolve(userInfo);
            }).fail(function () {
                self.login()
                .done(function (userInfo) {
                    defer.resolve(userInfo);
                })
                .fail(function (err) {
                    defer.reject(err);
                });
            });
        return defer;
    }
};
exports.ua = function (){
    var ua = navigator.userAgent.toLowerCase();
    return {
        isWeixin : /micromessenger/.test(ua),
        pc: !(/(blackberry|configuration\/cldc|hp |hp-|htc |htc_|htc-|iemobile|kindle|midp|mmp|motorola|mobile|nokia|opera mini|opera |Googlebot-Mobile|YahooSeeker\/M1A1-R2D2|android|iphone|ipod|mobi|palm|palmos|pocket|portalmmm|ppc;|smartphone|sonyericsson|sqh|spv|symbian|treo|up.browser|up.link|vodafone|windows ce|xda |xda_)/i.test(ua))
    };
};