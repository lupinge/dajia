var $           = require('$');
var Widget      = require('lib/widget/widget.js');
var template    = require('./template/shop_cart.tpl');
var NativeAPI   = require('hybrid/common/lib/native/native.js');
//var Util        = require('hybrid/common/lib/util/util.js');
//var Service     = require('./service/api.js');
// var UA = BP.ua();
/*style*/
require('./style/style.css');
//var Dialog      = require('hybrid/common/lib/dialog/dialog.js');

var $body = $('body');

exports.init = function () {
    NativeAPI.invoke(
        'updateTitle',
        {
            text:'购物车'
        }
    );
    initData();
};
function initData() {
    $body.removeClass('loading');
    $body.append(template());
    Widget.initWidgets();
}

exports.quantityHandel = Widget.define({
    events:{
        'touchend [data-role="reduceBtn"]': function () {
            this.reduceHandel();
        },
        'touchend [data-role="addBtn"]': function () {
            this.addHandel();
        }
    },
    init: function (config) {
        this.config = config;
        this.$reduceBtn = this.config.$reduceBtn;
        this.$numBox = this.config.$numBox;
        this.$addBtn = this.config.$addBtn;
    },
    reduceHandel: function () {
        if(parseInt(this.$numBox.html(), 0) <= 1){
            this.$reduceBtn.addClass('active');
            return;
        }else if(parseInt(this.$numBox.html(), 0) === 2){
            this.$reduceBtn.addClass('active');
            this.$numBox.html(parseInt(this.$numBox.html(), 0) - 1);
        }else{
            this.$numBox.html(parseInt(this.$numBox.html(), 0) - 1);
        }
    },
    addHandel: function () {
        this.$reduceBtn.removeClass('active');
        this.$numBox.html(parseInt(this.$numBox.html(), 0) + 1);
    }
});

exports.selectHandel = Widget.define({
    events:{
        'click [data-role="storeCheckBox"]': function (e) {
            this.AllSelect($(e.currentTarget));
        },
        'click [data-role="productCheckBox"]': function (e) {
            this.cancelAllSelect($(e.currentTarget));
        }
    },
    init: function (config) {
        this.config = config;

    },
    AllSelect: function ($cur) {
        if($cur.attr('checked') === true){
            this.config.$productCheckBox.prop('checked', true);
        }else{
            this.config.$productCheckBox.prop('checked', false);
        }
    },
    cancelAllSelect: function ($cur) {
        if($cur.attr('checked') === false){
            this.config.$storeCheckBox.prop('checked', false);
        }
    }
});


// exports.allSelectHandel = Widget.define({
//     events:{
//         'click [data-role="allSelect"]': function (e) {
//             this.AllSelect($(e.currentTarget));
//         }
//     },
//     init: function (config) {
//         this.config = config;

//     },
//     AllSelect: function ($cur) {

//     }
// });