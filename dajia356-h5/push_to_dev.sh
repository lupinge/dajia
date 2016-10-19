#!/bin/bash

src='/d/work/dajia365-h5/*'
des='/home/luping/dj_h5/'
host='192.168.1.119'
user='luping'
allrsync='/usr/bin/rsync -rav -e ssh --delete --progress'
while :
do
  $allrsync $src $user@$host:$des && echo "$DATE $TIME $EVENT $FILE was rsynced" &> /var/log/rsync-$des-$host.log
  sleep 3
done
