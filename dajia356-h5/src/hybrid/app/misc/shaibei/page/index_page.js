var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/index_page.tpl');
var likeListTpl = require('../template/like_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('../service/api.js');
var BP = require('../base_page.js');
var User = BP.user;
var UA = BP.ua();
var USER_MUST_LOGIN = 11001;
/*style*/
require('../style/style.css');

var $body = $('body');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'晒呗活动'
        }
    );
    initData('/list',{
        order:2,
        page:1,
        activity_id:1
    });
    var is_pending = false;
    $body.on('tap', '[data-role="like"]', function (e) {
        var $cur = $(e.currentTarget);
        var count = parseInt($cur.text(), 10);
        if (is_pending || $cur.hasClass('active')) {
            return;
        }
        Service.post('/like', {
            shaibei_id: $cur.data('id'),
            action: 'add'
        }, function (err) {
            if (err) {
                if (err.code === USER_MUST_LOGIN) {
                    tryLogin();
                    return;
                }
                Util.toast(err.message);
                return;
            }
            if (count >= 0) {
                if (!$cur.hasClass('active')) {
                    $cur.html('<em></em>' + (count + 1))
                        .addClass('active');
                    return;
                }

                if($cur.hasClass('active')) {
                    Util.toast('取消点赞');
                    $cur.html('<em></em>' + (count - 1))
                        .removeClass('active');
                    return;
                }
            }
        });
    }).on('tap', '[data-role="tutor"]', function () {
        window.location.hash='tutor';
    });
    $(window).on('hashchange', function () {
        var hash = window.location.hash.replace(/^#/,'');
        if (hash === 'tutor') {
            $('.btn-join-activity').addClass('active');
            $('.all-content').addClass('active');
            $('.teach-content').addClass('active');
            $('html,body').scrollTop(0);
        }else{
            $('.btn-join-activity').removeClass('active');
            $('.all-content').removeClass('active');
            $('.teach-content').removeClass('active');
        }
    });
};
function initData(uri, params) {
    if (!params) {
        $body.removeClass('loading');
        $body.append(template({data:{}}));
        Widget.initWidgets();
        return;
    }

    Service.get(uri, params,function (err, data) {
        $body.removeClass('loading');
        if (err || !data) {
            Util.toast(err.message);
            return false;
        }
        data.is_native = NativeAPI.isSupport();
        if (data) {
            $body.append(template(data));
        }
        Widget.initWidgets();
    });
}

exports.showDetailRules = Widget.define({
    events: {
        'click': function() {
            this.showDetail();
        }
    },
    init: function(config) {
        this.config = config;
        this.flag = true;
    },
    showDetail: function (){
        var self = this;
        if(this.flag){
            this.flag = false;
            self.config.$el.html('收起<em></em>');
            self.config.$el.find('em').addClass('active');
        }else{
            this.flag = true;
            self.config.$el.html('查看全部<em></em>');
            self.config.$el.find('em').removeClass('active');
        }
        $(self.config.moreRules).toggleClass('active');
    }
});

exports.redirect = function (config) {
    var _hmt = window._hmt || {};
    config.$el.on('click', function () {
        if (_hmt) {
            _hmt.push(['_trackEvent', 'participate']);
        }
        Util.redirect('hybrid/app/misc/youyanji/page/pub_page.js');
    });
};

shareAPI.registerShare({
    title: '晒出家居好物，送你空气净化器/投影仪/净水器等家居好礼',
    desc: '晒出家居好物，我们准备了总价值2万元的家居好礼作为奖品，就等你拿啦。',
    link: 'http://' + window.location.host + '/dj/hybrid/common/index.html#hybrid/app/misc/shaibei/page/index_page.js',
    imgUrl: 'http://' + window.location.host + '/dj/hybrid/app/misc/shaibei/img/icon_logo_for_wechat.png'
});

exports.likeList = Widget.define({
    events:{

    },
    init: function (config) {
        this.config = config;
        this.timer = null;
        this.offset = 1;
        this.$contentBox = $('.content');
        this.initData();
        if (BP.ua().isWeixin || $.os.android ) {
            var self = this;
            this.config.$load.css('margin-bottom', '50px');
            setTimeout(function () {
                self.listenScrollLoad();
            }, 300);
            return false;

        }
        this.listenTouch();

    },
    fetch: function (page, callback) {
        var self = this;
        Service.get('/list', {
            order:1,
            page: page || 1,
            activity_id:1
        }, function (err, data) {
            if (err) {
                self.config.$load.html('网络好像有问题，稍后再试');
                return Util.toast(err.message);
            }
            if (!data.data || data.data.length <= 0 || data.current_page > data.page_count){
                // Util.toast('没有了～');
                self.fixed = true;
            } else {
                data.is_native = NativeAPI.isSupport();
                callback(data);
            }
        });
    },
    render: function (data) {
        this.config.$list.append(likeListTpl(data));
    },
    resetOffset: function () {
        $('.content').css('-webkit-transform','translateY('+ 0 +'px)');
        $('.content').css('transform','translateY('+ 0 +'px)');
        this.config.$load.html('^……^晒好物赢大奖，你也来晒呗');
    },
    fixOffset: function () {
        this.$contentBox.css('-webkit-transform','translateY('+ -50 +'px)');
        this.$contentBox.css('transform','translateY('+ -50 +'px)');
        this.config.$load.html('<em></em>晒好物赢大奖，你也来晒呗');
    },
    listenTouch: function () {
        var self = this;
        this.config.$el.on('touchstart', function (e) {
            self.startY = e.touches[0].clientY;
        })
        .on('touchmove', function (e) {
            var windowHeight = window.screen.height;
            var top = $(window).scrollTop();

            self.Y = e.touches[0].clientY - self.startY;
            self.shouldFetch = false;
            if (!self.fixed && self.Y > -60 && $('body').height() - windowHeight - top < 1) {
                self.$contentBox.css('-webkit-transform','translateY('+ self.Y +'px)');
                self.$contentBox.css('transform','translateY('+ self.Y +'px)');
                self.config.$load.html('^……^晒好物赢大奖，你也来晒呗');
                self.shouldFetch = false;
            }
            if (self.Y < -120) {
                self.$contentBox.css('-webkit-transform','translateY('+ self.Y < -120 ? -120 : self.Y+'px)');
                self.$contentBox.css('transform','translateY('+ self.Y < -120 ? -120 : self.Y+'px)');
                self.config.$load.html('^----^松手加载～');
                self.shouldFetch = true;
            }
        })
        .on('touchend', function () {
            var windowHeight = window.screen.height;
            var top = $(window).scrollTop();

            if (self.shouldFetch && self.Y < -30 && !self.fixed && $('body').height() - windowHeight - top < 1) {
                self.fixed = true;
                self.fixOffset();
                self.fetch(++self.offset, function (data) {
                    self.fixed = false;
                    self.resetOffset();
                    self.render(data);
                });
            }else{
                self.resetOffset();
            }

        });
    },
    listenScrollLoad: function() {
        var self = this;
        var windowHeight = $(window).height();
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
        this.listenScroll();
    },
    loadMore: function() {
        var self = this;
        if (self.loading) {
            return;
        }
        self.removeScrollListener();
        self.loading = true;
        self.fetch(++self.offset, function(data) {
            self.loading = false;
            self.listenScroll();
            self.render(data);
        });
    },
    initData: function () {
        var self = this;
        self.fetch(1, function (data) {
            self.render(data);
        });
    }
});
exports.join = function (config) {
    var $dialog = $('#dialog_dir');
    config.$el.on('click', function () {
        if (NativeAPI.isSupport()) {
            $dialog.addClass('active');
            return false;
        }
    });
    $dialog.on('click', function (e) {
        var $cur = $(e.target);
        if ($cur.hasClass('active')) {
            $cur.removeClass('active');
        }
    });
};
function tryLogin () {
    if (NativeAPI.isSupport()) {
        User.tryLogin()
            .done(function () {
                Util.reload();
            })
            .fail(function () {
                window.alert('登陆失败～');
            });
    }else if (UA.isWeixin) {
        window.location.href = G.config('bbs_api_domain') + '/app-index-login?app=account&type=weixinexpress&backUrl=' + encodeURIComponent(window.location.href) +'?tryLogin="1"';
    } else {
        window.location.href = G.config('bbs_api_domain') + '/3g-login-run?backurl=' + encodeURIComponent(window.location.href + '?tryLogin="1"');
    }
}
