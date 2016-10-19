var Widget = require('lib/widget/widget.js');
// var $ = require('$');
var BP = require('./base_page.js');
var User = BP.user;
var Service     = require('./service/api.js');
var Util        = require('hybrid/common/lib/util/util.js');

var PRIZE_SUCCESS = 10000;

module.exports = Widget.define({
    events: {
        'click [data-role="start"]': function () {
            var self = this;
            // var $pointer = this.config.$pointer;

            if (self.requesting) {
                return;
            }
            self.requesting = true;
            var toast = Util.toast('蓄力中...', 100000);
            User.tryLogin(function (err, userInfo) {
                if (err || !userInfo) {
                    toast.remove();
                    return Util.toast(err.message);
                }
                if (userInfo.is_new) {
                    toast.remove();
                    self.config.$el.trigger('turntable::afterLogin', userInfo);
                    return;
                }
                Service.post(
                    'get_lottery_result',
                     null,
                    function (err, data) {
                    toast.remove();
                    if (err) {
                        self.run({
                            code: -1,
                            msg: err.message
                        });
                        return false;

                    }
                    self.run({
                        code: PRIZE_SUCCESS,
                        data: data
                    });
                });
            });
        }
    },
    init: function  (config) {
        this.config = config;
    },
    run: function (data) {
        var base = 360 * 10;
        var deg = 0;
        var self = this;
        var $pointer = this.config.$pointer;
        var map = {
            0: 5,
            1: 1,
            2: 4,
            3: 6,
            4: 3,
            5: 7,
            7: 2,
            8: 0
        };

        if (parseInt(data.code, 10) !== PRIZE_SUCCESS) {
            self.config.$el.trigger('turntable::end', data);
            self.requesting = false;
            return;
        }
        var myData = data.data;
        deg = - (360/8) * map[myData.lottery_result];

        self.config.$pointer
            .one('webkitTransitionEnd', function () {
                var duration = $pointer.css('-webkit-transition-duration');
                data.PRIZE_SUCCESS = PRIZE_SUCCESS;
                self.config.$el.trigger('turntable::end', data);
                $pointer
                    .css('-webkit-transition-duration', '0s')
                    .css('-webkit-transform', 'rotate(0deg)');

                setTimeout(function () {
                    $pointer.css('-webkit-transition-duration', duration);
                    self.requesting = false;
                }, 100);
            })
            .css('-webkit-transform', 'rotate('+(base + deg)+'deg)');
    }
});