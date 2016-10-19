var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/index.tpl');
var tipsTpl    = require('./template/tips.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var Service     = require('./service/api.js');
// var UA = BP.ua();

/*style*/
require('./style/style.css');
var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'晒呗活动'
        }
    );
    initData();
};
function initData() {
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();
}
exports.prize = Widget.define({
    events:{
        'turntable::end': function (event, data){
            if (data.code !== data.PRIZE_SUCCESS) {
                return Dialog.alert(data.msg);
            }
            var data = data.data;
            var result = parseInt(data.lottery_result, 10);
            var coinsAward = {
                0: 8,
                7: 88,
                8: 18
            };
            this.renderTips(data);
            if ( result === 0 || result === 7 || result === 8) {
                return Dialog.confirm('恭喜抽中'+ coinsAward[result] +'金币！<br /><small>活动期间每天都会赠送抽奖机会哦</small>', {
                    no_btn_text:'再抽一次',
                    yes_btn_text:'去兑换奖品'
                }).then(function (data) {
                    if (data.VALUE === data.NO) {
                        return;
                    }
                    NativeAPI.invoke('createWebview', {url:'http://' + window.location.host +'/index.html#my_point/page/exchange_page'});
                });
            }else {
                var params = $.extend(this.config.userInfo, data);
                if (window.navigator.userAgent.indexOf('Android') > -1){
                    NativeAPI.invoke('createWebview',{
                        url: 'http://' + window.location.host +'/index.html#misc/zhuanpan/address?user_info='+
                             encodeURI(JSON.stringify(params))
                    }, function (err, data) {
                        window.console.log(err, data);
                    });
                }else {
                    window.location.href = '/index.html?v=redirect#misc/zhuanpan/address?user_info='+
                             encodeURI(JSON.stringify(params));
                }
            }
        },
        'turntable::afterLogin': function () {
            this.fetchData();
        },
        'click [data-role="howto"]': function (e) {
            if (!NativeAPI.isSupport()) {
                return true;
            }
            e.preventDefault();
            var $cur = $(e.currentTarget);
            NativeAPI.invoke('createWebview',{url:$cur.attr('href')});

        }
    },
    init: function (config) {
        // var self = this;
        this.config = config;
        this.config.userInfo = null;
        this.fetchData();
    },
    renderTips: function (data) {
        this.config.$tips.html(tipsTpl({data:data}));
        // this.config.$num.text(data.left_chance_count);
        this.config.$tips.show();
    },
    fetchData: function () {
        var self = this;
        Service.get('get_lottery_data', null, function (err, data) {
            self.renderTips(data);
            self.config.userInfo = data;
        });
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
    title: '晒美家，送上海迪士尼乐园两日一夜游套餐！',
    desc: '在「美家」APP内晒出你的家，免费送上海迪士尼乐园套餐，还有更多家居好礼等你来拿～',
    link: 'http://' + window.location.host + '/index.html#misc/zhuanpan/',
    imgUrl: 'http://' + window.location.host + '/dj/hybrid/app/misc/zhuanpan/img/disney.jpg'
});

