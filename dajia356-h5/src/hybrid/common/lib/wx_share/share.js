var WeixinApi = require('lib/wx_api/wechat_jssdk.js');
var $ = require('$');
exports.share = function (config) {
    var self = this;
    this.config = config;
    this.wxData = $.extend({
        title: '大家装修网',
        desc: '大家装修网是国内最专业的建材家居导购平台，专业的评测、丰富的网友点评，帮你轻松选购装修产品。',
        link: window.location.href,
        imgUrl: '/hybrid/common/lib/wx_share/img/icon/icon_logo_for_wechat.png'
    }, config.wxData);

    var weixin = new WeixinApi();

    weixin.ready(function (API) {
        self.API = API;
        API.registerShareEvents(self.wxData);
    });
};