/**
 * Created by zhanghongtao on 2016/3/29.
 */
"use strict";
var Start = new Promise((resolve, reject) => {
    resolve({k:1});
});

function test1(vv){
    console.log(test1);
    return new Promise((resolve, reject) => {
        console.log('test1-over');
        return resolve({v:1});
    })
}

function synccheck(vv){
    console.log(JSON.stringify(vv));

}

function test2(filters, transducers) {
    console.log('!'+ filters + '!!' + transducers)
    return (vv) => {
        console.log('闭包函数' + JSON.stringify(vv));
        test2(filters, transducers);
        //synccheck(vv)
        //    .then(webwxsync(handleMsg(filters, transducers)))
        //    .then(robot(filters, transducers))
        //    .catch(console.error);
        console.log('vv：'+ JSON.stringify(vv));
        console.log(filters);
        console.log(transducers);
    }
}

function test3(vv){
    console.log(test3);
    console.log(JSON.stringify(vv));
    return vv;
}

function test4(vv){
    console.log(test4);
    console.log(JSON.stringify(vv));
    return {vvv: 'cc1c'};
}

Start.then(test1)
    .then(test3)
    .then(test4)
    .then(test2(
        [(v)=> o => true]
    ))
    .catch((e)=> {console.log('err:'+e)});