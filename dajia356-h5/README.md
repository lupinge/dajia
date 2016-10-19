# 大家装修 前端 解决方案 #

## 安装方案 ##

- git clone --recursive https://git.youwei.me/frontend/dajia365-h5.git
- npm install -d
- npm install -g grunt-cli

## 文件编译 ##
- grunt [build]
- grunt watch 监听

## 环境配置 ##

```
MAC 下推荐 本地配置nginx
windows 推荐配置 开发机 nginx
```
- nginx 配置参考

```
server {
    listen       80;
    server_name h5.dajia365.com;
    index index.php index.html index.htm;
    error_log /var/log/nginx/dajia_sta.error.log;
    access_log /var/log/nginx/dajia_sta.access.log;

    set $vary 'Accept-Encoding';
    set $cache_control 'no-cache, public, must-revalidate';
    if ($http_user_agent ~ "MSIE [1-6]\.") {
        set $vary 'User-Agent';
        set $cache_control 'public, must-revalidate';
    }
    add_header Vary $vary;
    add_header Expires -1;
    add_header Cache-Control  $cache_control;

    set $path '/Users/damon/local_repo/youwe/dj_h5/';
    root  $path;

    # 将public目录rewrite到src目录
    location /public {
        rewrite '^/public(.*)$' /src$1 last;
        rewrite '^(.*).__(\d{1,20})__.(js|ico|gif|jpg|jpeg|png|css|swf|html?)$' /$1.$3 break;
        root $path;
    }
    location /src {
        rewrite '^(.*).__(\d{1,20})__.(js|ico|gif|jpg|jpeg|png|css|swf|html?)$' /$1.$3 break;
        root $path;
    }
    location /crossdomain.html {
        root $path;
    }
    location /crossdomain.xml {
        root $path;
    }
    location ~ .*\.php {
       fastcgi_pass     127.0.0.1:9000;
       fastcgi_index  index.php;
       fastcgi_param  SCRIPT_FILENAME   /Users/damon/local_repo/youwe/dj_h5/$fastcgi_script_name;
       include        fastcgi_params;
    }
    location / {
        proxy_pass http://www.dajia365.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    location ~ '^/dj/(.*?)(\.__\d*__)(\..*)$' {
        expires 7d;
        alias /Users/damon/local_repo/youwe/dj_h5/build/$1$3;
    }
    location ~ '^/dj/(.*)$' {
        expires -1;
        alias /Users/damon/local_repo/youwe/dj_h5/build/$1;
    }


}

```
- 把 host 指向 你开发机的ip 如：127.0.0.1 h5.dajia365.com
- 打开浏览器 访问src/hybrid/test/common/GJNativeAPI/index.html