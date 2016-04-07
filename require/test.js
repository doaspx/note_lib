/**
 * Created by zhanghongtao on 2016/4/6.
 */

setInterval(function(){
    if(checking()) console.log('aaaaa');
    else  console.log('bbbbbb');
}, 2000)
function checking(){
    return false;
}
console.log('exec test.......');