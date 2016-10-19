G.config({
    baseUrl: '',
    map: [
        [/\/ng\/(.*\.(js|css))$/, function (url, path) {
            var versions = G.config('version') || {};
            var version = versions[path];
            var expire = G.config('expire') || 604800;
            var now = Date.now() / 1000;

            if (!version) {
                version = parseInt(now - (now % expire), 10);
            }
            return url + '?v=' + version;
        }]
    ]
});