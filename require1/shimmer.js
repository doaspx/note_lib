/**
 * Created by zhanghongtao on 2016/5/20.
 */



var logger = {
    debug : console.log
};

var shimmer = module.exports = {

    wrapMethod : function wrapMethod(nodule, noduleName, methods, wrapper) {
        if (!methods) return;
        if (!noduleName) noduleName = '[unknown]';
        if (!Array.isArray(methods)) methods = [methods];

        methods.forEach(function cb_forEach(method) {
            var method_name = noduleName + '.' + method;

            if (!nodule) return;
            if (!wrapper) return console.log("Can't wrap %s, no wrapper.", method_name);
            var original = nodule[method];

            if (!original) return console.log("%s not defined, skip wrapping.", method_name);
            if (original.__TY_unwrap) return console.log("%s already wrapped.", method_name);

            var wrapped = wrapper(original);
            wrapped.__TY_original = original;
            wrapped.__TY_unwrap = function __TY_unwrap() {
                nodule[method] = original;
                logger.debug("Removed instrumentation from %s.", method_name);
            };

            nodule[method] = wrapped;
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

    patchModule : function patchModule(loadCheck) {
        logger.debug("Wrapping module loader.");
        var Module = require('module');

        shimmer.wrapMethod(Module, 'Module', '_load', function cb_wrapMethod(load) {
            return function cls_wrapMethod( file ) {
                var me = this , _m = arguments;
                if(loadCheck) loadCheck(file, function () {
                    load.apply(me, _m);
                })
                else load.apply(me, _m);
            };
        });
    },

    unpatchModule : function unpatchModule() {
        logger.debug("Unwrapping to previous module loader.");
        var Module = require('module');
        shimmer.unwrapMethod(Module, 'Module', '_load');
    }
};