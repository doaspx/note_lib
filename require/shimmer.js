/**
 * Created by zhanghongtao on 2016/4/6.
 */

    var logger = {
        debug : console.log
    };

    var path = require('path');

var instrumented = [];
var shimmer = module.exports = {
    debug: true,
    wrapMethodOnce : function wrapMethodOnce(nodule, noduleName, method, wrapper ) {

        if (!noduleName) noduleName = '[unknown]';
        var method_name = noduleName + '.' + method;
        var original = nodule[method];
        if (!original) {
            return logger.debug("%s not defined, skip wrapping.", method_name);
        }
        if ( original.__TY_unwrap ) return;
        var wrapped = wrapper(original);
        wrapped.__TY_original = original;
        wrapped.__TY_unwrap = function __TY_unwrap() {
            nodule[method] = original;
            logger.debug("Removed instrumentation from %s.", method_name);
        };

        nodule[method] = wrapped;
        if (shimmer.debug) instrumented.push(wrapped);
    },
    wrapMethod : function wrapMethod(nodule, noduleName, methods, wrapper) {
        if (!methods) return;
        if (!noduleName) noduleName = '[unknown]';
        if (!Array.isArray(methods)) methods = [methods];

        methods.forEach(function cb_forEach(method) {
            var method_name = noduleName + '.' + method;

            if (!nodule) return;
            if (!wrapper) return logger.verbose("Can't wrap %s, no wrapper.", method_name);
            var original = nodule[method];

            if (!original) return logger.debug("%s not defined, skip wrapping.", method_name);
            if (original.__TY_unwrap) return logger.verbose("%s already wrapped.", method_name);

            var wrapped = wrapper(original);
            wrapped.__TY_original = original;
            wrapped.__TY_unwrap = function __TY_unwrap() {
                nodule[method] = original;
                logger.debug("Removed instrumentation from %s.", method_name);
            };

            nodule[method] = wrapped;
            if (shimmer.debug) instrumented.push(wrapped);
        });
    },

    unwrapMethod : function unwrapMethod(nodule, noduleName, method) {
        if (!noduleName) noduleName = '[unknown]';
        if (!method) return 'no method name';
        if (!nodule) return 'not object';
        var wrapped = nodule[method];
        var pos = instrumented.indexOf(wrapped);
        if (pos !== -1) instrumented.splice(pos, 1);
        if (!wrapped) return 'method not exist';
        if (!wrapped.__TY_unwrap) return 'not wrapped';
        wrapped.__TY_unwrap();
        return 'success';
    },


    /**
     * Patch the module.load function so that we see modules loading and
     * have an opportunity to patch them with instrumentation.
     */
    patchModule : function patchModule() {
        logger.debug("Wrapping module loader.");
        var Module = require('module');

        shimmer.wrapMethod(Module, 'Module', '_load', function cb_wrapMethod(load) {
            console.log('----------------------------');
            return function cls_wrapMethod(file) {
                console.log('【FILE】:' + file);
                console.log('create wrapped');
                //(function aa(){
                //    "use strict";
                //    _postLoad(load.apply(this, arguments), file);
                //})();

                return _postLoad(load.apply(this, arguments), file);
            };
        });
    },

    unpatchModule : function unpatchModule() {
        logger.debug("Unwrapping to previous module loader.");
        var Module = require('module');

        shimmer.unwrapMethod(Module, 'Module', '_load');
    }
};


function instrument(shortName, fileName, nodule, param) {
    try {
        require(fileName)(nodule, param);
    }
    catch (error) {
        logger.verbose(error, "wrap module %s failed.",  path.basename(shortName, ".js"));
    }
}
var WRAPPERS =[]
function _postLoad(nodule, name) {
    console.log(JSON.stringify(arguments))
 //   var base = path.basename(name);

    //var wrapper_module = (name === 'pg.js') ? 'pg': base;
    //if (WRAPPERS.indexOf(wrapper_module) !== -1) {
    //    logger.debug('wrap %s.', base);
    //    var filename = path.join(__dirname, '../parsers/wrappers', wrapper_module + '.js');
    //    instrument(base, filename, nodule);
    //}
    return nodule;
}

function checking(){
    "use strict";
    setInterval(function(){
        console.log(new Date());
    }, 2000)
}
