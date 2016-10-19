var Cookie = require('lib/cookie/cookie.js');
var Storage = require('lib/storage/storage.js');

function rand(from, to) {
    return from + Math.floor(Math.random() * (to - from + 1));
}

function strrev(s) {
    return String(s).split('').reverse().join('');
}

function add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
        var xi = i < x.length ? x[i] : 0;
        var yi = i < y.length ? y[i] : 0;
        var zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }
    return z;
}

function multiplyByNumber(num, x, base) {
    if (num < 0) {
        return null;
    }
    if (num === 0) {
        return [];
    }

    var result = [];
    var power = x;
    while (true) {
        /* jshint ignore:start */
        if (num & 1) {
            result = add(result, power, base);
        }
        num = num >> 1;
        /* jshint ignore:end */

        if (num === 0) {
            break;
        }
        power = add(power, power, base);
    }

    return result;
}

function parseToDigitsArray(str, base) {
    var digits = str.split('');
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
        var n = parseInt(digits[i], base);
        if (isNaN(n)) {
            return null;
        }
        ary.push(n);
    }
    return ary;
}

function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    if (digits === null) {
        return null;
    }

    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
        // invariant: at this point, fromBase^i = power
        if (digits[i]) {
            outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }

    var out = '';
    for (var i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
    }
    return out;
}

var bigInt = {
    decToHex: function(decStr) {
        var hex = convertBase(decStr, 10, 16);
        return hex ? '0x' + hex : null;
    },
    hexToDec: function(hexStr) {
        if (hexStr.substring(0, 2) === '0x') {
            hexStr = hexStr.substring(2);
        }
        hexStr = hexStr.toLowerCase();
        return convertBase(hexStr, 16, 10);
    }
};

function createUuid() {
    var pre_fix = '0x' + rand(Math.pow(10, 13), Math.pow(10, 14) - 1);

    var tm = +new Date();
    var rm = rand(1000, 9999);

    var str = tm.toString() + rand(1, 9);
    str = strrev(str);
    str = (+str + rm).toString() + rm;

    var p = bigInt.decToHex(str);
    return '' + pre_fix + p;
}

var UUID_NAME = '__utmganji_v20110909';
var STORAGE_NAME = 'GANJI_UUID';
var storage = new Storage(STORAGE_NAME);

function setUuid(uuid) {
    Cookie.set(UUID_NAME, uuid, {
        domain: '.ganji.com',
        expires: 86400 * 365 * 2, // 2 year
        path: '/'
    });

    storage.set(UUID_NAME, uuid);
}

function getUuid() {
    var uuid;
    uuid = Cookie.get(UUID_NAME) || storage.get(UUID_NAME) || createUuid();
    setUuid(uuid);

    return uuid;
}

module.exports = getUuid;