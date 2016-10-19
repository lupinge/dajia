'use strict';
var __session__ = window.sessionStorage;
var session = {
    set: function(key, value) {
        __session__.setItem(key, JSON.stringify(value));
        return session;
    },
    get: function(key) {
        var value = __session__.getItem(key);
        return key && JSON.parse(value);
    },
    remove: function(key) {
        __session__.removeItem(key);
        return session;
    },
    clear: function() {
        __session__.clear();
        return session;
    }
};
module.exports = session;