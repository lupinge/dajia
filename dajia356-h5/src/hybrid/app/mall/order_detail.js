var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/order_detail.tpl');
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
            text:'订单详情'
        }
    );
    initData(config.param);
};
function initData(param) {
    Service.get('bill/info', {
        bill_seq_no: param.seq_no
    }, function (err, data) {
        $body.removeClass('loading');
        if (err) {
            Util.toast(err.message);
            $body.addClass('offline');
            return;
        }
        $body.append(template({data:data, dateformat: dateformat}));
        Widget.initWidgets();
    });
    Util.listenNativeA($body);
}
exports.orderHandler = Widget.define({
    events:{
        'click [data-role="pay"]': function () {
            var param = this.config.param;
            param.pay_type = this.config.$el.find('input[name="pay_type"]:checked').val();
            this.pay(param);
        },
        'click [data-role="cancelPay"]': function () {
            var param = this.config.param;
            this.cancelPay(param);
        }
    },
    init: function (config) {
        this.config = config;
    },
    cancelPay: function (parameter) {
        var self = this;
        Service.post('bill/cancel', {
            bill_seq_no: parameter.seq_no
        }).done(function (data) {
            Util.toast('已取消' + data);
            self.config.$el.remove();
        }).fail(function (err) {
            Util.toast(err.message);
        });
    },
    pay: function (parameter) {
        var toast = Util.toast('支付加载中..', 10000);
        NativeAPI.invoke('pay', {
            seq_id: parameter.seq_no,
            pay_type: parameter.pay_type //默认支付宝
        }, function (err) {
            toast.remove();
            if (err) {
                Util.toast(err.message);
            }
            var url = 'http://' + window.location.host + '/index.html?vv='+ Date.now() +'#mall/';
            url += 'order_detail?param=' + JSON.stringify({seq_no:parameter.seq_no});
            window.location.href = url;
        });
    }
});
exports.addressHandel = Widget.define({
    events:{
        'tap [data-role="updateAddress"],[data-role="addAddress"]': function () {
            this.showMask();
        }
    },
    init: function (config) {
        this.config = config;
    },
    showMask: function () {
        var $mask = $(this.config.mask);
        $mask.addClass('active');
    }
});

exports.loadChat = Widget.define({
    events:{
        'tap': function () {
            this.loadChat();
        }
    },
    init: function(config) {
        this.config = config;
    },
    loadChat: function () {
        var self = this;
        if(!NativeAPI.isSupport()){
            window.location.href = 'http://m.dajia365.com/downapp';
            return;
        }
        NativeAPI.invoke(
            'loadChat',
            {
                user_id: self.config.userId,
                merchant_id: self.config.merchantId
            }
        );
    }
});

exports.createNativeView = Widget.define({
    events:{
        'tap [data-role="item"]': function (e) {
            this.createNativeView($(e.currentTarget));
        }
    },
    init: function(config) {
        this.config = config;
    },
    createNativeView: function ($cur) {
        var product_id = $cur.data('id');
        var href = 'http://' + window.location.host + '/index.html?data=' + Date.now() + '#mall/product_detail?id=' + product_id;
        if(!NativeAPI.isSupport()){
            window.location.href = href;
            return;
        }

        NativeAPI.invoke('getDeviceInfo', null, function(err, deviceInfo) {
            if(err || !deviceInfo.h5_api_version || deviceInfo.h5_api_version < 2.5) {
                NativeAPI.invoke('createWebview', {url: href});
                return;
            }else{
                NativeAPI.invoke(
                    'createNativeView',
                    {
                        name: 'goods',
                        data: {
                            id: product_id
                        }
                    }
                );
            }
        });

    }
});