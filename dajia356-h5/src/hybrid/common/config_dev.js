(function () {
    G.config('mobile_domain', 'http://m.dajia365.com');
    G.config('api_domain', 'http://api.haote.dajia365.com');
    G.config('bbs_api_domain', 'http://bbs.dajia365.com');
    G.config('domain', 'http://h5.luping.dajia365.com');
    G.config('store_domain', 'http://payservice.dajia365.com');
    G.config({
        baseUrl: G.config('domain') + '/dj/',
        alias: {
            'zepto': 'lib/zepto/zepto.cmb.js',
            '$': 'lib/zepto/zepto.cmb.js',
            'underscore': 'lib/underscore/underscore.js',
            'widget':'lib/widget/widget.js',
            'webuploader':'lib/webuploader/webuploader.js',
            'promise':'lib/promise/promise.js'
        },
        map: [
            [/^(.*\/dj\/)((.*)\.(js|css|tpl|jcss|jjson))$/, function (url, server, path, filename, ext) {
                var versions = G.config('version') || {};
                var version = versions[path] || G.config('defaultVersion');
                if (path === 'version.js') {
                    return G.config('domain') + '/dj/version.js';
                }
                return server + filename + '.__' + version + '__.' + ext;
            }]
        ],
        enableLocalstorage: false,
        debug: true
    });
})();