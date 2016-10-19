function Storage (namespace) {
    this.namespace = namespace;
}

Storage.prototype.set = function (key, value) {
    var data = this.dump();

    data[key] = {
        value: value
    };

    data = JSON.stringify(data);

    try {
        localStorage.setItem(this.namespace, data);
    } catch (ex) {
        return false;
    }

    return localStorage.getItem(this.namespace) === data;
};

Storage.prototype.get = function (key) {
    var data = this.dump();

    if (data[key]) {
        return data[key].value;
    }

    // else return undefined;
};

Storage.prototype.remove = function (key) {
    this.set(key, undefined);
};

Storage.prototype.clear = function () {
    localStorage.removeItem(this.namespace);
};

Storage.prototype.dump = function () {
    var data = localStorage.getItem(this.namespace) || '{}';

    try {
        data = JSON.parse(data);
    } catch (ex) {
        data = {};
    }
    return data;
};

module.exports = Storage;