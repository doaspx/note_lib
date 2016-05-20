/**
 * Created by zhanghongtao on 2016/5/20.
 */

var shimmer = require('./shimmer');
shimmer.patchModule(checking);

require('./node1');
console.log('----------------------------------------');
require('./node2');

function checking (name, mcb) {
    var i = 0;
    console.log(name, '| checking......');
    setTimeout(function () {
        mcb(null, null);
    },10000);
}