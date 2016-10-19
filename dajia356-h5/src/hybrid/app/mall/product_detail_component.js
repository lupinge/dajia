var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/widget/product_detail_component.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('./service/api.js');
// var UA = BP.ua();
require('./style/style.css');

var $body = $('body');
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'图文详情'
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
        }
        Widget.initWidgets();
    });
}

exports.lazyload = Widget.define({
    init: function (config) {
        this.config = config;
        this.lazyLoad(this.config.$el);
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
            };
            img.src = src;
        });
    }
});