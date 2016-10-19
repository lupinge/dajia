var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/store_coupon.tpl');
var couponListTpl    = require('./template/widget/store_coupon_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
//var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('./service/api.js');
var dateformat  = require('lib/dateformat/dateformat.js');
var BP          = require('./base_page.js');
var User        = BP.user;

/*style*/
require('./style/style.css');

var $body = $('body');
var merchant_id = '';

exports.init = function (config) {
    merchant_id = config.param.merchant_id;
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'店铺优惠券'
        }
    );
    initData({
        uri:'discount/list_by_merchant',
        params: {
            merchant_id: config.param.merchant_id
        }
    });
    Util.listenNativeA($body);
};

function initData(para) {
    Service.get(para.uri, para.params, function (err, data) {
        $body.removeClass('loading');
        if (err || !data) {
            Util.toast(err.message);
            return false;
        }
        $body.append(template({data: data, dateformat: dateformat}));
        Widget.initWidgets();
        if(data.current_page === data.page_count){
            $('#loadmore').html('到底了~');
        }
    });
}

exports.pickupCoupon = Widget.define({
    events:{
        'tap [data-role="couponItem"]': function (e) {
            this.pickupCoupon($(e.currentTarget));
        }
    },
    init: function (config) {
        this.config = config;
    },
    pickupCoupon: function ($cur) {
        User.tryLogin()
            .done(function () {
                if(!$cur.hasClass('active')){
                    Service.post('discount/fetch', {
                        discount_id: $cur.data('couponId')
                    }).done(function () {
                        Util.toast('已领取，快去买买买吧~');
                        $cur.addClass('active');
                        $cur.find('.btn-coupon-collect').html('已领取');
                    }).fail(function (err) {
                        Util.toast(err.message);
                    });
                }
            })
            .fail(function (err) {
                Util.toast(err.message);
            });
    }
});

exports.loadMore = Widget.define({
    init: function (config) {
        var self = this;
        this.config = config;
        this.scrollAble = config.scrollAble ? config.scrollAble : false;
        this.listening = false;
        this.pagenum = 1;

        function onScroll() {
            if ($('body').height() - $(window).height() - $(window).scrollTop() < 50) {
                self.loadMore();
            }
        }

        this.listenScroll = function() {
            if (self.listening) {
                return;
            }
            self.listening = true;
            $(window).on('scroll', onScroll);
        };

        this.removeScrollListener = function() {
            $(window).off('scroll', onScroll);
            self.listening = false;
        };
        if (this.scrollAble) {
            self.listenScroll();
        }
    },
    loadMore: function(){
        var self = this;
        self.removeScrollListener();
        var para = {
            merchant_id: merchant_id,
            page: ++self.pagenum
        };

        Service.get('discount/list_by_merchant', para, function (err, data) {
            if (err || !data) {
                Util.toast('网络好像有问题，稍后再试');
                return false;
            }
            if (data && data.current_page <= data.page_count) {

                if (self.config.scrollAble) {
                    self.listenScroll();
                }

                if(data.current_page === data.page_count){
                    $(self.config.loadmore).html('到底了~');
                    self.removeScrollListener();
                }
            }else{
                $(self.config.loadmore).html('到底了~');
            }
            self.config.$el.append(couponListTpl({data: data, dateformat: dateformat}));
        });

    }
});