var UA  = require('hybrid/app/misc/youyanji/base_page.js').ua();
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var wxShare = require('hybrid/common/lib/wx_share/share.js');
var $ = require('$');

exports.wx_share = function (wxData) {
    wxShare.share({
            wxData: wxData
        });
};
exports.nativeShare = function(wxData) {
    NativeAPI.invoke('updateHeaderRightBtn',{
        action: 'show',
        icon: 'share',
        text: '分享',
        data: {
            title : wxData.title,
            content: wxData.desc,
            url: wxData.link,
            img_url: wxData.imgUrl
        }
    },function (err, data) {
        if (!err) {
            window.console.log(data);
        }
    });
};
exports.registerShare = function (wxData) {
    var wxData = $.extend({
        title: '美家网',
        desc: '美家网是国内最专业的建材家居导购平台，专业的评测、丰富的网友点评，帮你轻松选购装修产品。',
        link: window.location.href,
        imgUrl: '/dj/hybrid/common/lib/wx_share/img/icon/icon_logo_for_wechat.png'
    }, wxData);
    exports.wx_share(wxData);
    if (UA.isWeixin) {
        exports.wx_share(wxData);
    } else {
        exports.nativeShare(wxData);
    }
};