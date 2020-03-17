# 設計技巧

應用服務在設計規劃時，當選擇將服務利用容器進行部署，通常將會以[微服務（Microservices）](https://zh.wikipedia.org/wiki/微服務)架構去設計應用服務。微服務的概念是將應用拆分成許多模組，每個模組只會負責單一功能，並利用 API 介接，以降低系統的**耦合度**，並提升系統**擴展性**和**容錯率**。而容器還能有助於減省系統的**資源開銷**，以及快速的**縮放**應用。

有關於鏡像的設計技巧，我按照開發過程整理了以下階段：

- [前置準備](#前置準備)
- [系統選擇](#系統選擇)
- [相依安裝](#相依安裝)
- [部署應用](#部署應用)
    - [安裝](#安裝)
    - [編譯](#編譯)
- [維護鏡像](#維護鏡像)

## 前置準備

### 1. 準備工作目錄

（範例：[prom-client](./example/prom-client)）

在建置鏡像時，docker 會預先載入工作目錄下的所有檔案。如果目錄有太多無關的檔案，將會拖慢建置速度：

```bash
$ ls -l
total 515036
-rw-rw-r-- 1 vagrant vagrant 120074076 Dec  5 01:25 go1.13.5.linux-amd64.tar.gz
-rw-rw-r-- 1 vagrant vagrant  13052288 Nov 20 08:18 latest-zh_TW.tar.gz
-rw-rw-r-- 1 vagrant vagrant 377487360 Dec 11 03:59 MarkLogic.rpm
-rw-rw-r-- 1 vagrant vagrant  16771043 Oct  9 20:45 node-v8.16.2-linux-x86.tar.gz
drwxrwxr-x 4 vagrant vagrant      4096 Dec 11 07:56 prom-client
$ docker build . -f prom-client/Dockerfile -t prom-clinet
Sending build context to Docker daemon  527.5MB
```

進入到 `prom-client` ，再進行製作，會發現載入的大小從 527.5MB，降到 20.99KB：

```
$ docker build . -t prom-client
Sending build context to Docker daemon  20.99kB
```

### 2. 撰寫 `.dockerignore`

（範例：[prom-client](./example/prom-client)）

Dokcer 預先載入檔案時，會按照 `.dockerignore` 中列出的檔案進行忽略，以減少載入的檔案。並可以防止敏感的檔案，因疏忽而添加到鏡像中：

```bash
$ cat .dockerignore
.gitignore
.DS_Store
node_modules/*
```

## 系統選擇

### 1. 選用官方鏡像

可選用官方提供的鏡像做為基底，因為它是最佳的實踐方式，不僅能節省設計和維護的成本，也能避免些許安全疑慮。

```dockerfile
FROM node:8.11.1-alpine
```

### 2. 採用最小鏡像

在兼容性允許的狀況下，盡可能地採用最小尺寸的鏡像，以減少系統部署所消耗的資源、頻寬和時間。

```
REPOSITORY      TAG                 SIZE
node            8.16.2-alpine3.10   21.55 MB
node            8.16.2-stretch-slim 49.57 MB
node            8.16.2-stretch      335.45 MB
node            8.16.2-jessie       260.4 MB
```

### 3. 使用版本標籤

選用基礎鏡像時，都使用預設標籤（latest），如果最新版在未來有任何更動，可能就會導致建置失敗：

```dockerfile
FROM node:latest
```

所以需要加上標籤，以明確的指定基礎鏡像版本：

```dockerfile
FROM node:8.11.1-alpine
```

## 相依安裝

### 1. 更新與依賴性安裝合併

在安裝依賴性套件時，如果沒有將其合併，系統可能會安裝到過時的套件：

```dockerfile
RUN apk update
RUN apk add nginx
```

所以盡量適當的進行合併：

```dockerfile
RUN apk update \
    && apk add nginx
```

### 2. 層的重複使用
（範例：[prom-client](./example/prom-client)）

假設 `src` 下的檔案變動性高，當有任何的修改， `RUN` 就會跟著重新建構，導致快取失效，建構時間也隨之增加：

```dcokerfile
COPY package.json ./
COPY src/ ./src/
RUN npm config set registry http://registry.npmjs.org/ \
    && npm install 
```

所以將變動性高的下調，之後當 `src` 有任何變更時，就僅有該層會重新建構：

```dcokerfile
COPY package.json ./
RUN npm config set registry http://registry.npmjs.org/ \
    && npm install
COPY src/ ./src/
```

## 部署應用

### 安裝

#### 1. 移除非相依性套件

有些開發人員為了方便除錯，可能會在鏡像中添加 `ssh`，以方便遠端至容器內：

```dockerfile
RUN set -x \
    && apt-get update \
    && apt-get install -y \
        nginx \
        ssh
```

在應用架構中，會希望容器僅運行單一任務，而在維護上，這也可能會增加安全風險。

所以在正式環境中使用的鏡像，會移除不必要的套件：

```dockerfile
RUN set -x \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
```

#### 2. 執行檔安裝

安裝應用需要安裝檔時，普遍會馬上想到使用 `COPY`：

```dockerfile
COPY MarkLogic.rpm ./
RUN yum install -y MarkLogic.rpm \
    && rm MarkLogic.rpm
```

雖然在 `RUN` 的最後有刪除安裝檔，但該安裝檔在 `COPY` 早就已經封存。

所以應該在 `RUN` 中使用 `wget` 獲取安裝檔：

```dockerfile
RUN yum install -y wget \
    && wget --passive-ftp \
        --ftp-user=admin \
        --ftp-password=password \
        ftp://192.168.200.4/MarkLogic.rpm \
    && yum -y install MarkLogic.rpm \
    && rm MarkLogic.rpm
```

如果官方沒提供較佳的載點，這時可以自行[建置 FTP](https://github.com/48763/vsftpd-on-dodcker) 將檔案上傳，供鏡像建置需要時下載。

### 編譯

#### 1. 多層建構

（範例：[go-hello](./example/go-hello)）

有些程式語言會進行編譯產生二進制檔（binaries），檔案的執行並不仰賴編譯器，這時就能將編譯器和原始碼進行移除，以節省空間。

而最好的實作方式就是[多層建構（multi-stage build）](https://docs.docker.com/develop/develop-images/multistage-build/)，利用 `FROM <IMAGE_NAME> AS <NICKNAME>`，將編譯完成的檔案，複製到乾淨的鏡像中：

```dockerfile
FROM golang:alpine AS build-env
ADD src/ /opt/src
RUN set -x \
	&& cd /opt/src/ \ 
	&& go build -o main

FROM alpine
COPY --from=build-env /opt/src/main /opt/app/
CMD /opt/app/main
```

#### 2. 設置虛擬包

在 ***alpine*** 系統中，當安裝僅在編譯才需要的套件時，可以使用 `apk` 的選項 `--virtual` 創建虛擬包，使套件暫時安裝在此；在編譯完畢後，就能使用 `del` 將虛擬包全部移除：

```dockerfile
RUN set -x \
    && apk add --no-cache --virtual .build-deps \
        make \
        gcc \
        libc-dev \
        acl-dev \
        attr-dev \
        db-dev \
        libevent-dev \
        libgcrypt-dev \
        tdb-dev \
        file \
    && make \
    && make install \
    && apk del .build-deps
```

#### 3. 移除快取/檔案

`RUN` 運行指令串時，多少會產生正式運行時用不到的檔案，這時能在指令串尾部將其移除，以有效減省空間：

```dockerfile
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
    && rm -rf /vat/lib/apt/lists/*
```

## 維護鏡像

### 1. 帳戶參數注入

在[執行檔安裝](#2-執行檔安裝)的小節中，登入 FTP 進行檔案的存取。建議在鏡像建置時，加入 [`--build-arg`](../image/build&remove.md#--build-arg) 將需要的參數代入，以提升安全性：

```
$ docker build . -t test-build-arg --build-arg PASSWD=yukifans
```

### 2. 版本控制

## 參考

[WHAT ARE THE IMPLICATIONS OF NO INSTALL RECOMMENDS APT GET INSTALL](https://askubuntu.com/questions/65081/what-are-the-implications-of-no-install-recommends-apt-get-install)
