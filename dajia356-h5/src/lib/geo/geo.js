var $ = require('$');
var EventEmiter = require('lib/event/event.js');

exports.getLocation = function (config, callback) {
    var defer = $.Deferred();
    var geoDefer = $.Deferred();
    var geoToCityURL = '/latlng/?format=eval';
    var ipToCityURL = '/latlng/?ac=getCityInfoByIp&rnd=' + Math.random();
    var emiter = new EventEmiter();

    if (typeof config === 'function') {
        callback = config;
        config = {};
    }

    defer
        .done(function (pos) {
            callback(null, pos);
        })
        .fail(function (err) {
            callback(err);
        });

    geoDefer
        .done(function (pos) {
            emiter.emit('getCityInfo');
            $.ajax({
                url: geoToCityURL,
                data: {
                    latlng: pos.coords.latitude + ',' + pos.coords.longitude
                },
                dataType: 'json'
            })
            .done(function (data) {
                if (!data.data || !data.data.cityName || ! data.data.cityDomain) {
                    return callback('geoToCity server error');
                }

                callback(null, {
                    cityName: data.data.cityName,
                    cityDomain: data.data.cityDomain
                });
            })
            .fail(function (err) {
                callback(err);
            });
        })
        .fail(function () {
            emiter.emit('getCityInfo');
            $.ajax({
                url: ipToCityURL,
                timeout: config.timeout,
                dataType: 'json'
            })
            .done(function (data) {
                if (!data.data || !data.data.cityName || ! data.data.cityDomain) {
                    return callback('ipToCity server error');
                }

                callback(null, {
                    cityName: data.data.cityName,
                    cityDomain: data.data.cityDomain
                });
            })
            .fail(function () {
                callback('cannot get location');
            });
        });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            geoDefer.resolve(pos);
        }, function (err) {
            geoDefer.reject(err);
        }, {
            timeout : config.timeout || 10000,
            maximumAge : 60000,
            enableHighAccuracy : true
        });
    } else {
        geoDefer.reject(new Error('api not supported'));
    }

    return emiter;
};