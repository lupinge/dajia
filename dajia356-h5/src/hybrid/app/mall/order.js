var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/order.tpl');
var orderListTpl    = require('./template/widget/order_lists.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('./service/api.js');
var session     = require('lib/storage/sessionStorage.js');
//var session     = new Storage('_MEIJIA_MALL_');
// var UA = BP.ua();
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');
var tabIndex = 0;
var orderStatus = 0;
var page = 0;
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'我的订单'
        }
    );
    initData();
    tabIndex = config.tab ? config.tab : 0;
    Util.listenNativeA($body);
};
function initData() {
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();

    NativeAPI.invoke('updateHeaderRightBtn', {
        action: 'show',
        icon: 'h5_href',
        text: '帮助中心',
        data: {
            url: 'http://' + window.location.host + '/index.html#misc/help_center/help_index'
        }
    });
}

exports.orderHandler = Widget.define({
    events:{
        'click [data-role="pay"]': function () {
            var param = this.config.param;
            this.pay(param);
        },
        'click [data-role="cancelPay"]': function () {
            var param = this.config.param;
            var self = this;
            NativeAPI
                ._invoke('dialog', {type:'confirm',data:{message:'确定要取消订单吗？'}})
                .then(function (data) {
                    if (data.VALUE === data.YES) {
                        self.cancelPay(param);
                    }
                })
                .caught(function (err) {
                    Util.toast(err.message);
                });

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
            //self.config.$el.closest('li').remove();
            self.config.$el.closest('li').find('.order-state').text('订单已取消');
            self.config.$el.remove();
        }).fail(function (err) {
            Util.toast(err.message);
        });
    },
    pay: function (parameter) {
        var url = 'http://' + window.location.host + '/index.html#mall/';
        url +='order_detail?param=' +  JSON.stringify(parameter);
        NativeAPI.invoke('createWebview', {url: encodeURI(url)});
    }
});

exports.loadMore = Widget.define({
    events:{
        'click [data-role="tabItem"]': function (e) {
            this.checkTab($(e.currentTarget));
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.scrollAble = config.scrollAble ? config.scrollAble : false;
        this.listening = false;

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

        this.config.$tabItem.eq(tabIndex).trigger('click');
    },
    checkTab: function ($cur) {
        var self = this;
        page = 1;
        self.listenScroll();

        this.config.$tabItem.removeClass('active');
        $cur.addClass('active');
        orderStatus = $cur.data('state');
        if(session.get( '_MEIJIA_ORDER_STATUS_' + orderStatus + '_')){
            $('.order-list').html(orderListTpl({data: session.get( '_MEIJIA_ORDER_STATUS_' + orderStatus + '_')}));
            $(self.config.loadmore).html('<em></em>正在加载...');
            var tempData = session.get( '_MEIJIA_ORDER_STATUS_' + orderStatus + '_');
            if(tempData.current_page === tempData.page_count){
                self.removeScrollListener();
                $(self.config.loadmore).html('到底了~');
            }
            if(tempData.current_page > tempData.page_count){
                self.removeScrollListener();
                $(self.config.loadmore).html('');
            }
            Widget.initWidgets();
        }else{
            var tabPara = {
                url: 'bill/list',
                para: {
                    page: page,
                    user_status: orderStatus
                }
            };
            Service.get(tabPara.url, tabPara.para, function (err, data) {
                if (err || !data) {
                    Util.toast(err.message);
                    return false;
                }
                if (data) {
                    $('.order-list').html(orderListTpl({data: data}));
                    $(self.config.loadmore).html('<em></em>正在加载...');
                    session.set( '_MEIJIA_ORDER_STATUS_' + orderStatus + '_', data );
                    if (data.current_page < data.page_count) {
                        if (self.config.scrollAble) {
                            self.listenScroll();
                        }
                    }else if(data.current_page > data.page_count){
                        $(self.config.loadmore).html('');
                        self.removeScrollListener();
                    }else{
                        $(self.config.loadmore).html('到底了~');
                        self.removeScrollListener();
                    }
                }
                Widget.initWidgets();
            });
        }
    },
    loadMore: function(){
        var self = this;
        self.removeScrollListener();
        var para = {
            user_status: orderStatus,
            page: ++page
        };

        Service.get('bill/list', para, function (err, data) {
            if (err || !data) {
                Util.toast(err.message);
                return false;
            }

            if(data){
                $('.order-list').append(orderListTpl({data: data}));
                if (data.current_page < data.page_count) {
                    if (self.config.scrollAble) {
                        self.listenScroll();
                    }
                }else{
                    $(self.config.loadmore).html('到底了~');
                    self.removeScrollListener();
                }
            }

        });

    }
});