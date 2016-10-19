var JSON_RPC_ERROR = {
    PARSE_ERROR: {
        code: -32700,
        message: 'Parse error'
    },
    INVALID_REQUEST: {
        code: -32600,
        message: 'Invalid Request'
    },
    METHOD_NOT_FOUND: {
        code: -32601,
        message: 'Method not found'
    },
    INVALID_PARAMS: {
        code: -32602,
        message: 'Invalid params'
    },
    INTERNAL_ERROR: {
        code: -32603,
        message: 'Internal error'
    }
};
var Promise = require('lib/promise/promise.js');
var methods = {};
var callbacks = {};
var idCounter = 1;
var isSupportNativeAPI = true;

var onMessage = function (message) {
    window.console.log('native -> javascript: ' + message);
    try {
        message = message.replace(/(\r|\n)/g, '\\r\\n');
        message = JSON.parse(message);
    } catch (ex) {
        return send({
            jsonrpc: '2.0',
            error: JSON_RPC_ERROR.PARSE_ERROR,
            id: null
        });
    }

    if (message.method) {
        executeMethod(message);
    } else if (message.id) {
        handleCallback(message);
    }
};

window.DJNativeAPI = window.DJNativeAPI || {};
if (!window.DJNativeAPI.send) {
    (function () {
        var buffer = [];

        if (/com.youwe.dajia/.test(window.navigator.userAgent)) {
            var timer = setTimeout(function () {
                buffer.forEach(handleInternalError);
                window.DJNativeAPI.send = handleInternalError;
            }, 3000);

            window.addEventListener('WebViewJavascriptBridgeReady', function () {

                clearTimeout(timer);

                window.DJNativeAPI.onMessage = onMessage;
                setTimeout(function () {
                    buffer.forEach(function (item) {
                        window.DJNativeAPI.send(item);
                    });
                }, 10);
            }, false);
            window.DJNativeAPI.send = function (message) {
                buffer.push(message);
            };
            return;
        }
        isSupportNativeAPI = false;
        window.DJNativeAPI.send = handleInternalError;
    })();
}

window.DJNativeAPI.onMessage = onMessage;


function send (message) {
    window.console.log('javascript -> native: ' + JSON.stringify(message));
    window.DJNativeAPI.send(JSON.stringify(message));
}

function executeMethod (message) {
    var fn = methods[message.method];

    if (!fn) {
        send({
            jsonrpc: '2.0',
            error: JSON_RPC_ERROR.METHOD_NOT_FOUND,
            id: message.id || null
        });
        return;
    }
    setTimeout(function () {
        try {
            fn(message.params, function (err, result) {
                if (!message.id) {
                    return;
                }

                if (err) {
                    send({
                        jsonrpc: '2.0',
                        error: {
                            code: err.code,
                            message: err.message
                        },
                        id: message.id
                    });
                } else {
                    send({
                        jsonrpc: '2.0',
                        result: result,
                        id: message.id
                    });
                }
            });
        } catch (ex) {
            send({
                jsonrpc: '2.0',
                error: {
                    code: ex.code || -32000,
                    message: ex.message
                },
                id: message.id
            });
        }
    }, 0);
}

function handleCallback (message) {
    var callback = callbacks[message.id];
    callbacks[message.id] = null;

    if (!callback) {
        return;
    }
    setTimeout(function () {
        callback(message.error || null, message.result);
    }, 0);
}

function handleInternalError(message) {
    try {
        message = JSON.parse(message);
    } catch (ex) {
        return;
    }
    if (message.id) {
        handleCallback({
            jsonrpc: '2.0',
            error: JSON_RPC_ERROR.INTERNAL_ERROR,
            id: message.id
        });
    }
}

exports.registerHandler = function (name, fn) {
    methods[name] = fn;
};

exports.invoke = function (method, params, callback) {
    var message = {
        jsonrpc: '2.0',
        method: method,
        params: params
    };
    var id;

    if (callback) {
        id = 'jsonp_' + idCounter;
        idCounter++;

        callbacks[id] = callback;
        message.id = id;
    }

    send(message);
};

exports._invoke = function (method, params) {
    var invoke = exports.invoke;
    return new Promise(function (res, rej) {
        invoke(method, params, function (err, data) {
            if (err) {
                return rej(err);
            }
            res(data);
        });
    });
};
exports.isSupport = function () {
    return isSupportNativeAPI;
};

Object.keys(JSON_RPC_ERROR).forEach(function (key) {
    exports[key] = JSON_RPC_ERROR[key];
});