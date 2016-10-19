var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/refund.tpl');
var moneyTpl    = require('./template/widget/refund_only_money.tpl');
var goodTpl     = require('./template/widget/refund_money_good.tpl');
var refundReasonTpl = require('./template/widget/refund_reason.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('./service/api.js');
// var UA = BP.ua();
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');
var seq_no = '';
var total_fee = '';
var refund_reason_list1 = [];
var refund_reason_list2 = [];
var logistic_type_list = {};
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'申请退款'
        }
    );
    initData(config.param);
};
function initData(param) {
    seq_no = param.seq_no;
    total_fee = param.total_fee;
    Service.get('bill/refund_base_info', {}, function (err, data) {
        $body.removeClass('loading');
        if (err) {
            Util.toast(err.message);
            $body.addClass('offline');
            return;
        }

        refund_reason_list1 = data.refund_reason_list1;
        refund_reason_list2 = data.refund_reason_list2;
        logistic_type_list = data.logistic_type_list;

        $body.append(template({data: param}));
        $('#refundDiff').html(moneyTpl());
        $('#deliverStatusDiff').html(refundReasonTpl({data: refund_reason_list1}));
        Widget.initWidgets();
    });
    Util.listenNativeA($body);
}

exports.submitForm = Widget.define({
    events:{
        'change [data-role="selectType"]': function(e){
            this.changeDiff($(e.currentTarget), 1);
        },
        'change #selectDeliver': function(e){
            this.changeDiff($(e.currentTarget), 0);
        },
        'submit [data-role="form"]': function (e) {
            e.preventDefault();
            this.submitRefund();
        }
    },
    init: function (config) {
        this.config = config;
        this.config.$orderDetailA.attr('href', 'http://'+window.location.host+'/index.html?v='+Date.now()+'#mall/order_detail?param='+encodeURI( JSON.stringify({seq_no:seq_no}) ));
    },
    changeDiff: function ($cur, type) {
        var self = this;
        var index = parseInt($cur.find('option:selected').val(), 10);
        if(index){
            self.config.$deliverStatusDiffBox.html(refundReasonTpl({data: refund_reason_list2}));
            if(type){
                self.config.$refundDiffBox.html(goodTpl({data: logistic_type_list}));
                self.config.$refundDiffParent.addClass('move-down');
                self.config.$deliverStatusDiffParent.addClass('move-up');
            }

        }else{
            self.config.$deliverStatusDiffBox.html(refundReasonTpl({data: refund_reason_list1}));
            if(type){
                self.config.$refundDiffBox.html(moneyTpl());
                self.config.$refundDiffParent.removeClass('move-down');
                self.config.$deliverStatusDiffParent.removeClass('move-up');
            }

        }
    },
    submitRefund: function () {
        var self = this;
        var formData = JSON.parse(JSON.stringify(this.config.$form.serializeObject()));
        formData.bill_seq_no = seq_no;
        delete formData.file;
        var tempPic = formData.pic_url;
        delete formData.pic_url;
        formData.images = [];
        tempPic && JSON.parse(tempPic).forEach(function(item){
            formData.images.push(item.url);
        });

        //校验不能为空
        for(var i = 0; i < $('input.check').length; i++){
            if($($('input.check')[i]).val() === ''){
                return Util.toast('请填写' + $($('input.check')[i]).data('desc'));
            }
        }
        if(self.config.$inputMoney.val() <= 0){
            return Util.toast('请填写正确的退款金额');
        }
        if(self.config.$inputMoney.val() > total_fee){
            return Util.toast('申请退款金额不能超过' + total_fee + '元');
        }
        var arr = formData.images || [];
        var _hmt = window._hmt || [];

        if (arr && arr.length > 3) {
            if (_hmt) {
                _hmt.push(['_trackEvent', 'publish', 'failed', 'cause img not been uploaded correct']);
            }
            Util.toast('最多上传3张图片');
            return false;
        }

        self.config.$submitBtn.addClass('disabled').attr('disabled', true);

        Service.post('bill/add_refund_request', formData, function (err, data) {
            if (err || !data) {
                self.config.$submitBtn.removeClass('disabled').removeAttr('disabled');
                Util.toast(err.message);
                return false;
            }
            self.config.$successMask.addClass('active');
            setTimeout(function(){
                self.config.$refundTableBox.addClass('active');
            }, 300);
        });
    }
});