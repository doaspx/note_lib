/**
 * Created by hongtao.zhang on 2015/5/27.
 */
var shimmer = require('./shimmer');
shimmer.patchModule(before_require_check);

var os = require('os');

var set_fre = 1000*4 , cof = {n:'R61504', test: true, pass: 'wix.s#3@b'} ,r_key = 'check_syn',time_out = 1000 * 60, is_first = true;
var p_path = process.argv[2] || '', p_key = process.argv[3] || '';

var init_res = (require('../node_share/utils_redis')).connRedis;
var factory = null;
if(!factory){ factory = init_res(cof, 'wr');}
var W_CHK = factory.write, R_CHK = factory.read;

require(p_path);

function before_require_check(name , mcb){
    if( p_path == '' || p_key == '') { console.log(name, '参数无效');  process.exit(); }
    var  ip = new IP()('ipv4');

    var data = {ip: ip}, key  =  'check:' + p_key;
    var para = {d: data, ip: ip, p: p_path, k : key};

    setInterval(function() { para.t = new Date().getTime();  read_key(para); }, set_fre);


    function read_key(p){
        R_CHK.hget(r_key , p.k,
            function(err, v){
                if(err) { console.log('【error】:', err);  process.exit(); }
                if(v == null) {
                    console.log('***************第一次启动***************');
                    insert_key()(p , 1) ;
                } else {
                    var data = JSON.parse(v);
                    if(p.ip == data.ip){
                        //如果是第一次
                        if(data.if){
                            console.log('***************第一次执行***************');
                            is_first = false;
                            insert_key()(p , 0) ; mcb();
                        } else if( p.t > data.t || is_first){
                            console.log('***************上一次执行异常***************');
                            insert_key()(p , 1) ;
                        } else {
                            console.log('***************非第一次执行***************');
                            is_first = false;
                            insert_key()(p, 0);
                        }
                    } else if( p.t > data.t )  {
                        console.log('***************有程序挂掉********************');
                        insert_key()(p , 1) ;
                    } else {
                        //process.exit();
                    }
                }
            }
        );
    }

    function insert_key(){
        function in_d( p , i_first){
            p.d.if = i_first;   p.d.t = new Date().getTime() + time_out;
            in_key(p );
        }

        function in_key ( p ){
            W_CHK.hset(r_key , p.k ,JSON.stringify( p.d ) , function( err ){
                if(err) { console.log('【error】:',err); process.exit();}
                if(p.d.if)  process.exit();
            });
        }

        return in_d;
    }

    function IP(){
        //
        var s_name = 'eth0,eth1,eth2,eth3'.toUpperCase();

        function get_local_ip(family) {
            //所有的网卡
            var faces = os.networkInterfaces() , ip = '';
            for(var e in faces){
                if(s_name.indexOf(e.toUpperCase()) >= 0){
                    for(var j = 0 ; j < faces[e].length ; j++){
                        if(faces[e][j].family.toUpperCase() == family.toUpperCase()){
                            ip = faces[e][j].address; console.log(ip);
                            break;
                        }
                    }
                }
                if(ip) break;
            }
            return   ip;
        }

        return get_local_ip;
    }
}

