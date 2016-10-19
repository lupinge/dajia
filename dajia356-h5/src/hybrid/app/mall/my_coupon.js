var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/my_coupon.tpl');
var myCouponListTpl    = require('./template/widget/my_coupon_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
//var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('./service/api.js');
var dateformat  = require('lib/dateformat/dateformat.js');
// var UA = BP.ua();

/*style*/
require('./style/style.css');

var $body = $('body');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'我的优惠券'
        }
    );
    initData({
        uri:'discount/list',
        params: {
            expire: 0,
            page: 1
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
        $body.append(template({data: data.data, dateformat: dateformat}));
        Widget.initWidgets();
        if(data.current_page === data.page_count){
            $('#loadmore').remove();
        }
    });
}

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
            expire: 0,
            page: ++self.pagenum
        };

        Service.get('discount/list', para, function (err, data) {
            if (err || !data) {
                Util.toast('网络好像有问题，稍后再试');
                return false;
            }
            if (data && data.current_page <= data.page_count) {

                if (self.config.scrollAble) {
                    self.listenScroll();
                }

                if(data.current_page === data.page_count){
                    $(self.config.loadmore).remove();
                    self.removeScrollListener();
                }
            }else{
                $(self.config.loadmore).remove();
            }
            self.config.$el.append(myCouponListTpl({data: data.data, dateformat: dateformat}));
        });

    }
});