var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/index_page.tpl');
var moreTpl    = require('../template/widget/more_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
//var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('../service/api.js');

//var dateformat  = require('lib/dateformat/dateformat.js');
//var UA  = require('hybrid/app/bbs/base_page.js').ua();

/*style*/
require('../style/style.css');
var $body = $('body');
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'找商家'
        }
    );
    NativeAPI.invoke('back');
    Service.initData({
        page: config.page || 1,
        type: config.type || 0
    },function (err, data) {
        if (err) {
            $body.addClass('offline');
            return;
        }
        $body.removeClass('loading');
        data.type = config.type || 0;
        $body.append(template(data));
        exports.registerAClick();
        Widget.initWidgets();
    });
};
exports.registerAClick = function () {
    if (!NativeAPI.isSupport()) {
        return;
    }
    $body.on('click','ul#list li.merchant-item > a', function (e) {
        var $cur = $(e.currentTarget);
        e.preventDefault();
        NativeAPI.invoke('createWebview',{
            url: 'http://' + window.location.hostname + $cur.attr('href')
        });
        return false;
    });
};

exports.loadMore = Widget.define({
    events: {
        'tap': function() {
            this.loadMore();
        },
        'touchend': function(e) {
            e.preventDefault();
        }
    },
    init: function(config) {
        var self = this;
        var windowHeight = window.screen.height;
        this.render = moreTpl;
        this.config = config;
        this.offset = 1;
        this.scrollAble = config.scrollAble ? config.scrollAble : false;
        this.listening = false;
        this.$list = $(self.config.refor);
        this.loadTimes = 0;
        function onScroll() {
            var top = $(window).scrollTop();
            if ($('body').height() - windowHeight - top < 50) {
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
        if (config.scrollAble) {
            self.listenScroll();
        }
    },
    loadMore: function() {
        var self = this;
        if (self.loading) {
            return;
        }
        self.removeScrollListener();
        self.config.$loadMore.html('加载中...');
        self.loading = true;
        Service.initData({
            page: ++self.offset,
            type: self.config.type
        }, function(err, data) {
            if (!err) {
                self.loadTimes ++;
                if (data && data.merchants.length > 0) {
                    if(data.length < 20){
                        self.config.$el.hide();
                    }
                    self.$list.append(
                        self.render(data)
                    );
                    self.loading = false;
                    self.config.$loadMore.html('点击查看更多');
                    if (self.config.scrollAble && self.loadTimes < 3) {
                        self.listenScroll();
                    }
                } else {
                    self.config.$loadMore.html('更多商家，敬请期待');
                }
            } else {
                self.config.$loadMore.html('网络好像有问题，稍后再试');
            }
        });
    }
});
exports.setPlace = Widget.define({
    events: {
        'click': function() {
            window.alert('更多城市陆续开通中,敬请期待');
        }
    },
    init: function(config) {
        this.config = config;
    }
});
exports.tab = Widget.define({
    events:{
        'click [data-role="tab"]': function (e) {
            var $cur = $(e.currentTarget);
            e.preventDefault();
            this.renderContent($cur);
            return false;
        }
    },
    init: function (config) {
        this.config = config;
        this.catche = {};
    },
    renderContent: function ($cur) {
        var $content = $('.content');
        var self  = this;
        var type = $cur.data('type');
        self.config.$tab.removeClass('active');
        $cur.addClass('active');
        if (this.catche[type]) {
            this.render($cur, $content, this.catche[type]);
            return;
        }
        $content.html('');
        $body.addClass('loading');
        Service.initData({
            page:1,
            type: type

        }, function (err, data) {
            if (err) {
                $body.addClass('offline');
                return;
            }
            self.catche[type] = data;
            self.render($cur, $content, data);
        });
    },
    render:function ($cur, $content, data) {
        $body.removeClass('loading');
        data.type = $cur.data('type');
        require.async('hybrid/app/merchant/template/widget/merchant_list.tpl', function (tpl) {
            $content.html(tpl(data));
            if ($('.load-more').length > 0) {
                Widget.initWidget('.load-more');
            }
        });
    }

});