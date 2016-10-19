var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/order_done.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
//var Util        = require('hybrid/common/lib/util/util.js');
//var Service     = require('./service/api.js');
// var UA = BP.ua();
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'支付成功'
        }
    );
    initData();
};
function initData() {
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();
}
