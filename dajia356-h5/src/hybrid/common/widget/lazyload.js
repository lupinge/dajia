var Widget = require('lib/widget/widget.js');
var $ = require('$');

exports.enableLazyLoad = Widget.define({
    init: function (config) {
        this.config = config;
        var self = this;
        self.lazyLoad(config.$el);
        $(window).on('scroll',function () {
            self.lazyLoad(config.$el);
        });
        config.$el.find('img[data-original]').height(400);
    },
    lazyLoad:function ($el){
        var timer = $el.data('lazyLoadTimer');
        var $wd = $(window);
        var $dom = $(window);
        clearTimeout(timer);
        timer = setTimeout(function () {
            var st = $dom.scrollTop();
            var sh = st + $wd.height();
            var $imgs = $el.find('img[data-original]');
            $imgs.each(function () {
                var $img = $(this);
                var oft = $img.offset().top;
                var src = $img.data('original');
                var alt = $img.data('alt');
                if (oft < sh + 200 && oft > st && src) {
                    var img = new Image();
                    $img.removeAttr('data-original');
                    img.onload = function () {
                        img.onload = null;
                        $img.attr('src', src).addClass('show');
                        $img.attr('alt', alt);
                    };
                    img.src = src;
                }
            });

        }, 10);

        $el.data('lazyLoadTimer', timer);
    }
});