var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./activity.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Service     = require('./service/api.js');
/*style*/
require('./style/style.css');

exports.init = function () {
    var $body = $('body');

    NativeAPI.invoke(
        'updateTitle',
        {
            text:'点评马桶赢百元现金大奖'
        }
    );

    Service.initData(function (err, data) {
        $body.removeClass('loading');
        if (err) {
            $body.addClass('offline');
            return;
        }
        $body.append(template({data:data}));
        exports.registerShare();
        Widget.initWidgets();
    });
};

exports.scrollRules = Widget.define({
    events: {
        'click': function() {
            this.scrollToRules();
        }
    },
    init: function(config) {
        this.config = config;
    },
    scrollToRules: function (){
        var self = this;
        var refer = self.config.refer;
        $(refer).scrollTop($(document).height());
    }
});

exports.activity = Widget.define({
    events:{
        'tap [data-role="product"]': function (e) {
            var $cur = $(e.currentTarget);
            var url = $cur.data('url');
            this.openNativeView(url);
        },
        'tap [data-role="brand"]': function (e) {
            var $cur = $(e.currentTarget);
            var url = $cur.data('url');
            this.openNativeView(url);
        },
        'tap [data-role="showMore"]': function (e) {
            var $cur = $(e.currentTarget);
            var url = $cur.data('url');
            this.openNativeView(url);
        }
    },
    init: function (config) {
        this.config = config;

    },
    openNativeView: function (url) {
        var scheme = 'com.youwe.dajia';
        var url = scheme + '://' + url;
        window.location.href = url;
    }
});
exports.registerShare = function() {
    NativeAPI.invoke('updateHeaderRightBtn',{
        action: 'show',
        icon: 'share',
        text: '分享',
        data: {
            title : '点评马桶赢百元现金大奖 - 美家网',
            content: '你家的马桶好用吗？快来写真实使用感受吧，发点评就送10元现金红包，积攒人气更可获百元大奖！',
            url: 'http://m.dajia365.com/act/dianpingmatong201508.html',
            img_url:'http://' + window.location.host + '/dj/hybrid/app/misc/matongdianping/img/icon_logo_for_wechat.png'
        }
    },function (err, data) {
        if (!err) {
            window.console.log(data);
        }
    });
};
