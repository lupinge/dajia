var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/detail_page.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Dialog      = require('hybrid/common/lib/dialog/dialog.js');
var dateformat  = require('lib/dateformat/dateformat.js');
//var UA  = require('hybrid/app/bbs/base_page.js').ua();

var Service     = require('../service/api.js');
/*style*/
require('../style/style.css');

var $body = $('body');
exports.init = function (config) {
    var tid = config.tid;
    var page = config.page || 1;
    var louzhu = config.louzhu || 0;
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'帖子详情页'
        }
    );
    if (page <= 1) {
        $body.removeClass('hide-content');
    } else {
        if (!$body.has('hide-content')) {
            $body.addClass('hide-content');
        }
    }
    if (!tid) {
        $body.addClass('offline');
        return false;
    }
    Service.initData({
        page:page,
        tid: tid,
        louzhu_only: louzhu
    },function (err, data) {
        Util.loading.remove();
        if (err || !data) {
            $body.addClass('offline');
            return false;
        }
        data.dateformat = dateformat;
        if (data) {
            data.tid = tid;
            $body.append(template(data));
            if (data.threadInfo.author_id) {
                showAuthor(louzhu);
                showMark(data.threadInfo.is_fav);
            }
            $body.data('operateReply', data.operateReply);
        }
        shareAPI.registerShare({
            title: data.threadInfo.title,
            desc: '这里有很多装修达人分享的经验，快来看看吧！',
            link: G.config('bbs_api_domain') + '/3g-read-run?tid='+ tid,
            imgUrl: data.threadInfo.cover || 'http://' + window.location.host + '/dj/hybrid/app/bbs/img/icon_logo_for_wechat.png'
        });
        exports.registerDel({
            tid:tid
        });
        exports.popImgs();
        Widget.initWidgets();
    });
};
exports.registerDel = function (config) {
    var tid = config.tid;
    $body.
        on('click', '[data-role="deletePost"]', function () {
            Dialog
                .confirm('确定要删除该帖么？')
                .then(function (data) {
                    if (data.VALUE === data.YES) {
                        Service.deletePost({
                            tid: tid
                        }, function (err) {
                            if (err) {
                                Util.toast(err.message);
                                return;
                            }
                            Util.toast('删除成功！');

                            NativeAPI.invoke('closeWebview',
                                null,
                                function(err){
                                    if (err) {
                                        Util.toast(err.message);
                                    }
                                });
                        });
                    }
                });
        })
        .on('click', '[data-role="del"]', function (e) {
            var $item = $(e.currentTarget)
                            .closest('.replies-item');
            var $count = $body.find('[data-role="commentCount"]');
            var pid = $item.data('pid');
            Dialog
                .confirm('确定要删除该帖么？')
                .then(function (data) {
                    if (data.VALUE === data.YES) {
                        Service.deleteReply({
                            pid: pid,
                            tid:tid
                        }, function (err) {
                            if (err) {
                                Util.toast('ERROR:'+ err.message);
                                return;
                            }
                            $item.siblings('hr').remove();
                            $item.remove();
                            $count.text(parseInt($count.text(), 10) - 1);
                            Util.toast('删除成功！');
                        });
                    }
                });
        });
};
function showAuthor (is_louzhu) {
    NativeAPI.invoke('updateHeaderRightBtn',{
        action: 'show',
        icon: 'author',
        text: '楼主',
        data: {
            is_louzhu: is_louzhu
        }
    },function (err) {
        if (err) {
            window.console.log(err);
        }
    });
}
function showMark (is_fav) {
    NativeAPI.invoke('updateHeaderRightBtn',{
        action: 'show',
        icon: 'mark',
        text: '收藏',
        data: {
            has_marked: is_fav || 0
        }
    },function (err) {
        if (err) {
            window.console.log(err);
        }
    });
}
exports.likeBtnHandle = Widget.define({
    events: {
        'click [data-role="likeBtn"]': function(e) {
            var ct = e.currentTarget;
            this.setColor($(ct));
        }
    },
    init: function(config) {
        this.config = config;
    },
    setColor: function (ct){
        ct.find('em').toggleClass('active');
    }
});

exports.bottomBar = Widget.define({
    events: {
        'click [data-role="like"]': function () {
            this.like();
        },
        'click [data-role="reply"]': function () {
            this.reply();
        }
    },
    init: function (config) {
        this.config = config;
        if (NativeAPI.isSupport()) {
            this.nativeBottomInit();
        }else{
            config.$el.show();
        }
        this.fnMap = [
            'like',
            'reply',
            'page'
        ];
    },
    nativeBottomInit: function () {
        var page = this.config.$page.data();
        var like = this.config.$like.data();
        NativeAPI.invoke('bottomFixedBar', {
            type:'forumDetail',
            controls:[
                {
                    name:'like',
                    data:{
                        like_num: like.likeNum,
                        has_liked: like.hasLiked
                    },
                    action: 'show'
                },
                {
                    name:'reply',
                    data:{},
                    action:'show'
                },
                {
                    name:'page',
                    data:{
                        page: page.page,
                        page_count: page.pageCount
                    },
                    action:'show'
                }
            ]
        });
        this.bottomHandler();
    },
    bottomHandler: function () {
        var self = this;
        NativeAPI.registerHandler('bottomFixedBarClick', function (data) {
            if (!isNaN(data.fn_index)) {
                self[self.fnMap[data.fn_index ]](data);
            }
        });
    },
    like: function (data) {
        var tdata = data.data || {};
        if (tdata.code !== 10000) {
            Util.toast(data.msg);
        }
        if (tdata.data) {
            require.async('../template/widget/like_box.tpl', function (template) {
                $('#likeBox').html(template(
                    tdata.data
                ));
            });
        }
    },
    reply: function(data) {
        var tdata = data.data || {};
        if (tdata.code !== 10000) {
            Util.toast(data.msg);
        }
        if (tdata.data) {
            $('#replyList').trigger('bottomBar::updateReply', tdata.data.data);
        }
    },
    page: function (data) {
        var self = this;
        if (NativeAPI.isSupport()) {
            return false;
        }
        Service.page({
            page: data.page
        }, function (err, data) {
            self.renderPage(data);
        });
    },
    renderPage: function (data) {
        $('#replyList').trigger('bottomBar::renderPage', data);
    }
});

exports.replyList = Widget.define({
    events: {
        'click [data-role="like"]': function (event) {
            var $cur = $(event.currentTarget);
            var $item = $cur.closest('.replies-item');
            if (this.like_pending) {
                return;
            }
            this.like({
                type_id: 6,
                from_id: $item.data('pid'),
                for_like: true
            }, $cur);
        },
        // 'click .reply-content': function (event) {
        //     var $cur = $(event.currentTarget).closest('.replies-item');
        //     this.reply({
        //         tid: this.config.tid,
        //         pid:$cur.data('pid'),
        //         reply_user_name: $cur.data('rp-ua')
        //     });
        // },
        'click .reply-btn':function (event) {
            var $cur = $(event.currentTarget).closest('.replies-item');
            this.reply({
                tid: this.config.tid,
                pid:$cur.data('pid'),
                reply_user_name: $cur.data('rp-ua')
            });
        },
        'bottomBar::updateReply': function (event, data) {
            this.updateReply(data);
        },
        'bottomBar::renderPage': function (event, data) {
            this.renderPage(data);
        }
    },
    init: function (config) {
        var self = this;
        this.config = config;
        this.listenFetch();
        this.like_pending = false;
        $(window).on('scroll',function(){
            self.listenFetch();
        });
        $(window).on('touchmove',function(){
            self.listenFetch();
        });
    },
    listenFetch: function () {
        // 上拉
        var pageY = 0;
        if($(document).height() - $(window).height() <= $(window).scrollTop()){
            $(window).one('touchstart', function (event) {
                pageY = event.touches[0].pageY;
            }).one('touchmove',function (event) {
                if ( pageY > 0 && pageY - event.touches[0].pageY > 10) {
                    NativeAPI.invoke('nextpage');
                }
            });
        }
        // 下拉
        if ($(window).scrollTop() === 0) {
            $(window).one('touchstart', function (event) {
                pageY = event.touches[0].pageY;
            }).one('touchmove',function (event) {
                if (pageY >0 && event.touches[0].pageY - pageY > 10 ) {
                    NativeAPI.invoke('lastpage');
                }
            });
        }
    },
    like: function (para, $el) {
        var self = this;
        this.like_pending = true;
        Service.like(para, function (err, data) {
            self.like_pending = false;
            if (err) {
                Util.toast(err.message);
                return false;
            }
            self.renderLike($el, data.data);
        });
    },
    reply:function (para) {
        var self = this;
        Service.reply(para, function (err, data) {
            if (err) {
                return false;
            }
            self.updateReply(data.data);
        });
    },
    updateReply: function (item) {
        var self = this;
        require.async('../template/widget/reply_item.tpl', function (template) {
            self.config.$listWrap.append(template({
                item:item,
                author_id: self.config.authorId,
                dateformat: dateformat,
                operateReply: $body.data('operateReply')
            }));
            self.scrollToComment();
        });
    },
    rederPage: function (page) {
        var self = this;
        var $body = $('body');
        Service.initData({
            page: page,
            tid: self.config.tid
        }, function (err, data) {
            if (err) {
                window.alert(err.msg);
                return false;
            }
            if (page <= 1) {
                $body.removeClass('hide-content');
            } else {
                if (!$body.has('hide-content')) {
                    $body.addClass('hide-content');
                }
            }
            self.renderList(data.replyList);
        });
    },
    renderList: function (replyList) {
        var self = this;
        require.async('../template/widget/reply_list.tpl', function (template) {
            self.config.$listWrap.html(template({
                replyList: replyList,
                author_id: self.config.authorId,
                dateformat:dateformat
            }));
        });
    },
    renderLike: function ($el, data) {
        if ($el.hasClass('active')) {
            $el.removeClass('active').find('.like-text').html('点赞');
        }else {
            $el.addClass('active').find('.like-text').html(data.like_count);
        }
    },
    scrollToComment : function () {
        var offset = this.config.$listWrap.offset();
        var pos = offset.top + offset.height - $(window).height();
        $('body').scrollTop(pos);
    }

});
exports.popImgs = function () {
    $body.on('click','.post-content img.J_post_img', function (e) {
        var $cur = $(e.currentTarget);
        var $imgs = $cur.closest('.post-content')
                        .find('img.J_post_img');
        var cur_index = 0;
        var imgs = $imgs.map(function(index, item) {
            if ($cur.attr('src') === $(item).attr('src')) {
                cur_index = index;
            }
            return $(item).attr('src');
        });
        NativeAPI.invoke('checkBigPicture', {
            images: imgs,
            current_index: cur_index
        });
    });
};