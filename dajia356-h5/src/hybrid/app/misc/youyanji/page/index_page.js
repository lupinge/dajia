var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/index_page.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var UA  = require('hybrid/app/misc/youyanji/base_page.js').ua();

// var Service     = require('./service/api.js');
/*style*/
require('../style/style.css');
if (UA.pc) {
    window.location.href = 'http://www.dajia365.com/act/dianpingyouyanji201510.html';
    return false;
}
exports.init = function () {
    var $body = $('body');
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'点评油烟机赢自拍神器'
        }
    );
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();
};

// var flag = true;
exports.showDetailRules = Widget.define({
    events: {
        'click [data-role="showDetailBtn"]': function() {
            this.showDetail();
        }
    },
    init: function(config) {
        this.config = config;
        this.flag = true;
    },
    showDetail: function (){
        var self = this;
        if(this.flag){
            this.flag = false;
            self.config.$showDetailBtn.html('收起<em></em>');
            self.config.$showDetailBtn.find('em').addClass('active');
        }else{
            this.flag = true;
            self.config.$showDetailBtn.html('点击查看完整规则<em></em>');
            self.config.$showDetailBtn.find('em').removeClass('active');
        }
        self.config.$detailBox.toggleClass('active');
    }
});

exports.redirect = function (config) {
    var _hmt = window._hmt || {};
    config.$el.on('click', function () {
        if (_hmt) {
            _hmt.push(['_trackEvent', 'participate']);
        }
        Util.redirect('hybrid/app/misc/youyanji/page/pub_page.js');
    });
};

shareAPI.registerShare({
    title: '吐槽或推荐油烟机，赢烤箱和自拍神器啦 - 美家网',
    desc: '国庆送礼啦！写抽油烟机点评，赢取烤箱和自拍神器！不管是推荐还是吐槽都是可以滴~',
    link: window.location.href,
    imgUrl: 'http://' + window.location.host + '/dj/hybrid/app/misc/youyanji/img/icon_logo_for_wechat.png'
});
