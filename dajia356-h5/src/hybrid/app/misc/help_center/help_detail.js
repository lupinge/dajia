var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/help_detail.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
//var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
//var Service     = require('./service/api.js');
// var UA = BP.ua();
var helper = require('./help.json');
/*style*/
require('./style/style.css');

var $body = $('body');

exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'帮助中心'
        }
    );
    var first_index = config.param.first_index;
    var second_index = config.param.second_index;
    var help_detail = helper[first_index].children[second_index].children;
    initData(help_detail);
    Util.listenNativeA($body);
};
function initData(data) {
    $body.removeClass('loading');
    $body.append(template({data: data}));
    Widget.initWidgets();

    $('.a-coupon-desc').attr('href', 'http://' + window.location.host + '/index.html?v=' + Date.now() + '#mall/my_coupon_desc');
    $('.a-get-recommend').attr('href', 'http://m.dajia365.com/shaibei/get_recommend');
}