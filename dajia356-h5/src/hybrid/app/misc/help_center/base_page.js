var $         = require('$');
// var Util      = require('hybrid/common/lib/util/util.js');
var NativeAPI = require('hybrid/common/lib/native/native.js');
var HybridAPI = require('hybrid/common/lib/api/index.js');
var Widget    = require('lib/widget/widget.js');
exports.user = {
    login: function () {
        var userDefer = $.Deferred();
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
        HybridAPI.invoke('getUserInfo', null, function (err, userInfo) {
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
exports.loadMore = Widget.define({
    events: {
        'tap': function() {
            this.loadMore();
        },
        'touchend': function(e) {
            e.preventDefault();
        }
    },
    init: function(config) {
        var self = this;
        var windowHeight = window.screen.height;
        this.config = config;
        this.offset = 1;
        this.scrollAble = config.scrollAble ? config.scrollAble : false;
        this.listening = false;
        this.$list = $(self.config.refer);
        this.loadTimes = 0;
        function onScroll() {
            var top = $(window).scrollTop();
            if ($('body').height() - windowHeight - top < 50) {
                self.loadMore();
            }
        }

        this.listenScroll = function() {
            if (self.listening) {
                return;
            }
            self.listening = true;
            $(window).on('scroll', onScroll);
        };

        this.removeScrollListener = function() {
            $(window).off('scroll', onScroll);
            self.listening = false;
        };
        if (config.scrollAble) {
            self.listenScroll();
        }
    }
});