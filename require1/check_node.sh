#!/bin/sh

# ---------------------------start_check_node-------------------------
# 参数1：启动路径
# 参数2：Key
# 参数3：输入路径 （文件是在该路径下的key文件名）
function start_check_node(){
    RET=`ps awx|grep "scripts/check_syn.js "$1 |grep -v grep`
    if [ -n "$RET" ]
    then
        echo "[S] check_syn("$1") exist"
    else
        if [ -n "$3" ];
        then
                node scripts/check_syn.js $1 $2 >> "$3"/"$2".log 2>&1 &
        else
                node scripts/check_syn.js $1 $2 >> _logs_/"$2".log 2>&1 &
        fi
        echo "[RE] check_syn("$1") done"
    fi
}

while [ 1 ] ; do
    cur_time=`date +%Y%m%d_%H%M%S`
    echo [$cur_time] CHECK -----------------------

    # ---------------------------CHECK-------------------------
    # 数组格式 “启动路径,命名KEY,check输出的路径”
     check_arr=(
            [0]=./node1.js,node1
            [1]=./node2.js,node2
            )
            for var in ${check_arr[@]};
            do
                OLD_IFS="$IFS"
                IFS=","
                arr=($var)
                IFS="$OLD_IFS"
                start_check_node ${arr[0]} ${arr[1]}
            done

    sleep 10
done
