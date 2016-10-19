var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/order_confirm.tpl');
var addressTpl  = require('./template/widget/order_confirm_address.tpl');
var topAddressTpl = require('./template/widget/order_confirm_top_address.tpl');
var olTpl       = require('./template/widget/order_list.tpl');
var orderCoupon = require('./template/widget/order_confirm_coupon.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('./service/api.js');
var Storage     = require('lib/storage/storage.js');
var session     = new Storage('_MEIJIA_MALL_');
var BP          = require('./base_page.js');
var User        = BP.user;
// var UA = BP.ua();
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');
var items = [];
var hasCoupon = false;
var couponNum = 0;
exports.init = function (config) {
    var data = config.items;
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'订单确认'
        }
    );
    if (config.sessionKey) {
        data = session.get(config.sessionKey);
    }
    initData(data);
    Util.listenNativeA($body);
};
function initData(data) {
    if (!data) {
        Util.toast('参数错误，请重试~');
        return false;
    }
    Service.get('user/address_info', {city_data:0}, function (err, addr_data) {
        $body.removeClass('loading');
        if (err || !addr_data) {
            Util.toast(err.message);
            return false;
        }
        $body.append(template({data: data, address: addr_data}));
        Widget.initWidgets();
    });
    // items组织数据
    items = data.map(function (product) {
        return {
            id: product.merchandise_id || product.id,
            quantity: product.quantity,
            sku_code: product.sku_code
        };
    });

}

exports.addressHandel = Widget.define({
    events:{
        'tap [data-role="updateAddress"],[data-role="addAddress"],[data-role="wholeAddress"]': function () {
            this.showMask();
        },
        'should-prefetch': function () {
            this.shouldFetch();
        }
    },
    init: function (config) {
        this.config = config;
        this.preFetch();
        this.hasRender = false;
    },
    showMask: function () {
        var self = this;
        User.tryLogin()
            .done(function () {
                var $mask = $(self.config.mask);
                self.preFetch(function (cityInfo) {
                    self.renderMask(cityInfo);
                    $mask.addClass('active');
                });

            })
            .fail(function (err) {
                Util.toast(err.message);
            });
    },
    preFetch: function (cb) {
        var cityInfo = session.get('_CITY_INFO_');
        if (!cityInfo) {
            this.shouldFetch(cb);
        }
        cb && cb(cityInfo);
    },
    shouldFetch: function(cb) {
        Service
            .get('user/address_info', {city_data: 1})
            .done(function (data) {
                if (data.city_data) {
                    session.set('_CITY_INFO_', data.city_data);
                    cb && cb(data.city_data);
                }
            })
            .fail(function (err) {
                Util.toast(err.message);
            });
    },
    renderMask: function (cityInfo) {
        var data = this.config.$el.data();
        if (!this.hasRender) {
            this.hasRender = true;
            $('#mask')
                .find('[data-role="addressForm"]')
                .append(addressTpl({data: cityInfo}));
        }
        this.config.$el.trigger('addressHandel::show', {cityInfo: cityInfo});
        if (data.addr_info && cityInfo) {
            if (data.addr_info.province) {
                $('.select-province').val(data.addr_info.province).change();
                $('.select-city').val(data.addr_info.city).change();
                $('.select-district').val(data.addr_info.district).change();
            }
            $('.address-input.name').val(data.addr_info.name);
            $('.address-input.tel').val(data.addr_info.phone);
            $('.address-input.street').val(data.addr_info.address);
        }

    }
});

exports.buyForm = Widget.define({
    events:{
        'submit [data-role="addressForm"]': function (e) {
            e.preventDefault();
            var self = this;
            for(var i = 0;i < $('.address-input').length; i++){
                if($($('.address-input')[i]).val() === ''){
                    return Util.toast('请填写' + $($('.address-input')[i]).data('attri'));
                }
            }
            if(!self.validPhone($('.address-input.tel').val())){
                return Util.toast('请填写正确的手机号码');
            }
            var addressParas = this.config.$addressForm.serializeObject();
            Service.post('user/update_address', addressParas, function (err, data) {
                if (err || !data) {
                    Util.toast(err.message);
                    return false;
                }

                if (data) {
                    self.config.$addrWrap.html(topAddressTpl({data: data}));
                    self.renderOl({addr_info: data}, self.items, null);
                    self.config.$mask.removeClass('active');
                    self.config.$displayAddress.data('addr_info', data);
                }
            });
        },
        'submit [data-role="couponForm"]': function (e) {
            e.preventDefault();
            this.submitCouponForm();
        },
        'submit [data-role="form"]': function (e) {
            e.preventDefault();
            var self = this;
            if(this.config.$addrWrap.find('input').val() === ''){
                return Util.toast('请添加地址');
            }

            var parameter = JSON.parse(JSON.stringify(this.config.$form.serializeObject()));
            parameter.items = items;

            this.config.$submit.attr('disabled',true).addClass('disabled');
            if (this.seq_id) {
                this.pay({seq_no: this.seq_id}, parameter);
                return;
            }
            Service.post('bill/add', parameter, function (err, data) {
                if (err || !data) {
                    Util.toast(err.message);
                    self.config.$submit.removeClass('disabled')[0].disabled = false;
                    return false;
                }
                if (data) {
                    self.seq_id = data.seq_no;
                    self.pay(data, parameter);
                }
            });
        },
        'touchend [data-role="closeBtn"]': function (e) {
            e.preventDefault();
            this.hideMask();
        },
        'change [data-role="select"]': function (e) {
            this.selectOnChange($(e.currentTarget));
        },
        'addressHandel::show': function (event, data) {
            if (data && data.cityInfo) {
                this.cityInfo = data.cityInfo;
            }
        },
        'tap [data-role="cancelCouponBox"]': function () {
            this.cancelCouponBox();
        },
        'tap [data-role="couponMask"]': function () {
            this.cancelCouponBox();
        },
        'click .order-confirm-coupon': function () {
            this.showCouponBox();
        },
        'tap .order-coupon-item': function (e) {
            $('.order-coupon-list input').removeAttr('checked');
            $(e.currentTarget).find('input').attr('checked', 'checked');
        },
        'tap [data-role="payBox"]': function (e) {
            this.config.$payBox.find('input').removeAttr('checked');
            $(e.currentTarget).find('input').attr('checked', 'checked');
        }
    },
    init: function (config) {
        this.config = config;
        var self = this;
        this.cityInfo = null;
        this.items = items;
        this.seq_id = null;
        this.address_id = null;
        self.renderOl(null, self.items, null);
        //获取用户地址
        if (config.addrData) {
            self.cityInfo = config.addrData.city_data || null;
            self.renderOl(config.addrData, self.items, null);
            self.config.$addrWrap.html(topAddressTpl({data: config.addrData.addr_info}));
            self.config.$displayAddress.data('addr_info', config.addrData.addr_info);
        }
    },
    pay: function (data, parameter) {
        var seq_no = data.seq_no;
        var toast = Util.toast('支付加载中..', 10000);

        NativeAPI.invoke('pay', {
            seq_id: seq_no,
            pay_type: parameter.pay_type
        }, function (err, data) {
            var url = 'http://' + window.location.host + '/index.html?v='+ Date.now() +'#mall/';
            url += 'order_detail?param=' + JSON.stringify({seq_no:seq_no});
            toast.remove();
            if (err) {
                Util.toast(err.message);
            }else if(data.status_code < 0){
                Util.toast('支付失败');
            }
            window.location.href = url;
        });
    },
    hideMask: function () {
        this.config.$mask.removeClass('active');
    },
    selectOnChange: function ($cur) {
        var optIndex = $cur.find('option:selected').data('optIndex');
        var selectIndex = $cur.parent().index();
        this.appendSelect(optIndex, selectIndex);
    },
    appendSelect: function (optIndex, selectIndex) {
        var optionHTML = '';
        var optionHTMLsec = '';
        if (!this.cityInfo) {
            return false;
        }
        optIndex = optIndex || 0;
        if(selectIndex === 0 ){
            this.cityInfo[optIndex].children.forEach(function(item, index) {
                optionHTML += '<option value="' + item.name + '" data-opt-index="' + index + '" data-parent-index="' + optIndex + '">' + item.name + '</option>';
            });

            this.cityInfo[optIndex].children[0].children.forEach(function(item, index) {
                optionHTMLsec += '<option value="' + item.name + '" data-opt-index="' + index + '">' + item.name + '</option>';
            });

            $('.select-box').eq(selectIndex+1).find('select').html(optionHTML);
            $('.select-box').eq(selectIndex+2).find('select').html(optionHTMLsec);
        }
        if(selectIndex === 1 ){
            var infoIndex = $('.select-box')
                                .eq(selectIndex)
                                .find('option:selected')
                                .data('parentIndex');
            this.cityInfo[infoIndex || 0]
                .children[optIndex]
                .children
                .forEach(function(item, index) {
                optionHTML += '<option value="' + item.name + '" data-opt-index="' + index + '">' + item.name + '</option>';
            });

            $('.select-box')
                .eq(selectIndex+1)
                .find('select')
                .html(optionHTML);
        }
    },
    renderOl: function (data, items, discountId) {
        var self = this;
        // if (data && data.addr_info && data.addr_info.id === this.address_id) {
        //     return;
        // }

        this.address_id = (data && data.addr_info) ? data.addr_info.id : null;
        discountId = discountId ? discountId : '-1';
        Service.get('bill/calc', {contact_addr_id: this.address_id, items:items, discount_id:discountId })
                .done(function (data) {
                    self.config.$orderList.html(olTpl({data: data.merchandise_list, has_coupon: hasCoupon, coupon_num: couponNum}));
                    self.config.$total.text('¥ ' + data.total_fee);
                    self.config.$total.data('total', data.total_fee);
                    //计算订单后更新重置优惠券初始值
                    data.merchandise_list.forEach(function(item){
                        var totalFee = 0;
                        item.items.forEach(function(product){
                            totalFee += product.total_fee;
                        });
                        if(item.discount_info && item.discount_info.id){
                            self.renderCoupon(item.merchant_id, totalFee, item.discount_info.id);
                            hasCoupon = true;
                        }
                    });
                })
                .fail(function(err) {
                    Util.toast(err.message);
                });
    },
    validPhone: function (value) {
        var PHONE_RE = /^1[34578]\d{9}$/;
        return PHONE_RE.test(value);
    },
    renderCoupon: function (merchant_id, total_fee, coupon_id) {
        var self = this;
        Service.get('discount/usable_list_by_merchant', {merchant_id: merchant_id, total_fee: total_fee })
            .done(function (data) {
                couponNum = data.data.length;
                $('.confirm-available-coupon').html(data.data.length + '张可用');
                self.config.$couponContent.html(orderCoupon({data: data.data, coupon_id: coupon_id}));
            })
            .fail(function(err) {
                Util.toast(err.message);
            });
    },
    showCouponBox: function () {
        var self = this;
        this.config.$couponMask.addClass('active');
        setTimeout(function(){
            self.config.$couponMask.addClass('show');
        }, 10);
        this.config.$couponContent.addClass('active');
    },
    cancelCouponBox: function () {
        var self = this;
        this.config.$couponMask.removeClass('show');
        setTimeout(function(){
            self.config.$couponMask.removeClass('active');
        }, 300);
        this.config.$couponContent.removeClass('active');
    },
    submitCouponForm: function () {
        var self = this;
        var couponParas = this.config.$couponForm.serializeObject();
        if(!couponParas.coupon){
            return Util.toast('请选择优惠券~');
        }

        //设置最新的优惠券id
        $('#coupon_id').val(couponParas.coupon);

        if (this.config.addrData) {
            this.renderOl(this.config.addrData, self.items, couponParas.coupon);
        }else{
            Util.toast('请先填写地址~');
        }

        this.config.$couponMask.removeClass('show');
        setTimeout(function(){
            self.config.$couponMask.removeClass('active');
        }, 300);
        this.config.$couponContent.removeClass('active');
    }
});