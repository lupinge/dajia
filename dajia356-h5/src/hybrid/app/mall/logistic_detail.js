var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/logistic_detail.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('./service/api.js');
var dateformat  = require('lib/dateformat/dateformat.js');
// var UA = BP.ua();
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'查看物流'
        }
    );
    window.console.log(config);
    initData(config.param);
};
function initData(param) {
    Service.get('bill/logistic_detail', {
        bill_seq_no: param.seq_no,
        merchant_id: param.merchant_id
    }, function (err, data) {
        $body.removeClass('loading');
        if (err || !data) {
            Util.toast(err.message);
            $body.addClass('offline');
            return;
        }
        $body.append(template({data:data, logisticBasicData:param, dateformat:dateformat}));
        Widget.initWidgets();
    });
    Util.listenNativeA($body);
}
