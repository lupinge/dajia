var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/address.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('../service/api.js');
// var BP          = require('../base_page.js');
var Dialog      = require('hybrid/common/lib/dialog/dialog.js');
// var User        = BP.user;
/*style*/
require('../style/style.css');

var $body = $('body');
exports.init = function () {
    NativeAPI.invoke('updateTitle',{text:'活动奖品兑换'});
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();
};
exports.addressForm = Widget.define({
    events:{
        'submit [data-role="form"]': function (e) {
            e.preventDefault();

            if (this.checkForm()) {
                return false;
            }
            var self = this;
            var params = this.config.$form.serializeObject();


            Service.pushData({
                uri:'credit_bill/add',
                params:params
            }, function (err) {
                if (err) {
                    return Util.toast(err.message);
                }
                self.config.$form[0].reset();
                Dialog.alert('奖品兑换成功O(∩_∩)O,稍后会有工作人员与你联系滴~')
                        .then(function () {
                            NativeAPI.invoke('closeWebview');
                        });
            });
        },
        'form::error':function (event, config) {
            config.$item.addClass('error').focus();
            if (config.err) {
                Util.toast(config.err);
            }
        },
        'blur input': function (e) {
            var $input = $(e.currentTarget);
            $input.removeClass('error');
        }
    },
    init: function (config) {
        this.config = config;
    },
    checkForm: function () {
        var values = this.config.$form.serializeArray();
        var item,$item,rules,err;
        for(var i=0; i < values.length; i++) {
            item = values[i];
            $item  = $('[name="' + item.name + '"]');
            rules  = $item.data().rules;
            if (rules) {
                for(var ii = 0; ii < rules.length; ii++){
                    err = this.validFild(item, rules[ii]);
                    if (err) {
                        this.config.$el.trigger('form::error', {$item:$item, err:err});
                        return err;
                    }
                }
            }
        }
        return err;
    },
    validFild: function (item, rules) {
        var self = this;
        var err = null;
        if (rules && rules.length > 0) {
            if (rules[0] === 'required') {
                if ($.trim(item.value).length <= 0){
                    err = rules[1];
                }
            }
            if (rules[0] === 'phone') {
                if (!self.validPhone(item.value)) {
                    err = rules[1];
                }
            }
        }
        return err;
    },
    validPhone: function (value) {
        var PHONE_RE = /^1[34578]\d{9}$/;
        return PHONE_RE.test(value);
    }
});


