var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('hybrid/app/misc/comment/template/index_page.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var User        = require('hybrid/app/misc/youyanji/base_page.js').user;
/*style*/
require('../style/style.css');

exports.init = function () {
    var $body = $('body');
    $body.removeClass('loading');
    $body.append(template());
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'哈哈哈测试啊'
        }
    );
    NativeAPI.invoke('updateHeaderLeftBtn',{
        action: 'show',
        icon: 'back',
        text: '返回',
        data: {
            preventDefault:1
        }
    },function (err, data) {
        if (!err) {
            window.console.log(data);
        }
    });
    $('#checkUpdate').on('click', function  () {
        NativeAPI.invoke('checkUpdate',null);
    });
    NativeAPI.registerHandler('headerLeftBtnClick', function () {
        window.alert('hahahaha');
        NativeAPI.invoke('back',null, function () {
            window.alert('back success');
        });
    });
    var $login = $('#login');
    var $userIfo = $('#userInfo');
    $login.on('click', function () {
        User.tryLogin()
            .done(function (data) {
                $userIfo.html(JSON.stringify(data));
            })
            .fail(function (err) {
                $userIfo.html(JSON.stringify(err));
            });
    });
    Widget.initWidgets();
};
exports.share = Widget.define({
    events: {
        'click': function () {

            NativeAPI.invoke(
                'showShareDialog',
                {
                    title : '美家网',
                    content: '这是一次友好的红红火火',
                    url: window.location.href,
                    img_url:'http://static.dajia365.com/widget/header/img/logo-beta_d1abfcb.png',
                    captureScreen : true
                },
                function (err, data) {
                    if (err) {
                        window.alert(err.message);
                        return;
                    }
                    window.alert(JSON.stringify(data));
                }
            );
        }
    },
    init: function (config) {
        window.console.log(config);
    }
});