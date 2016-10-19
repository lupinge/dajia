var $ = require('$');
var Sonic = require('lib/sonic/sonic.js');
var loadingTip = new Sonic({

        width: 55,
        height: 50,

        stepsPerFrame: 1,
        trailLength: 1,
        pointDistance: 0.1,
        fps: 30,
        padding: 10,
        //step: 'fader',

        fillColor: '#f95347',

        setup: function() {
            this._.lineWidth = 10;
        },

        path: [
            ['line', 0, 20, 100, 20],
            ['line', 100, 20, 0, 20]
        ]
    });

exports.remove = function () {
    var $body = $('body');
    $body.removeClass('loading');
    exports.stop();
};
exports.stop = function () {
    loadingTip.stop();
};
exports.add = function () {
    $('.js-loading-tip')
        .append(loadingTip.canvas)
        .data('loadingTip',loadingTip);
    exports.play();
};
exports.play = function () {
    loadingTip.play();
};
