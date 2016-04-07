/**
 * Created by zhanghongtao on 2016/4/6.
 */

var shimmer = require('./shimmer');
shimmer.patchModule();

var text = require('./test');
console.log('----------------------------------------');
require('./test2');