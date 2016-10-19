var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/store.tpl');
var storeListTpl    = require('./template/widget/store_product_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('./service/api.js');
// var UA = BP.ua();

/*style*/
require('./style/style.css');

var $body = $('body');
var store_id = 0;


exports.init = function (config) {
    store_id = config.id;
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'店铺页'
        }
    );
    initData({
        uri:'merchant/index',
        params: {
            merchant_id: config.id ? config.id : 1
        }
    });
    Util.listenNativeA($body);
};
function initData(params) {
    if (!params) {
        $body.removeClass('loading');
        $body.append(template());
        return;
    }
    Service.get(params.uri, params.params, function (err, data) {
        $body.removeClass('loading');
        if (err || !data) {
            Util.toast(err.message);
            return false;
        }
        if (data) {
            $body.append(template({data: data}));
            shareAPI.registerShare({
                title: data.name,
                desc: '我在美家APP发现了一家好店，里面有不少好东西，快来看看吧~',
                link: window.location.href,
                imgUrl: data.avatar
            });
        }
        Widget.initWidgets();
    });
}

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

exports.navHandel = Widget.define({
    events: {
        'tap': function (e) {
            this.hrefToCoupon(e);
        }
    },
    init: function(config) {
        this.config = config;
        this.config.$el.navigator();
    },
    hrefToCoupon: function (e) {
        var href = this.config.href;
        if (NativeAPI.isSupport()) {
            e.preventDefault();
            NativeAPI.invoke('createWebview', {url: href});
            return false;
        }else{
            window.location.href = 'http://m.dajia365.com/downapp';
        }
    }

});

exports.loadMore = Widget.define({
    events:{
        'tap [data-role="item"]': function (e) {
            this.createNativeView($(e.currentTarget));
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.scrollAble = config.scrollAble ? config.scrollAble : false;
        this.listening = false;
        this.pagenum = 0;

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
        this.loadMore();
    },
    loadMore: function(){
        var self = this;
        self.removeScrollListener();
        var para = {
            merchant_id: store_id,
            page: ++self.pagenum
        };

        Service.get('merchandise/list', para, function (err, data) {
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
            self.config.$el.append(storeListTpl({data: data}));

            $('.tag-list-img').height($('.tag-list li').width());
        });
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