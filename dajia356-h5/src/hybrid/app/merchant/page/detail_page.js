var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/detail_page.tpl');
var commentTpl  = require('../template/widget/comment_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('../service/api.js');

//var dateformat  = require('lib/dateformat/dateformat.js');
//var UA  = require('hybrid/app/bbs/base_page.js').ua();

/*style*/
require('../style/style.css');

var SUCCESS_CODE = 10000;
var REPLY_TYPE_C = 1;
var REPLY_TYPE_RP = 2;
var REPLY_TYPE_R = 3;
var LIMIT_COMMENT_COUNT = 1000;
var _ = require('underscore');

exports.init = function (config) {
    var $body = $('body');
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'商家详情'
        }
    );
    if (!config.merchant_id) {
        $body.addClass('offline');
        return;
    }
    Service.fetchDetail({
        merchant_id: config.merchant_id
    },function (err, data) {
        $body.removeClass('loading');
        if (err) {
            $body.addClass('offline');
            return;
        }
        $body.append(template(data));
        Widget.initWidgets();
        shareAPI.registerShare({
            title: data.merchant_info.name +'-美家',
            desc: '我在美家发现了一家很不错的店，给你看看~',
            link: G.config('mobile_domain') + '/merchant/detail-'+ config.merchant_id + '.html',
            imgUrl: 'http://' + window.location.hostname + '/dj/hybrid/app/misc/youyanji/img/icon_logo_for_wechat.png'
        });
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
        this.render = _.template(config.$template.html());
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
        self.loading = true;
        self.getData(++self.offset, function(err, data) {
            if (!err) {
                self.loadTimes ++;
                if (data && data.length !== 0) {
                    if(data.length < 20){
                        self.config.$el.hide();
                    }
                    self.$list.append(
                        self.render({
                            'posts': data
                        })
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
    },
    getData: function(query, callback) {
        var self = this;
        $.ajax({
            url: self.config.ajaxUrl,
            data: {
                page: query
            },
            beforeSend: function() {
                self.config.$loadMore.html('加载中...');
            },
            dataType: 'json'
        }).done(function(data) {
            callback(null, data.data);
        }).fail(function() {
            callback(new Error('network error!'));
        });
    }
});

exports.commentList = Widget.define({
    events: {
        'click [data-role="commentItem"]': function (e) {
            var $cur = $(e.currentTarget);
            if (this.closeComment) {
                return false;
            }
            if (!this.isLogin) {
                window.location.href = this.config.loginUrl;
                return false;
            }
            this.$commentWrap.trigger('comment::show', {
                para: $cur.data('params'),
                $referEl: $cur,
                replyType: REPLY_TYPE_RP
            });
        },
        'click [data-role="replyItem"]': function (e) {
            var $cur = $(e.currentTarget);
            if (this.closeComment) {
                return false;
            }
            if (!this.isLogin) {
                window.location.href = this.config.loginUrl;
                return false;
            }
            this.$commentWrap.trigger('comment::show', {
                para: $cur.data('params'),
                $referEl: $cur,
                replyType: REPLY_TYPE_R
            });
        },
        'click [data-role="commentScore"] a': function(e){
            var $cur = $(e.currentTarget);
            this.getScoreComment($cur.data('score'));
            this.setActive($cur);
        },
        'touchend [data-role="expand"]': function(e) {
            var $cur = $(e.currentTarget);
            this.showMore($cur);
        }
    },
    init: function (config) {
        this.config = config;
        // 暂时关闭评论
        this.closeComment = true;
        this.showCommentList();
        this.$commentWrap = $('#comment-mask');
        this.isLogin = !$.isArray(config.userInfo);
    },
    showCommentList: function () {
        var self = this;
        var $commentList = this.config.$commentItems;
        Service.getComments({
            merchant_id: self.config.merchantId,
            score: 0,
            page:1
        }, function (err, data) {
            if (err) {
                Util.toast(err.msg);
                return;
            }
            if (data.data && data.data.length > 0) {
                $commentList.html(commentTpl({
                    data: data.data,
                    author_id: data.author_id
                }));
                self.config.$el.show();
            }
        });
    },
    getScoreComment: function(score){
        var self = this;
        var $commentItems = self.config.$commentItems.find('[data-role="commentItem"]');
        var score = score || 0;

        if (parseInt(score, 10) === 0 ) {
            $commentItems.show();
            return;
        }
        $commentItems
            .hide()
            .filter('[data-score="'+ score +'"]')
            .show();

    },
    setActive: function($ct){
        var self = this;
        self.config
            .$commentScore
            .find('a')
            .removeClass('active');
        $ct.addClass('active');
    },
    showMore: function ($cur) {
        var $content = $cur.prev('p');
        setTimeout(function () {
            $content.toggleClass('hide');
            $cur.html($content.hasClass('hide') ? '展开<em></em>' : '收起<em></em>');
        }, 300);
    }
});

exports.commentControl = Widget.define({
    events: {
        'comment::show': function (event, data) {
            var self = this;
            this.referData = data;
            this.commentShow();
            $(this.config.refer).hide();
            window.history.pushState(
                    {isHide: true},
                    document.title,
                    window.location.href + '#comment');
            $(window).on('popstate', function() {
                self.commentHide();
            });
        },
        'click [data-role=send]': function () {
            this.sendComment();
        },
        'click [data-role="cancel"]': function () {
            this.commentHide();
        },
        'input [data-role="comment"]': function() {
            this.setRed();
        },
        'blur [data-role="comment"]': function () {
            $('body').off('touchmove');
        },
        'focus [data-role="comment"]': function () {
            $('body').on('touchmove', function () {
                return false;
            });
        }
    },
    init: function (config) {
        this.config = config;
        this.isLogin = config.isLogin || false;
        this.placeholder = config.$comment.attr('placeholder');
    },
    commentShow: function () {
        $('html').addClass('html-color');
        if (this.referData.replyType !== REPLY_TYPE_C) {
            this.config.$comment
                .attr('placeholder', '回复：' + this.referData.para.nickname);
        }
        this.config
            .$comment.focus();
    },
    commentHide: function () {
        $('html').removeClass('html-color');
        this.config.$comment
                    .attr('placeholder', this.placeholder)
                    .val('')
                    .blur();

        this.config.$send
                .removeClass('send-on');
        $(this.config.refer).trigger('comment::hide');
        $('body')
            .scrollTop(this.referData.$referEl.offset().top);

        $(window).on('popstate');
    },
    sendComment: function () {
        var self = this;
        var comment = this.trimer(this.config.$comment.val());
        var para = this.referData.para;

        if (comment.length > LIMIT_COMMENT_COUNT) {
            return window.alert('字数超过最大限制，请再精简' +
                 (comment.length - LIMIT_COMMENT_COUNT) +
                 '个字');
        }
        if (!this.config.$send.hasClass('send-on')) {
            return;
        }

        para = $.extend({
            comment: self.trimer(comment)
        }, para);

        this.ajaxSendComment(
            '/merchant_comment/add',
            para,
            function (err, data) {
                if (err) {
                    return;
                }
                if (data) {
                    self.rederCommentItem(data);
                }
            }
        );
    },
    rederCommentItem: function (data) {
        var compiled;
        var tpl = $('#commentTpl').html();
        var appendTools = 'after';
        var $wrap = $('#commentWrap').find('dl > dt');

        var type = this.referData.replyType;

        if (type !== REPLY_TYPE_C) {
            tpl = $('#replyTpl').html();
            appendTools = 'append';

            $wrap = this.referData
                .$referEl
                .closest('dd')
                .find('[data-role="replyBox"]');
            if ($wrap.hasClass('hide')){
                $wrap.removeClass('hide');
            }
        }
        compiled = _.template(tpl);
        $wrap[appendTools](compiled({
            data: data
        }));
        this.commentHide();
    },
    ajaxSendComment : function (url, para, callback) {
        $.ajax({
            url: url || 'merchant_comment/add',
            data: para,
            type: 'post',
            dataType: 'json',
            success: function (obj) {
                if( typeof obj !== 'undefined' && obj.code === SUCCESS_CODE) {
                    callback(null, obj.data);
                } else {
                    window.alert(obj.msg);
                }
            }
        });
    },
    setRed: function() {
        var val = $.trim(this.config.$comment.val());
        var $send = this.config.$send;
        if(val){
            if (!$send.hasClass('send-on')) {
                $send.addClass('send-on');
            }
        }else{
            $send.removeClass('send-on');
        }
    },
    trimer: function (comment) {
        return $.trim(comment).replace(/\r\n/g,'\n')
                        .replace(/\r/g,'\n')
                        .replace(/\n\n+/g,'\n\n');
    }
});

exports.showCommentBox = Widget.define({
    events: {
        'click': function() {
            var $cur = $('#commentWrap');
            if (!this.isLogin) {
                window.location.href = this.config.loginUrl;
                return false;
            }
            $(this.config.refer)
                .trigger('comment::show', {
                    para:{
                        merchant_id: $cur.data('merchant-id')
                    },
                    $referEl: $cur,
                    replyType: REPLY_TYPE_C
                });
        },
        'comment::hide': function () {
            this.config.$el.show();
        }
    },
    init: function(config) {
        this.config = config;
        this.isLogin = !$.isArray(config.userInfo);
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