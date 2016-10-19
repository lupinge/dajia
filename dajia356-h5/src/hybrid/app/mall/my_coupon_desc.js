var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/my_coupon_desc.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
//var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
//var Service     = require('./service/api.js');
// var UA = BP.ua();

/*style*/
require('./style/style.css');

var $body = $('body');
var $html = $('html');
$html.addClass('bgcolor');
exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'优惠券使用说明'
        }
    );
    initData();
    Util.listenNativeA($body);
};
function initData() {
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();
}