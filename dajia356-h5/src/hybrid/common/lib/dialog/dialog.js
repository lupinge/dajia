/*
    @params messge
    @params options
*/

var $ = require('$');
var Promise = require('lib/promise/promise.js');
exports.confirm = function(message, options){
    options = options || {};
    return new Promise(function (res) {
        var $dialog;
        /* jshint ignore: start */
        $dialog = $([
            '<div class="dialog dialog-mask active">',
                '<div class="dialog-confirm">',
                    '<div class="dialog-body">',
                        message,
                    '</div>',
                    '<div class="dialog-bar">',
                        '<button data-role="btn" data-action="no"class="btn btn-cancel thin-border ">',options.no_btn_text || '取消','</button>',
                        '<button data-role="btn" data-action="yes" class="btn btn-confirm offset-left-x">',options.yes_btn_text || '确定','</button>',
                    '</div>',
                '</div>',
            '</div>'
            ].join(''));
        /* jshint ignore: end */
        $dialog.
            one('click', '[data-role="btn"]', function (e) {
                var $btn = $(e.currentTarget);
                if ($btn.data('action') === 'yes') {
                    res({YES:1,NO:0,VALUE:1});
                }else{
                    res({YES:1,NO:0,VALUE:0});
                }
                $dialog.remove();
                $('body').removeClass('dialog-sticky');
            });
        $dialog.appendTo('body');
        $('body').addClass('dialog-sticky');
    });
};
exports.alert = function(message, options){
    options = options || {};
    return new Promise(function (res) {
        var $dialog;
        /* jshint ignore: start */
        $dialog = $([
            '<div class="dialog dialog-mask active">',
                '<div class="dialog-confirm">',
                    '<div class="dialog-body">',
                        message,
                    '</div>',
                    '<div class="dialog-bar">',
                        '<button data-role="btn" data-action="yes" class="btn btn-confirm">',options.yes_btn_text || '确定','</button>',
                    '</div>',
                '</div>',
            '</div>'
            ].join(''));
        /* jshint ignore: end */
        $dialog.
            one('click', '[data-role="btn"]', function () {
                res();
                $dialog.remove();
                $('body').removeClass('dialog-sticky');
            });
        $dialog.appendTo('body');
        $('body').addClass('dialog-sticky');
    });
};