# Dockerfile 指令集

Docker 依照 dockerfile 建置鏡像時，會讀取其指令開頭，以執行相對應的動作。

dcokerfile 支援的指令列表：

- [FROM](#from)
- [ARG & ENV](#arg--env)
- [WORKDIR](#workdir)
- [ADD & COPY](#add--copy)
- [RUN](#run)
- [EXPOSE](#expose)
- [VOLUME](#volume)
- [CMD](#cmd)
- [ENTRYPOINT](#entrypoint)
- [HEALTHCHECK](#healthcheck)


## 基礎容器運行指令

該篇著重在 dockefile 指令，但為了測試其指令功能對鏡像或容器的作用，得先瞭解下面三項操作容器的指令：

### 運行容器：

```bash 
$ docker run [--name <container-name>] <image-name>
```

**--name：自訂義容器名稱。**

### 查看容器狀態

```bash
$ docker ps -a
```

**-a：查看所有容器。**

### 刪除容器：

```bash
$ docker rm --force <container-name>
```

**--force：強制執行**

***請務必在每個指令小節測試完畢後，將實驗用的容器刪除。***

## FROM

從指定的鏡像製作鏡像。

```dockerfile
FROM <image>[:<tag>|@<digest>] [AS <name>]
```

指定 `alpine:3.10` 作為基底：

```dockerfile
FROM alpine:3.10
```

或是 `@` 添加雜湊：

```dockerfile
FROM alpine@sha256:c19173c5ada610a5989151111163d28a67368362762534d8a8121ce95cf2bd5a
```

## ARG & ENV

### ARG

設置在指令列中使用的變數。

```dockerfile
ARG <name>[=<default value>]
```

### ENV

在製作鏡像的容器系統中設置環境變數。

```dockerfile
ENV <key> <value>
ENV <key>=<value> ...
```

### [範例](example/arg-env.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/arg-env.dockerfile \
    -t arg-env
$ docker run --name arg-env arg-env
```

主要比較**鏡像建置過程**與**容器運行結果**中，執行 `/bin/sh print.sh` 的輸出。

鏡像：

```bash
 ---> Running in 3998ce6141d1
Yuki's blog is "yukifans.com".
```

容器：

```bash
's blog is "yukifans.com".
```

因為 `ENV` 和 `ARG` 所執行的涵蓋的範圍不同，所以容器的輸出少了 `Yuki` 字串。

## WORKDIR

設置製作鏡像的容器，其系統中的預設工作目錄。

```dockerfile
WORKDIR /path/to/workdir
```

### [範例](example/workdir.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/workdir.dockerfile \
    -t workdir
```

主要觀察 `Step 3/7` 到 `Step 7/7` 的輸出行為（僅列出主要輸出）：

```
Step 3/7 : WORKDIR /etc
Step 4/7 : RUN pwd 	&& cd /var 	&& pwd
/etc
/var
Step 5/7 : RUN pwd
/etc
Step 6/7 : WORKDIR test-dir
Step 7/7 : RUN pwd
/etc/test-dir
```

會發現兩點：

1. 在 `Step 4/7` 進行 `cd` 移動至 `/var`，但在 `Step 5/7` 輸出目錄還是在 `/etc`。因為每一階段的建置，都是一個容器。

2. 在 `Step 6/7` 設定不存在的工作目錄，系統會自動幫忙建立。

***可以反覆修改 [RUN](#run) 中的指令，來觀察其輸出。***

## ADD & COPY

新增/複製檔案至製作的鏡像中。

```dockerfile
COPY [--chown=<user>:<group>] <src>... <dest>
```

```dockerfile
COPY [--chown=<user>:<group>] ["<src>",... "<dest>"]
```

## RUN

在製作鏡像的容器中，執行想要的 [shell](https://zh.wikipedia.org/wiki/殼層) 指令。

```dockerfile
RUN <command>
```

### [範例](example/run.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/run.dockerfile \
    -t nginx:run
```

在建置過程中，會發現每執行一個指令，都是建置一層。所以我們應該適當的進行合併：

```bash
RUN apk update \
    && apk add nginx \
    && mkdir /run/nginx
```

***合併完，再次建置並觀察。***

## EXPOSE

通過添加運行容器指令的選項 `-P`，docker 將會遵循該配置隨機映射傳輸埠。

```dockerfile
EXPOSE <port> [<port>/<protocol>...]
```

### [範例](example/expose.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/expose.dockerfile \
    -t nginx:expose
$ docker run --name nginx -d nginx:expose
```

主要透過 `docker ps` 觀察 `PORTS` 顯示：

```bash
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                         PORTS                NAMES
fb2881d128e5        nginx:expose             "nginx -g 'daemon of…"   5 hours ago         Up 5 hours                     80/tcp               nginx
```

欄位中的 `PORTS`，僅表示 `dockerfile` 中所告之容器使用會 `80/tcp`，但並不能直接連入。

如果希望能夠連入，可以利用下面兩種方式：

```bash
$ docker run --name nginx-p -p 80:80 -d nginx:expose
# docker run --name nginx-P -P -d nginx:expose
```

***兩種映射方式不同，可使用 `docker ps` 進行觀察***

其連入的 URL（404 是預設頁面）：

```
http://host-ip:port
```

## VOLUME

基於該鏡像創建容器時，如果未指定掛載該目錄，系統將會對其自動生成**匿名卷宗**。

```dockerfile
VOLUME ["/data"]
```

### [範例](example/volume.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/volume.dockerfile \
    -t nginx:volume
$ docker run --name nginx -d nginx:volume
```

主要觀察匿名卷宗的生成：

```bash
$ docker volume ls
DRIVER              VOLUME NAME
local               18acdaa937deda24dbe58223c466619f95147820bae8e0afe918253481aab9c2
```

***可以嘗試將 dockerfile 中的 `VOLUME` 移除或註解，再次建置並觀察。***

## CMD

基於該鏡像運作容器時，該容器運行的目標指令。僅有最後一項 `CMD` 能生效。

```dockerfile
CMD ["executable","param1","param2"]
CMD command param1 param2
```

### [範例](example/cmd.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/cmd.dockerfile \
    -t nginx:cmd
$ docker run --name nginx -p 80:80 -d nginx:cmd
```

主要觀察容器的狀態：

```bash
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
c344c9f0a3e3        nginx:cmd           "nginx"             4 seconds ago       Exited (0) 2 seconds ago                       nginx
```

會發現 `STATUS` 是已退出，這裡肯定困惑容器為什麼會退出？因為在 dockerfile 中的 `CMD`，其目的就只是執行 `nginx`，完成任務就會退出。

將配置改成如下[1][2]：

```dcokerfile
CMD ["nginx", "-g", "daemon off;"]
```

## ENTRYPOINT

基於該鏡像運作容器時，將會把 `CMD` 串接之後，作為該容器運行的目標指令。僅有最後一項 `ENTRYPOINT` 能生效。

```dockerfile
ENTRYPOINT ["executable", "param1", "param2"]
ENTRYPOINT command param1 param2
```

實際上運作會變成：

```dockerfile
ENTRYPOINT ["executable", "param1", "param2"] <CMD ["param1", "param2"]>
```

### [範例](example/entrypoint.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/entrypoint.dockerfile \
    -t curl:entrypoint
```

觀察想要代入的指令：

```bash
$ docker run curl:entrypoint -s
35.185.147.115
```

> `docker run <image-name>` 後面所接的字串符，將會覆蓋鏡像中的 CMD 指令。

但如果我們將 `ENTRYPOINT` 置換成 `CMD`：

```bash
$ docker build . -t curl:cmd
$ docker run curl:cmd curl icanhazip.com -s
35.185.147.115
```

***可以反覆交互操作，以理解其差異及用法。***

## HEALTHCHECK

基於該鏡像創建容器後，docker 會按照其設定替容器健康檢查。僅有最後一項 `HEALTHCHECK` 能生效。

```dockerfile
HEALTHCHECK [OPTIONS] CMD command
```

### 選項

| 名稱 | 預設 | 描述 |
| - | - | - |
| --interval=DURATION | 30s | 測試間隔 |
| --timeout=DURATION | 30s | 多久失效 |
| --start-period=DURATION | 0s | 啟用時間 |
| --retries=N | 3t | 嘗試次數 |

### [範例](example/healthcheck.dockerfile)

使用下列指令建置鏡像，並運行容器：

```bash
$ docker build \
    https://raw.githubusercontent.com/48763/docker-tutorial/master/dockerfile/example/healthcheck.dockerfile \
    -t nginx:healthcheck
$ docker run --name nginx -p 80:80 -d nginx:healthcheck
```

主要觀察容器的狀態：

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                    PORTS                NAMES
d1af5665c23d        nginx:healthcheck   "nginx -g 'daemon of…"   14 seconds ago      Up 13 seconds (healthy)   0.0.0.0:80->80/tcp   nginx
```

***執行健康檢查，必須瞭解容器中的應用，才知道該如何設置。***

## 參考

[1] Charles Duffy, 
    [HOW TO RUN NGINX WITHIN A DOCKER CONTAINER WITHOUT HALTING?](
    https://stackoverflow.com/questions/18861300/how-to-run-nginx-within-a-docker-container-without-halting), 
    Sep 17 2013, English

[2] NGINX, [CORE FUNCTIONALITY](http://nginx.org/en/docs/ngx_core_module.html#daemon), English

---
- Docker ,[DOCKERFILE REFERENCE](https://docs.docker.com/engine/reference/builder/), Eglish
