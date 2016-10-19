var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/member.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Util        = require('hybrid/common/lib/util/util.js');
var Service     = require('../service/api.js');
var BP          = require('../base_page.js');
var User        = BP.user;
/*style*/
require('../style/style.css');
var $body = $('body');
exports.init = function (config) {
    NativeAPI.invoke('updateTitle',{text:'S会员俱乐部'});
    initData({
        uri:'membership/store',
        params:{
            page:1
        },
        config: config
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

exports.login = function (config) {
    config.$el.on('click', function () {
        User.tryLogin()
            .done(function () {
                Util.redirect(window.location.hash.split('#')[1]);
            }).fail(function (err) {
                if (err.code === -32001) {
                    return;
                }
                return window.alert(err.message);
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

    User.getUserInfo(function (err, userInfo) {
        Service.initData(params,function (err, data) {
            $body.removeClass('loading');
            if (err || !data) {
                Util.toast(err.message);
                return false;
            }
            if (data) {
                data.userInfo = userInfo;
                $body.data('creditInfo', data.credit_info);
                data.is_native = NativeAPI.isSupport();
                $body.append(template(data));
                if (params.config) {
                    var tab = params.config.tab || 0;
                    checkoutTabs(tab);
                }
            }

            Widget.initWidgets();

        });
    });
}

function checkoutTabs(tab) {
    var $billTab = $body.find('[data-role="billTab"]');
    var $billItem = $body.find('[data-role="billItem"]');
    $billTab.removeClass('active')
            .eq(tab).addClass('active');
    $billItem.removeClass('active')
            .eq(tab).addClass('active');
}