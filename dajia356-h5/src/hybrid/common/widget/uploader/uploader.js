/*
 * @Copyright   : Copyright 2015, dajia365.com
 * @Descript    : 上传图片插件
 * @Author      : zhaofei@youwei.me
 */

var $ =           require('$');
var Widget =      require('widget');
var Util = require('hybrid/common/lib/util/util.js');
var WebUploader = require('lib/webuploader/webuploader.js');
var HttpAPI = require('hybrid/common/lib/http_api/http_api.js');
var BaseAPI = new HttpAPI({
    path: '/',
    domain: G.config('mobile_domain')
});

// var TOCKEN_ERROR_NOTLOGIN = 11001;
var UPLOAD_SUCCESS = 10000;
var noPreviewImg = '/dj/hybrid/common/image/no-preview.png';
var errorImg = '/dj/hybrid/common/image/1px_png.png';
var ATTACH_CONFIG = {
    type: 1,
    uploadUrl: 'http://up.qiniu.com/',
    modifyUrl: 'http://up.qiniu.com/',
    deleteUrl:  'qiniu/delete',
    tokenUrl:  'qiniu/token',
    token: '',
    attachnum : 4,
    size: 10,//10M
    list : {},
    key: {},
    imgType : {
        'jpg'  : '20480',
        'jpeg' : '20480',
        'png'  : '20480',
        'gif'  : '20480',
        'bmp'  : '20480'
    },
    postData : {},
    thumb:{
        width: 670,
        height: 280
    }
};
exports._super = Widget.define({
    init:function (config) {
        var self = this;
        this.config = config;
        this.$el = config.$el;
        this.attachConfig = $.extend(ATTACH_CONFIG, config.attachConfig);

        this.file_tokens = [];
        this.new_file_count = 0;
        this.file_list = this.attachConfig.list;
        this.thumbWidth = this.attachConfig.thumb.width || 100;
        this.thumbHeight = this.attachConfig.thumb.height || 100;

        this.initUploader && this.initUploader();

        this.uploader = WebUploader.create($.extend({
            auto: false,
            server:self.attachConfig.uploadUrl,
            pick:{
                id: config.pickId || '#add_button',
                multiple: config.isMultiple || false
            },
            compress: false,
            duplicate:false,
            thumb:{
                width: self.thumbWidth * (window.devicePixelRatio || 1),
                height:self.thumbHeight * (window.devicePixelRatio || 1),
                quality:90,
                allowMagnify:false,
                crop: self.attachConfig.thumb.crop || false,
                type:''
            },
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        }, this.config.uploaderConf));
        if (this.config.pickIds && this.config.pickIds.length) {
            $.each(config.pickIds, function (index, item) {
                self.uploader.addButton(item);
            });
        }
        this.listenUpload();
    },
    listenUpload: function () {
        var self = this;
        this.uploader
            .on('beforeFileQueued', function (file) {
                return self.beforeFileQueued(file);
            })
            .on('filesQueued', function (files) {
                return self.filesQueued(files);
            })
            .on('uploadBeforeSend', function (object, data) {
                return self.uploadBeforeSend(object, data);
            })
            .on('uploadProgress', function (file, percentage) {
                self.uploadProgress(file, percentage);
            })
            .on('uploadSuccess', function (file, response) {
                self.uploadSuccess(file, response);
            })
            .on('uploadError', function (file, reason, error) {
                self.uploadError(file, reason, error);
            });
    }
});

exports.upload = exports._super.extend({
    initUploader: function () {
        this.config.uploaderConf = {
            compress: false,
            duplicate: true,
            prepareNextFile:true
        };
    },
    beforeFileQueued: function (file) {
        var ext = this.extensions(file.name);
        var tip = '';
        var invalid = false;
        var imgType = this.attachConfig.imgType;
        var resetCount = 0;
        var invalidCode = 0;
        if (!ext) {
            Util.toast('图片格式不支持！');
            return false;
        }
        var allowSize = !!imgType[ext] ?  parseInt(imgType[ext], 10) * 1024 : 2048 * 1024;

        this.new_file_count ++ ;
        resetCount = this.getRestCount();

        if(resetCount >= 0) {
            if(allowSize && file.size > allowSize) {
                tip = '大小超限制('+ allowSize/1024 +'kb)';
                invalidCode = 10001;
                invalid = true;
                this.new_file_count--;
            }else if(!allowSize) {
                tip = '不允许上传此类型文件';
                invalidCode = 10002;
                invalid = true;
                this.new_file_count--;
            }else {
                invalid = false;
                this.makeThumb(file);
                file.ext = ext;
            }
        } else {
            tip = '一次只允许上传'+ this.attachConfig.attachnum +'张照片';
            invalidCode = 10003;
            this.new_file_count = this.attachConfig.attachnum;
            invalid = true;
        }

        if (invalid) {
            Util.toast(tip, 1000);
            this.excInvalid && this.excInvalid(invalidCode);
            return false;
        }
        return true;
    },
    filesQueued: function (files) {
        var self = this;
        var webupload = this.uploader;
        var token_params = { upload_files: {} };
        var Md5s = [];
        var j = 0;
        for (var i in files) {
            Md5s.push(
                webupload.md5File(files[i])
                .then(function (val) {
                    token_params.upload_files[files[j].id] = {
                        'name': val + '.' + files[j].ext,
                        'size': files[j].size
                    };
                    j++;
                }));
        }
        $.when.apply($, Md5s)
            .done(function () {
                token_params = $.extend(token_params, self.attachConfig.postData);
                token_params.type = self.attachConfig.type;
                BaseAPI.request(
                    'POST',
                    null,
                    self.attachConfig.tokenUrl,
                    token_params,
                    function (err, data) {
                        if (err) {
                            for (var i in files) {
                                self.removeLoadingImg(files[i], err.message);
                            }
                        }else {
                            self.file_tokens = $.extend(self.file_tokens, data);
                            for (var i in data) {
                                webupload.upload(i);
                            }
                        }
                    }
                );
            })
            .fail(function () {
                Util.toast('MD5 failed');
            });
    },
    uploadBeforeSend: function (object, data) {
        if (this.file_tokens[data.id]) {
            data.key = this.file_tokens[data.id].key;
            data.token = this.file_tokens[data.id].token;
            data['x:id'] = data.id;
            delete data.id;
        }

        return true;
    },
    uploadProgress: function (file, percentage) {
        var $imgLi = $('#' + file.id);
        var $progress = $imgLi.find('.up-progress');
        var $pos = $progress.find('.pos');
        $pos.css('width', (30 * percentage + 6) + 'px');
    },
    uploadSuccess: function (file, response) {
        var $imgLi = $('#' + file.id);
        var $img = $imgLi.find('img');
        var data = {};
        if (response.code !== UPLOAD_SUCCESS) {
            var message = response.msg;
            this.removeLoadingImg(file, message);
            return;
        }

        data = response.data;

        $imgLi
            .removeClass('up-error')
            .addClass('up-over');

        data.is_new = true;

        this.updateFileList(data, file);

        $imgLi.data('serverData',data);
        $img.data('id', data.aid);
        if (!this.$formInput) {
            this.$formInput = $('<input type="hidden" name="pic_url"/>');
            this.config.$el.append(this.$formInput);
        }
        this.$formInput.val(
            this.getUrlArr(this.file_list)
        );
        if (data.url) {
            $img.attr('src', data.url);
        }

        this.config.$el.trigger('uploader::success');
    },
    uploadError: function (file, reason) {
        var message = '上传错误!';
        if (reason === 'Q_TYPE_DENIED') {
            message = '不允许上传此类型文件';
        }
        this.removeLoadingImg(file, message);
    },
    removeLoadingImg: function (file, reason) {
        var $imgLi = this.$el.find('#' + file.id);
        this.deleteLi($imgLi, reason);
    },
    deleteLi: function ($li, reason) {
        var serverData = $li.data('serverData');
        var fileId = $li.attr('id');
        var self = this;
        if (reason) {
            Util.toast(reason);
        }
        if (this.uploader.isInProgress() && fileId) {
            this.uploader.cancelFile(fileId);
            this.uploader.removeFile(fileId, true);
            this.new_file_count --;
            $li.remove();
            return;
        }

        var aid = serverData.aid;


        if(serverData.is_new) {
            delete this.file_list[aid];
            $li.remove();
            if (this.$formInput) {
                this.$formInput.val(
                    this.getUrlArr(this.file_list)
                );
            }
            this.new_file_count --;
            return;
        }
        $.post(this.attachConfig.deleteUrl,{
                aid: aid
            },function(data) {
                if(data.state === 'success') {
                    delete self.file_list[serverData.aid];
                    self.new_file_count --;
                    $li.remove();
                    if (self.$formInput) {
                        self.$formInput.val(
                            self.getUrlArr(self.file_list)
                        );
                    }
                }else {
                    Util.toast(data.message);
                }
            }, 'json');
    },
    extensions: function (name) {
        return name.substring(name.lastIndexOf('.') + 1, name.length).toLowerCase();
    },
    getRestCount: function () {
        var old_file_count = this.attachConfig.list.length || 0;
        var allow_count = this.attachConfig.attachnum - old_file_count - this.new_file_count;
        return allow_count;
    },
    makeThumb: function (file) {
        var webupload = this.uploader;
        var self = this;
        var $el = $(this.config.images_wrap || '#images_wrap');

        var img_style = 'max-width:'+ this.thumbWidth +'px; max-height:'+ this.thumbHeight + 'px';
        $el.prepend('<li id="' + file.id + '" class="up-pic" >'+
                '<div class="clip"><img  style="' + img_style +'"></div>' +
                '<div class="up-mask"></div>' +
                '<div class="up-progress"> <div class="pos" style="-webkit-transition: all 1s ease-out; transition: all 1s ease-out;"></div> </div>'+
                '<a class="btn-del" href="javascript:void(0)" title="关闭">&nbsp;</a>'+
                '</li>');
        var $imgLi =  $el.find('#' + file.id);
        var $img = $imgLi.find('img');
        $imgLi.on( 'click', 'a.btn-del', function(){
            self.removeLoadingImg(file);
        });
        webupload.makeThumb(file, function(error, src, width, height) {
            if (error) {
                src = noPreviewImg;
                width = 65;
                height = 65;
                $img.css({
                    width: width,
                    height:height
                });
            }
            $img.attr('src', src).show();
        });
    },
    setImgError: function ($imgLi) {
        $imgLi
            .removeClass('up-over')
            .addClass('up-error')
            .find('img').attr('src', errorImg);
    },
    updateFileList: function (data, file) {
        this.file_list[data.aid] = {
            name : file.name,
            aid  :  data.aid,
            size : file.size,
            url : data.url,
            desc : '',
            is_new : true
        };
    },
    getUrlArr: function (file_list) {
        var arr = [];
        Object.keys(file_list)
            .forEach(function (item) {
                arr.push(file_list[item]);
            });
        return JSON.stringify(arr);
    }
});