/**
 * Created by zhanghongtao on 2016/4/4.
 */
var path = require('path');
var reduxNodeModules = path.join(__dirname, '..', '..', 'node_modules');

var a = path.join(__dirname, '..','..','node_modules');

console.log(__dirname);
console.log(a);
console.log(reduxNodeModules);


export default function thunkMiddleware({ dispatch, getState }) {
    return next => action =>
        typeof action === 'function' ?
            action(dispatch, getState) :
            next(action);
}


export  default function finalMiddleWare({dispatch, getState}){
    "use strict";
    return function (next){//createStore
        return function(action){
            if(action === 'function'){
                action(dispatch, getState);
            }else{
                next (action);
            }
        }
    }
}

export default function thunkMiddleware({ dispatch, getState }) {
    return next => action =>
        typeof action === 'function' ?
            action(dispatch, getState) :
            next(action);
}