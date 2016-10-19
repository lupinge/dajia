var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('../template/pub_page.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Service     = require('../service/api.js');
var Base        = require('hybrid/app/misc/youyanji/base_page.js');
var shareAPI    = require('hybrid/app/misc/youyanji/widget/share.js');
var UA          = Base.ua();
var User        = Base.user;
var Util      = require('hybrid/common/lib/util/util.js');
var ERROR_NOT_LOGIN = 11001;
/*style*/
require('../style/style.css');

exports.init = function (config) {
    var $body = $('body');
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'点评油烟机赢自拍神器'
        }
    );
    Service.initDataBrand(function (err, data) {
        $body.removeClass('loading');
        if (err) {
            if (ERROR_NOT_LOGIN === err.code) {
                if (config.tryLogin) {
                    $body.addClass('offline');
                    return;
                }
                tryLogin();
            }else {
                $body.addClass('offline');
            }
            return;
        }
        $body.append(template({brandData:data}));
        Widget.initWidgets();
    });
    shareAPI.registerShare({
        title: '吐槽或推荐油烟机，赢烤箱和自拍神器啦 - 美家网',
        desc: '国庆送礼啦！写抽油烟机点评，赢取烤箱和自拍神器！不管是推荐还是吐槽都是可以滴~',
        link: 'http://' + window.location.hostname + '/dj/hybrid/common/index.html#hybrid/app/misc/youyanji/page/index_page.js',
        imgUrl: 'http://' + window.location.hostname + '/dj/hybrid/app/misc/youyanji/img/icon_logo_for_wechat.png'
    });
};
exports.selectBrand = Widget.define({
    events: {
        'click [data-role="brandSelectBox"]': function() {
            this.showBrandBox();
            return false;
        },
        'click [data-role="brandslist"] li': function(e) {
            var ct = e.currentTarget;
            this.setBrandName($(ct));
        }
    },
    init: function(config) {
        this.config = config;
        $(document).bind('click',function(){
            config.$brandslist.removeClass('active');
            config.$iArr.removeClass('active');
        });
    },
    showBrandBox: function (){
        var self = this;
        self.config.$brandslist.toggleClass('active');
        self.config.$iArr.toggleClass('active');

    },
    setBrandName: function (ct){
        var self = this;
        self.config.$brandname.text(ct.find('span').text());
        self.config.$brandIdInput.val(ct.find('span').data('pid'));
        self.config.$brandslist.removeClass('active');
        self.config.$iArr.removeClass('active');

        if(ct.find('span').text() === '其他'){
            self.config.$userWriteBrand.addClass('active');
            self.config.$selectBrandDesc.text('您添加的品牌是库里没有的，等待审核通过将会显示');
            self.config.$brandNameInput.val('');
        }else{
            self.config.$userWriteBrand.removeClass('active');
            self.config.$selectBrandDesc.text('如无您要点评的品牌，请选 “ 其他 ” 分类');
        }

    }
});

exports.selectComment = Widget.define({
    events: {
        'click span': function(e) {
            var ct = e.currentTarget;
            this.setColor($(ct));
        }
    },
    init: function(config) {
        this.config = config;
    },
    setColor: function (ct){
        var self = this;
        self.config.$el.find('span').removeClass('active');
        ct.toggleClass('active');
        self.config.$commentMarkInput.val(ct.data('commentmark'));
    }
});

exports.checkWordNum = Widget.define({
    events: {
        'input [data-role="textArea"]': function() {
            this.setNumColor();
        }
    },
    init: function(config) {
        this.config = config;
    },
    setNumColor: function (){
        var self = this;
        var textLen = self.config.$textArea.val().length;
        self.config.$wordsNum.text(textLen);
        if(textLen > 49){
            self.config.$wordsNum.addClass('active');
        }else{
            self.config.$wordsNum.removeClass('active');
        }
    }
});

exports.checkForm = Widget.define({
    events: {
        'submit [data-role="pushForm"]': function(e) {
            e.preventDefault();
            this.submit();
            var _hmt = window._hmt || {};
            if (_hmt) {
                _hmt.push(['_trackEvent', 'publish']);
            }
            //return(this.checkInfo());
        }
    },
    init: function(config) {
        this.config = config;
        document.body.onbeforeunload = function(){
            event.returnValue='你还没有发布点评';
        };
    },
    checkInfo: function (){
        var self = this;
        document.body.onbeforeunload = function(){
            return;
        };
        if(self.config.$brandIdInput.val() === ''){
            window.alert('请填写品牌~');
            return false;
        }
        if(self.config.$brandIdInput.val() === '0' && self.config.$brandNameInput.val() === ''){
            window.alert('请手动填写其他品牌~');
            return false;
        }
        if(self.config.$commentMarkInput.val() === ''){
            window.alert('您还没有选择评级哦~');
            return false;
        }
        if(self.config.$textArea.val().length < 50){
            window.alert('评价内容至少50个字~');
            return false;
        }
        return true;
    },
    submit: function (){
        var formData = this.config.$pushForm.serializeObject();
        var arr = formData.pic_url && JSON.parse(formData.pic_url);
        var _hmt = window._hmt || {};
        if (!arr || (arr && arr.length < 2)) {
            if (_hmt) {
                _hmt.push(['_trackEvent', 'publish', 'failed', 'cause img not been uploaded correct']);
            }
            window.alert('请上传至少两张图片！');
            return false;
        }
        formData.pic_url = arr;
        if(this.checkInfo()){
            Service.add(
                formData,
                function(err, data){
                    if (err) {
                        var code = err.code && parseInt(err.code, 10);
                        if (_hmt) {
                            _hmt.push(['_trackEvent', 'publish', 'failed', 'cause service error']);
                        }
                        if (ERROR_NOT_LOGIN === code) {
                            tryLogin();
                        }else {
                            window.alert(err.msg);
                        }
                    }else{
                        if (data) {
                            if (_hmt) {
                                _hmt.push(['_trackEvent', 'publish', 'success']);
                            }
                            var data = JSON.stringify(data);
                            data = encodeURIComponent(data);
                            Util.redirect('hybrid/app/misc/youyanji/page/share_page.js?brandData='+ data);
                        }
                    }
                });
        }
    }
});

function tryLogin () {
    if (NativeAPI.isSupport()) {
        User.tryLogin()
            .done(function () {
                exports.init({tryLogin:true});
            })
            .fail(function () {
                window.alert('登陆失败～');
            });
    }else if (UA.isWeixin) {
        window.location.href = 'http://bbs.dajia365.com/app-index-login?app=account&type=weixinexpress&backUrl=' + encodeURIComponent(window.location.href) +'?tryLogin="1"';
    } else {
        window.location.href = 'http://bbs.dajia365.com/3g-login-run?backurl=' + encodeURIComponent(window.location.href + '?tryLogin="1"');
    }
}
