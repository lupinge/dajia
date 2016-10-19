var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/product_detail.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('./service/api.js');
var Storage     = require('lib/storage/storage.js');
var session     = new Storage('_MEIJIA_MALL_');
// var UA = BP.ua();
require('hybrid/common/lib/slide/responsiveBanner.js');
//var products = require('./products.json');
//window.console.log(products);
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');
var shareData = {};
var productContent = {};
var scrollFlag = true;
var $body = $('body');
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'商品详情'
        }
    );
    initData({
        uri:'merchandise/detail',
        params: {
            merchandise_id: config.id ? config.id : 1
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

            shareData = {
                title: data.name,
                desc: '我在店铺' + data.merchant_name + '发现了一件好物，快来看看吧~',
                link: window.location.href,
                imgUrl: data.images[0]
            };
            if (NativeAPI.isSupport()) {
                updateRightBtn({product_count:0}, shareData);
            } else {
                shareAPI.registerShare(shareData);
            }

            $('.product-list, .product-list li img').height($('.wrap').width());

            productContent = data.detail;
            if(Util.isPC()){
                $('#image_text').html(productContent).addClass('show');
                scrollFlag = false;
            }else{
                loadContent();
            }
        }
        Widget.initWidgets();
    });


    $(window).on('touchmove', loadContent);
    $(window).on('scroll', loadContent);

    function loadContent(){
        if(scrollFlag && ( $(window).height() + $(window).scrollTop()) >= $('#product_detail_content').offset().top){
            $('#image_text').html(productContent).addClass('show');
            scrollFlag = false;
        }
    }
}
function updateRightBtn (cart,shareData) {
    shareData.url = shareData.link;
    shareData.content = shareData.desc;
    shareData.img_url = shareData.imgUrl;
    NativeAPI.invoke('updateHeaderRightBtn', [{
        action: 'show',
        icon: 'shopping_cart',
        text: '购物车',
        data: cart
    },
    {
        action: 'show',
        icon: 'share',
        text: '分享',
        data: shareData
    }]);
}
exports.responsiveText = function (config) {
    config.$el
    .closest('[data-widget="hybrid/common/lib/slide/responsiveBanner.js"]')
    .on('slideFn::bannerSlide', function (event, data){
        config.$curPage.html(data + 1);
    });
};

exports.topImgLazyload = Widget.define({
    init: function (config) {
        this.config = config;
        this.firstLoad(this.config.$el);
    },
    firstLoad: function ($el) {
        var self = this;
        var $img = $($el.find('img[data-original]')[0]);
        var src = $img.data('original');
        var alt = $img.data('alt');
        var img = new Image();
        $img.removeAttr('data-original');
        img.onload = function () {
            img.onload = null;
            $img.attr('src', src).addClass('show');
            $img.attr('alt', alt);

            self.lazyLoad(self.config.$el);
            //window.console.log('onload-fff 第1张图片已缓存完毕...');
        };
        img.src = src;
    },
    lazyLoad:function ($el){
        var $imgs = $el.find('img[data-original]');
        $imgs.each(function () {
            var $img = $(this);
            var src = $img.data('original');
            var alt = $img.data('alt');
            var img = new Image();
            $img.removeAttr('data-original');
            img.onload = function () {
                img.onload = null;
                $img.attr('src', src).addClass('show');
                $img.attr('alt', alt);

                //window.console.log('onload 第'+ (index+1) +'张缓存完毕...');
            };
            img.src = src;
        });
    }
});

exports.quantityHandel = Widget.define({
    events:{
        'touchend [data-role="reduceBtn"]': function () {
            this.reduceHandel();
        },
        'touchend [data-role="addBtn"]': function () {
            this.addHandel();
        }
    },
    init: function (config) {
        this.config = config;
        this.$reduceBtn = this.config.$reduceBtn;
        this.$numBox = this.config.$numBox;
        this.$addBtn = this.config.$addBtn;
    },
    reduceHandel: function () {
        if(parseInt(this.$numBox.val(), 0) <= 1){
            this.$reduceBtn.addClass('active');
            return;
        }else if(parseInt(this.$numBox.val(), 0) === 2){
            this.$reduceBtn.addClass('active');
            this.$numBox.val(parseInt(this.$numBox.val(), 0) - 1);
        }else{
            this.$numBox.val(parseInt(this.$numBox.val(), 0) - 1);
        }
    },
    addHandel: function () {
        if(!this.$addBtn.hasClass('active')){
            this.$reduceBtn.removeClass('active');
            this.$numBox.val(parseInt(this.$numBox.val(), 0) + 1);
        }
    }
});

exports.skuHandel = Widget.define({
    events:{
        'tap [data-role="optItem"]': function (e) {
            var $cur = $(e.currentTarget);
            this.optHandel($cur);
        }
    },
    init: function (config) {
        this.config = config;
        this.attrValues = this.config
                                .$inputAttributes
                                .val() || [];
        this.skuInfo = JSON.parse(decodeURI(this.config.$el.data('skuInfo')));
        this.skuData = [];
        this.restKey = {};
        this.$discount = $('[data-role="discount"]');

    },
    optHandel: function ($cur) {
        if ($cur.hasClass('disabled')) {
            return false;
        }
        var attrValues = this.attrValues;
        var curData = $cur.data();
        var $curSpans = $cur.parent().find('span.option-item');
        var enableKey =  this.checkSku(curData, this.skuInfo);
        attrValues[curData.index] = curData.value;
        var keystr = enableKey.join('|');
        this.config
            .$optItem
            .not('[data-index="' + curData.index +'"]')
            .forEach(function (item) {
                var $item = $(item);
                $item.removeClass('disabled');
                if (keystr.indexOf($item.data('value')) < 0) {
                    $item.addClass('disabled');
                }
            });
        $curSpans.removeClass('active');
        $cur.addClass('active');

        if(!$cur.hasClass('show')){
            $curSpans.removeClass('show');
        }
        $cur.toggleClass('show');

        this.config
            .$inputAttributes
            .val(JSON.stringify(attrValues));
        this.attrValues = attrValues;
        this.changePrice(attrValues.join(';') + ';');
    },
    checkSku: function (curData, skuInfo) {
        var str = curData.value + ';';
        var keys = this.restKey.keys;
        var myKeys = [];
        keys = Object.keys(skuInfo);
        // if (!this.restKey.keys || curData.index === this.restKey.index ) {
        // }

        myKeys = keys.filter(function(key){
                                if (key.indexOf(str) < 0 ) {
                                    return false;
                                }
                                return true;
                            });
        this.restKey = {
            index: curData.index,
            keys: myKeys
        };
        return myKeys;
    },
    changePrice: function (keystr) {

        if (this.skuInfo[keystr] && this.skuInfo[keystr].price) {
            var price = this.skuInfo[keystr].price;
            this.$discount.text('¥ ' + price);
            return ;
        }
    },
    resetSkuData: function () {
        this.skuData = [];
        for(var i = 0; i < this.config.$optItem.length; i++){
            if($(this.config.$optItem[i]).hasClass('active')){
                this.skuData.push(this.config.$optItem[i].innerText);
            }
        }
        window.console.log(this.skuData);
    }
});

exports.timeCountDown = Widget.define({
    init: function (config) {
        this.config = config;
        this.countDown();
    },
    countDown: function () {
        var $countDownText = this.config.$countDownText;
        function checkTime(i){
            if(i < 10){
                i = '0'+ i;
            }
            return i;
        }
        var timer = setInterval(function timer(){
            var ts = (new Date('2016-06-30 00:00:00')) - (new Date());//计算剩余的毫秒数
            if(ts <= 0){
                clearInt();
                return;
            }
            var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);
            var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);
            var mm = parseInt(ts / 1000 / 60 % 60, 10);
            var ss = parseInt(ts / 1000 % 60, 10);
            // dd = checkTime(dd);
            hh = checkTime(hh);
            mm = checkTime(mm);
            ss = checkTime(ss);
            $countDownText.html('距特卖结束还剩：' + dd + '天' + hh + '时' + mm + '分' + ss + '秒');
        },1000);

        function clearInt(){
            clearInterval(timer);
        }
    }
});

exports.buyForm = Widget.define({
    events:{
        'click [data-role="addCart"]': function (e) {
            e.preventDefault();
            var sku = this.getSku();
            if(!NativeAPI.isSupport()){
                window.location.href = 'http://m.dajia365.com/downapp';
                return;
            }
            if (!sku || this.pending) {
                return;
            }
            this.addCart(this.getSku());
        },
        'submit [data-role="form"]': function (e) {
            e.preventDefault();
            var sku = this.getSku();
            if(!NativeAPI.isSupport()){
                window.location.href = 'http://m.dajia365.com/downapp';
                return;
            }
            var skus = [];
            if (!sku) {
                return false;
            }
            skus.push(sku);
            session.set( '_MEIJIA_SHOPPING_CART_', skus );
            if (NativeAPI.isSupport()) {
                NativeAPI.invoke('createWebview', {url: 'http://' + window.location.host + '/index.html#mall/order_confirm?sessionKey=_MEIJIA_SHOPPING_CART_'});
            }else {
                window.location.href = '/index.html?v='+ Date.now() +
                                    '#mall/order_confirm?sessionKey=_MEIJIA_SHOPPING_CART_';
            }
        },
        'tap [data-role="btnCoupon"]': function (e) {
            var $cur = $(e.currentTarget);
            if (NativeAPI.isSupport()) {
                NativeAPI.invoke('createWebview', {url: $cur.data('href')});
            }else {
                window.location.href = 'http://m.dajia365.com/downapp';
            }
        },
        'tap [data-role="couponMask"]': function () {
            this.cancelCouponBox();
        },
        'click [data-role="closeMask"]': function () {
            this.cancelCouponBox();
        },
        'tap [data-role="showLogistic"]': function () {
            this.showCouponBox();
        }
    },
    init: function (config) {
        this.config = config;
        this.pending = false;
    },
    showCouponBox: function () {
        var self = this;
        this.config.$couponMask.addClass('active');
        setTimeout(function(){
            self.config.$couponMask.addClass('show');
        }, 10);
        this.config.$couponContent.addClass('active');
        $body.addClass('active');
    },
    cancelCouponBox: function () {
        var self = this;
        this.config.$couponMask.removeClass('show');
        setTimeout(function(){
            self.config.$couponMask.removeClass('active');
        }, 300);
        this.config.$couponContent.removeClass('active');
        $body.removeClass('active');
    },
    addCart: function (sku) {
        var self = this;
        if (!sku) {
            return false;
        }
        this.pending = true;
        sku.id = sku.merchandise_id;
        NativeAPI.invoke('addCart', sku, function (err) {
            if (err) {
                Util.toast(err.message);
            }
            self.pending = false;
        });
    },
    getSku: function () {
        var valsStr = this.config.$inputAttributes.val();
        var attrs   = this.config.$inputAttributes.data('attrs');
        var skuMap  = this.config.$inputAttributes.data('sku-map');
        var sku;
        if (!valsStr && skuMap) {
            Util.toast('请选择' + attrs[0].name);
            return false;
        }
        var vals = [];
        if (skuMap && valsStr) {
            vals = JSON.parse(valsStr);
            for (var i = 0; i < attrs.length; i++) {
                if (!vals[i]) {
                    Util.toast('请选择' + attrs[i].name);
                    return false;
                }
            }
        }
        sku = $.extend(this.config.$form.serializeObject(), skuMap[vals.join(';') + ';']);
        return sku;
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