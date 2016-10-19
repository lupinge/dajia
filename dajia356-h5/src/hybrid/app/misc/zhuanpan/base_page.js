var $         = require('$');
var Util      = require('hybrid/common/lib/util/util.js');
var NativeAPI = require('hybrid/common/lib/native/native.js');
var HybridAPI = require('hybrid/common/lib/api/index.js');

exports.user = {
    login: function () {
        var userDefer = $.Deferred();
        if (!NativeAPI.isSupport()){
            Util.toast('app外暂不支持该功能，将为您下载app...');
            setTimeout(function () {
                window.location.href = 'http://m.dajia365.com/downapp';
            }, 3000);
            return false;
        }
        NativeAPI.invoke('login', null, function (err, userInfo) {
            if (err) {
                userDefer.reject(err);
            } else {
                userInfo.is_new = true;
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
    tryLogin: function (callback) {
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
        if (callback) {
            defer
                .done(function (userInfo) {
                    callback(null, userInfo);
                })
                .fail(function (err) {
                    callback(err);
                });
        }
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