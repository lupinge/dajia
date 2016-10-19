var validate = require('./validator.js');
var Event = require('lib/event/event.js');

function Field (config) {
    this.form   = config.form || null;
    this.rules  = config.rules || {};
    this.isValid = null;
}

Field.prototype = new Event();
Field.prototype.constructor = Field;

Field.prototype.validate = function (value, callback) {
    var self  = this;
    this.isValid = null;
    validate(this.form, this.rules, value, function (err) {
        if (err) {
            self.trigger('error', self.error);
        } else {
            self.trigger('valid');
        }

        self.isValid = !err;

        if (callback) {
            callback(err);
        }
    });
};

module.exports = Field;