var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/help_index.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
//var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
//var Service     = require('./service/api.js');
// var UA = BP.ua();
var helper = require('./help.json');

/*style*/
require('./style/style.css');

var $body = $('body');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'帮助中心'
        }
    );
    initData();
    Util.listenNativeA($body);
};
function initData() {
    $body.removeClass('loading');
    $body.append(template({data: helper}));
    Widget.initWidgets();
}