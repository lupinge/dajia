var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/exchange_page.tpl');
var logTpl      = require('../template/widget/exchange_log.tpl');
var coinTpl     = require('../template/widget/coin_list.tpl');
var storeTpl     = require('../template/widget/store_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var dateformat  = require('lib/dateformat/dateformat.js');
var Service     = require('../service/api.js');
var BP          = require('../base_page.js');
var Dialog      = require('hybrid/common/lib/dialog/dialog.js');
var User        = BP.user;
/*style*/
require('../style/style.css');

var $body = $('body');
exports.init = function () {
    NativeAPI.invoke('updateTitle',{text:'兑换商城'});
    initData({
        uri:'membership/store',
        params:{
            page:1
        }
    });
    $('body').on('click','[data-native-url]', function (e) {
        var $cur = $(e.currentTarget);
        var url = $cur.data('native-url');
        if (!NativeAPI.isSupport()) {
            return Util.redirect(url);
        }
        NativeAPI.invoke('createWebview', {
            url: 'http://'+ window.location.hostname + location.pathname + '#'+ url
        });
    });
};

function initData(params) {
    if (!params) {
        $body.removeClass('loading');
        $body.append(template());
        Widget.initWidgets();
        return;
    }
    User.tryLogin()
        .done(function () {
            Service.initData(params,function (err, data) {
                $body.removeClass('loading');
                if (err || !data) {
                    Util.toast(err.message);
                    return false;
                }
                if (data) {
                    var info = $.extend(data.credit_info, {member:data.member});
                    $body.data('creditInfo', info);
                    $body.append(template(data));
                }
                Widget.initWidgets();
            });
        })
        .fail(function (err) {
            Util.toast(err.message);
            $body.addClass('nothing').removeClass('loading');
        });
}

exports.tab = Widget.define({
    events: {
        'click [data-role="billTab"]': function(event) {
            this.checkoutTabs($(event.currentTarget));
        },
        'change:tab': function (e, data) {
            if (data.tab) {
                this.checkoutTabs(this.config.$billTab.eq(data.tab));
            }
        }
    },
    init: function(config) {
        this.config = config;
    },
    checkoutTabs: function(ct) {
        var self = this;
        var tabIndex = ct.index();
        self.config.$billTab.removeClass('active');
        ct.addClass('active');
        self.config.$billItem.removeClass('active');
        self.config.$billItem.eq(tabIndex).addClass('active');
    }
});

exports.loadMore = BP.loadMore.extend({
    loadMore:function () {
        var self = this;
        var tplMap = {
            'credit_bill/list':logTpl,
            'membership/log':coinTpl,
            'membership/store':storeTpl
        };
        if (self.loading) {
            return;
        }
        self.removeScrollListener();
        self.config.$el.html('加载中...');
        self.loading = true;
        Service.initData({
            uri: self.config.uri,
            params:{
                page: ++self.offset,
                type: self.config.type
            }
        }, function(err, data) {
                if (!err) {
                    self.loadTimes ++;
                    if (data && data.data.length > 0) {
                        if(data.current_page >= data.total_page){
                            self.config.$el.hide();
                        }
                        data.dateformat = dateformat;
                        self.$list.find('ul').append(tplMap[self.config.uri](data));
                        self.loading = false;
                        self.config.$el.html('展开更多<em></em>');
                        if (self.config.scrollAble) {
                            self.listenScroll();
                        }
                    } else {
                        self.config.$el.html('没有更多了');
                    }
                } else {
                    self.config.$el.html('网络好像有问题，稍后再试');
                }
            });
    }
});

exports.renderLog = function (config) {
    var page = config.page || 1;
    Service.initData({
        uri:'credit_bill/list',
        params:{
            page: page
        }
    }, function (err, data) {
        if (err || ! data) {
            return;
        }
        if (data.current_page < data.total_page) {
            config.$load_more.show();
        }
        data.dateformat = dateformat;
        config.$el.find('ul').append(logTpl(data));
    });
};

exports.renderCoin = function (config) {
    var page = config.page || 1;
    Service.initData({
        uri:'membership/log',
        params:{
            page: page,
            type:2
        }
    }, function (err, data) {
        if (err || ! data) {
            return;
        }
        if (data.current_page < data.total_page) {
            config.$load_more.show();
        }
        data.dateformat = dateformat;
        config.$el.find('ul').append(coinTpl(data));
    });
};

exports.exchange = Widget.define({
    events:{
        'click [data-role="now"]': function (e) {
            var $cur = $(e.currentTarget);
            var myCreaditInfo = $cur.data();
            this.creditInfo = $body.data().creditInfo;
            if (!this.creditInfo) {
                return ;
            }
            if (parseInt(this.creditInfo.member, 10) !== 1) {
                var url = 'hybrid/app/my_point/page/member.js?tab=1';
                return Dialog.alert('只有S会员才能兑换奖品噢!<br>' +
                    '<a class="btn-text"  data-native-url="'+
                    url +'">如何成为S会员?</a>');
            }
            if (myCreaditInfo.level > this.creditInfo.currentLevelIndex) {
                var url = 'hybrid/app/my_point/page/index_page.js?tab=1';
                return Dialog.alert('LV.'+
                    myCreaditInfo.level+
                    '及以上才能兑换此奖品噢!<br>'+
                    '<a class="btn-text"  data-native-url="'+
                    url +'">如何升级?</a>');
            }
            if (myCreaditInfo.price > this.creditInfo.totalCredit2) {
                var url = 'hybrid/app/my_point/page/member.js?tab=1';
                return Dialog.alert('对不起，金币不足!<br>'+
                    '<a class="btn-text"  data-native-url="'+
                    url +'">如何赚金币?</a>');
            }
            Dialog.confirm('确定要用<em>'+ myCreaditInfo.price +'</em>金币兑换'+ myCreaditInfo.name + '吗？', {
                yes_btn_text:'确定，去填收货信息',
                no_btn_text:'取消'
            }).then(function (data) {
                if (data.VALUE === data.YES) {
                    myCreaditInfo.$cur = $cur;
                    $('#address').trigger('addressForm::show', myCreaditInfo);
                }
            });
        }
    },
    init: function (config) {
        this.config = config;

    }
});
exports.addressForm = Widget.define({
    events:{
        'addressForm::show': function (events, data) {
            this.config.$el.find('[name="merchandise_id"]').val(data.id);
            this.data = data;
            this.showForm();
        },
        'click [data-role="cancel"]': function () {
            this.hideForm();
        },
        'submit [data-role="form"]': function (e) {
            e.preventDefault();

            if (this.checkForm()) {
                return false;
            }
            var self = this;
            var params = this.config.$form.serializeObject();


            Service.pushData({
                uri:'credit_bill/add',
                params:params
            }, function (err) {
                if (err) {
                    return Util.toast(err.message);
                }
                self.hideForm();
                self.config.$form[0].reset();
                Dialog.alert('兑换成功，金币 -'+ self.data.price +'。稍候有工作人员与您联系。')
                        .then(function () {
                            var creditInfo = $body.data().creditInfo;
                            var num = creditInfo.totalCredit2 - self.data.price;
                            $('.bill-num-text').text(num);

                            self.data.$cur
                                .attr('data-role','pending')
                                .removeClass('exchange-now')
                                .addClass('exchange-pending')
                                .text('申请中');

                            $body.data('creditInfo', $.extend(creditInfo,{
                                totalCredit2: num
                            }));
                        });
                self.$refer.trigger('changeitem::update', self.data);
            });
        },
        'form::error':function (event, config) {
            config.$item.addClass('error').focus();
            if (config.err) {
                Util.toast(config.err);
            }
        },
        'blur input': function (e) {
            var $input = $(e.currentTarget);
            $input.removeClass('error');
        }
    },
    init: function (config) {
        this.config = config;
        this.$refer = $(config.refer);
    },
    showForm: function () {
        this.config.$el.addClass('active');
        $body.on('touchmove',function () {
            return false;
        });
        $body.addClass('form_sticky');
    },
    hideForm: function () {
        $body.removeClass('form_sticky');
        this.config.$el.removeClass('active');
        $body.off('touchmove');
    },
    checkForm: function () {
        var values = this.config.$form.serializeArray();
        var item,$item,rules,err;
        for(var i=0; i < values.length; i++) {
            item = values[i];
            $item  = $('[name="' + item.name + '"]');
            rules  = $item.data().rules;
            if (rules) {
                for(var ii = 0; ii < rules.length; ii++){
                    err = this.validFild(item, rules[ii]);
                    if (err) {
                        this.config.$el.trigger('form::error', {$item:$item, err:err});
                        return err;
                    }
                }
            }
        }
        return err;
    },
    validFild: function (item, rules) {
        var self = this;
        var err = null;
        if (rules && rules.length > 0) {
            if (rules[0] === 'required') {
                if ($.trim(item.value).length <= 0){
                    err = rules[1];
                }
            }
            if (rules[0] === 'phone') {
                if (!self.validPhone(item.value)) {
                    err = rules[1];
                }
            }
        }
        return err;
    },
    validPhone: function (value) {
        var PHONE_RE = /^1[34578]\d{9}$/;
        return PHONE_RE.test(value);
    }
});


