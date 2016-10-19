var Builder = require('g-builder');
var builder = module.exports = new Builder(require('./config'));

builder.registerBuilder('g/*.js')
        .copy();

builder.registerBuilder('hybrid/common/g.js')
        .read()
        .concat()
        // .uglify()
        .write();

builder.registerBuilder('**/*.less')
        .read()
        .pipe(require('g-builder/builders/less'))
        // .pipe(require('g-builder/builders/css').minify)
        .write({
            rewrite: [/.less$/, '.css']
        });

builder.registerBuilder('com/orochi/**/*.css')
        .read()
        .pipe(require('g-builder/builders/css'))
        // .pipe(require('g-builder/builders/css').minify)
        .write()
        .write({
            rewrite: [/.css$/, '.jcss']
        });

builder.registerBuilder('**/*.css')
        .read()
        .pipe(require('g-builder/builders/css'))
        // .pipe(require('g-builder/builders/css').minify)
        .write();

builder.registerBuilder('lib/zepto/zepto.cmb.js')
        .read()
        .concat()
        .pipe(require('g-builder/builders/amd'))
        // .uglify()
        .write();

builder.registerBuilder('**/*.cmb.js')
        .read()
        .pipe(require('g-builder/builders/amd').combine)
        // .uglify()
        .write();

builder.registerBuilder('hybrid/version.js')
        .read()
        .pipe(require('g-builder/builders/version.js'))
        .write();

builder.registerBuilder('version.js')
        .read()
        .pipe(require('g-builder/builders/version.js'))
        .write({
            rewrite: [/\.js$/, '.json']
        })
        .write({
            rewrite: [/version\.js$/, 'g-version.json']
        })
        .pipe(require('./builders/version.js'))
        .pipe(require('g-builder/builders/amd'))
        .write();

builder.registerBuilder('lib/virtual-dom/**/*')
    .copy();


builder.registerBuilder('**/*.js')
        .read()
        .pipe(require('g-builder/builders/jshint')({
            configFile: __dirname + '/.jshintrc',
            ignoreFiles: [
                'lib/**/*.js'
            ]
        }))
        // .pipe(require('./builders/doc/index.js'))
        .pipe(require('g-builder/builders/amd'))
        // .uglify()
        .write();

builder.registerBuilder('**/*.tpl')
        .read()
        .pipe(require('./builders/template.js'))
        .pipe(require('g-builder/builders/amd'))
        // .uglify()
        .write();

builder.registerBuilder('**/*.vdtpl')
        .read()
        .pipe(require('./builders/virtual-dom'))
        .pipe(require('g-builder/builders/amd'))
        // .uglify()
        .write();

builder.registerBuilder('**/*.appcache')
        .read()
        .pipe(require('./builders/manifest.js'))
        .write();

builder.registerBuilder('**/*.jjson', '**/*.json')
        .read()
        .pipe(require('./builders/json.js'))
        .pipe(require('g-builder/builders/amd'))
        // .uglify()
        .write();

builder.registerBuilder('**/*.jcss')
        .read()
        .pipe(require('g-builder/builders/css'))
        // .pipe(require('g-builder/builders/css').minify)
        .pipe(require('./builders/jcss.js'))
        .pipe(require('g-builder/builders/amd'))
        .write();

builder.registerDefaultBuilder()
        .copy();
