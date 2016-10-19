var $           = require('$');
var template    = require('../template/index_page.tpl');
var pointTpl    = require('../template/widget/point_list.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
var Widget      = require('lib/widget/widget.js');

var Util        = require('hybrid/common/lib/util/util.js');
var BP          = require('../base_page.js');
var dateformat  = require('lib/dateformat/dateformat.js');

var Service     = require('../service/api.js');
var User        = BP.user;
/*style*/
require('../style/style.css');

var $body = $('body');
exports.init = function (config) {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'积分与等级'
        }
    );
    initData({
        uri:'membership/my_info',
        params:null,
        config:config
    });
};

function initData(params) {
    if (!params) {
        $body.removeClass('loading');
        $body.append(template());
        return;
    }
    User.getUserInfo(function (err, userInfo) {
        if (err || !userInfo) {
            window.alert(err.message);
            // return;
        }
        Service.initData(params,function (err, data) {
            $body.removeClass('loading');
            if (err || !data) {
                Util.toast(err.message);
                return false;
            }
            if (data) {
                data.userInfo   = userInfo;
                data.dateformat = dateformat;
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
exports.loadMore = BP.loadMore.extend({
    loadMore:function () {
        var self = this;
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
                        if(data.current_page - data.page_size >= 0){
                            self.config.$el.hide();
                        }
                        data.dateformat = dateformat;
                        self.$list.append(pointTpl(data));
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
function checkoutTabs(tab) {
    var $billTab = $body.find('[data-role="billTab"]');
    var $billItem = $body.find('[data-role="billItem"]');
    $billTab.removeClass('active')
            .eq(tab).addClass('active');
    $billItem.removeClass('active')
            .eq(tab).addClass('active');
}