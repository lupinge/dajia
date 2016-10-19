var Event = require('lib/event/event.js');
var UUID = require('lib/uuid/uuid.js');

function Uploader (config) {
    var self = this;
    this.config = config || {};
    this.$el = config.$el;
    this.files = {};
    this.requests = {};

    if (config.uploadedFiles) {
        config.uploadedFiles.forEach(function (fileInfo) {
            if (!fileInfo.id) {
                fileInfo.id = UUID.generateUUIDV4();
            }

            fileInfo.status = Uploader.STATUS_SUCCESS;

            self.files[fileInfo.id] = fileInfo;
        });
    }
}

Uploader.ERROR_TYPE = 1;
Uploader.ERROR_MAX_SIZE = 2;
Uploader.ERROR_MAX_COUNT = 3;
Uploader.ERROR_NETWORK = 4;
Uploader.ERROR_SERVER = 5;
Uploader.ERROR_RESPONSE = 6;

Uploader.STATUS_SUCCESS = 0;
Uploader.STATUS_UPLOADING = 1;
Uploader.STATUS_ERROR = -1;
Uploader.STATUS_CANCEL = -2;
Uploader.STATUS_DELETE = -3;

Uploader.prototype = new Event();
Uploader.prototype.constructor = Event;

Uploader.prototype.validate = function (file) {
    var extName = getExtName(file.name.toLowerCase());
    var error = new Error();

    if (this.config.allowTypes && this.config.allowTypes.indexOf(extName) === -1) {
        error.code = Uploader.ERROR_TYPE;
        return error;
    }

    if (this.config.maxSize && file.size && file.size > this.config.maxSize) {
        error.code = Uploader.ERROR_MAX_SIZE;
        return error;
    }

    if (this.config.maxCount && Object.keys(this.files).length >= this.config.maxCount) {
        error.code = Uploader.ERROR_MAX_COUNT;
        return error;
    }
};

Uploader.prototype.upload = function (file) {
    var self = this;
    var validateError = this.validate(file);
    var xhr, fd, params, fileInfo, key;

    fileInfo = {
        id: UUID.generateUUIDV4(),
        name: file.name
    };

    if (validateError) {
        fileInfo.status = Uploader.STATUS_ERROR;
        this.trigger('error', fileInfo, validateError);
        return false;
    }


    xhr = new XMLHttpRequest();
    fd = new FormData();
    params = this.config.params;

    this.files[fileInfo.id] = fileInfo;

    for(key in params) {
        if (params.hasOwnProperty(key)) {
            fd.append(key, params[key]);
        }
    }

    fd.append('file', file);

    xhr.upload.addEventListener('progress', function (e) {
        self.trigger('progress', fileInfo, e.loaded, e.total);
    }, false);

    xhr.addEventListener('load', function (e) {
        var response, info, key, err;

        delete self.requests[fileInfo.id];

        try{
            response = JSON.parse(e.target.responseText);
        } catch (ex) {
            ex.code = Uploader.ERROR_SERVER;
            fileInfo.status = Uploader.STATUS_ERROR;
            self.trigger('error', fileInfo, ex);
            delete self.files[fileInfo.id];
        }

        if (response.error) {
            err = new Error(response.text);
            err.code = Uploader.ERROR_RESPONSE;
            fileInfo.status = Uploader.STATUS_ERROR;
            self.trigger('error', fileInfo, err);
            delete self.files[fileInfo.id];
        } else {
            info = response.info[0];

            for (key in info) {
                if (info.hasOwnProperty(key)) {
                    fileInfo[key] = info[key];
                }
            }
            fileInfo.status = Uploader.STATUS_SUCCESS;
            self.files[fileInfo.id] = fileInfo;

            self.trigger('success', fileInfo);
        }
    }, false);

    xhr.addEventListener('error', function () {
        fileInfo.status = Uploader.STATUS_ERROR;
        self.trigger('error', fileInfo, '网络错误(HTTP '+xhr.status+')');
        delete self.requests[fileInfo.id];
    }, false);

    this.trigger('start', fileInfo);
    xhr.open('POST', this.config.url, true);
    xhr.send(fd);

    fileInfo.status = Uploader.STATUS_UPLOADING;

    this.requests[fileInfo.id] = xhr;
};

Uploader.prototype.cancel = function (id) {
    var xhr = this.requests[id];
    var fileInfo = this.files[id];
    if (!xhr) {
        return;
    }
    xhr.abort();
    fileInfo.status = Uploader.STATUS_CANCEL;
    this.trigger('cancel', fileInfo);
};

Uploader.prototype.deleteFile = function (id) {
    var fileInfo = this.files[id];
    if (this.requests[id]) {
        this.cancel(id);
    }

    if (!fileInfo) {
        return;
    }

    fileInfo.status = Uploader.STATUS_DELETE;

    delete this.files[id];
};

Uploader.prototype.getLength = function () {
    var files = this.files;
    return Object.keys(this.files)
            .filter(function (key) {
                var file = files[key];
                return file.status === Uploader.STATUS_UPLOADING || file.status === Uploader.STATUS_SUCCESS;
            })
            .length;
};

function getExtName (filepath) {
    var RE = /\.(\w*)$/;
    var match = filepath.match(RE);

    if (match) {
        return match[1];
    }

    return '';
}

return Uploader;