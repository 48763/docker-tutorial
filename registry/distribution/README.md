# Distribution

The Docker toolset to pack, ship, store, and deliver content.

## 安裝環境

- hostname: registry
    - OS: Ubuntu 14.04
    - IP: 10.211.55.1

## 目錄

- [安裝 Go](#安裝-Go)
- [編譯原始碼](#編譯原始碼)
- [開始使用](#開始使用)

## 安裝 Go

### Linux tarballs download

到官方下載系統適合的編譯器：[official](https://golang.org/dl/)

```bash
Yuki@registry:~$ sudo tar -C /opt -xzf go1.10.linux-amd64.tar.gz
```

### Installing to a custom location

配置本機端的環境變數。

```bash
Yuki@registry:~$ export GOROOT=/opt/go
Yuki@registry:~$ export PATH=$PATH:$GOROOT/bin
```

## 編譯原始碼

使用 `go install` 下載 **distribution** 專案。

```
Yuki@registry:~$ go install github.com/distribution/distribution/cmd/registry@latest
```

建立存放鏡像的預設目錄。

```
Yuki@registry:~$ sudo mkdir -p /var/lib/registry
Yuki@registry:~$ sudo chmod 755 /var/lib/registry/
```

或自定義儲存目錄路徑

```
Yuki@registry:~$ export REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY=<STORAGE_PATH> 
```

## 開始使用

啟用服務。

```
Yuki@registry:~$ go/bin/registry serve go/src/github.com/docker/distribution/cmd/registry/config-example.yml 
WARN[0000] No HTTP secret provided - generated random secret. This may cause problems with uploads if multiple registries are behind a load-balancer. To provide a shared secret, fill in http.secret in the configuration file or set the REGISTRY_HTTP_SECRET environment variable.  go.version=go1.10 instance.id=5e73a9c2-6442-47fe-bb81-b65eb8b87e74 version="v2.6.0+unknown"
INFO[0000] redis not configured                          go.version=go1.10 instance.id=5e73a9c2-6442-47fe-bb81-b65eb8b87e74 version="v2.6.0+unknown"
INFO[0000] Starting upload purge in 28m0s                go.version=go1.10 instance.id=5e73a9c2-6442-47fe-bb81-b65eb8b87e74 version="v2.6.0+unknown"
INFO[0000] using inmemory blob descriptor cache          go.version=go1.10 instance.id=5e73a9c2-6442-47fe-bb81-b65eb8b87e74 version="v2.6.0+unknown"
INFO[0000] listening on [::]:5000                        go.version=go1.10 instance.id=5e73a9c2-6442-47fe-bb81-b65eb8b87e74 version="v2.6.0+unknown"
```

上傳鏡像檔，並檢查檔案是否存在。

```
Yuki@docker:~$ sudo docker tag 202f438fbf2d 10.211.55.1:5000/nginx:origin
Yuki@docker:~$ sudo docker push 10.211.55.1:5000/nginx:origin
The push refers to repository [10.211.55.1:5000/nginx]
66f16bb558b9: Pushed 
2f9ce3711b3a: Pushed 
9729bae52c71: Pushed 
0b4699e48338: Pushed 
cd7100a72410: Pushed 
origin: digest: sha256:6b030f209a2ddd69996c71a0345c025eeaa3253219b4d52bf34d47cee5e1334f size: 1361
Yuki@docker:~$ curl  http://10.211.55.1:5000/v2/_catalog
{"repositories":["nginx"]}
```
