var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/share_page.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Base        = require('hybrid/app/misc/youyanji/base_page.js');
var UA          = Base.ua();
// var Service     = require('./service/api.js');
/*style*/
require('../style/style.css');

exports.init = function (config) {
    var $body = $('body');
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'点评油烟机赢自拍神器'
        }
    );
    $body.removeClass('loading');

    if (config.brandData) {
        $body.append(template({data: config.brandData}));
    }else{
        $body.addClass('offline');
    }
    //$body.append(template({data: config.brandData}));

    shareAPI.registerShare({
        title: '吐槽或推荐油烟机，赢烤箱和自拍神器啦 - 美家网',
        desc: '国庆送礼啦！写抽油烟机点评，赢取烤箱和自拍神器！不管是推荐还是吐槽都是可以滴~',
        link: 'http://' + window.location.hostname + '/dj/hybrid/common/index.html#hybrid/app/misc/youyanji/page/index_page.js',
        imgUrl: 'http://' + window.location.host + '/dj/hybrid/app/misc/youyanji/img/icon_logo_for_wechat.png'
    });
    Widget.initWidgets();
};
// document.body.onbeforeunload = function(){
//     event.returnValue='分享还可赢奖品哦';
// };

exports.shareTo = Widget.define({
    events: {
        'click': function() {
            this.goShare();
        },
        'click [data-role="sharemask"]': function() {
            this.hideMask();
        },
        'click [data-role="sharemasksec"]': function() {
            this.hideMaskSec();
        }
    },
    init: function(config) {
        this.config = config;
    },
    goShare: function (){
        if(NativeAPI.isSupport() || UA.isWeixin){
            this.config.$sharemask.addClass('active');
        }else{
            this.config.$sharemasksec.addClass('active');
        }
    },
    hideMask: function (){
        var self = this;
        self.config.$sharemask.removeClass('active');
    },
    hideMaskSec: function (){
        var self = this;
        self.config.$sharemasksec.removeClass('active');
    }
});