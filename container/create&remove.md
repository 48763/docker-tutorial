# 創建和移除

- [create](#create)
- [rm](#rm)

## 基礎相關操作指令

該篇著重在 `create` 和 `rm`，但為了測試其選項功能對容器的作用，得先瞭解下面幾項操作指令，以利於操作驗證。

### 啟動容器：

```bash
$ docker start <container-name-or-id>
```

### 查看容器狀態

```bash
$ docker ps -a
```

**-a：查看所有容器、相關資訊及狀態。**

### 刪除容器

```bash
$ docker rm -f <container-name-or-id>
```

**-f, --force：強制執行**

***可以在每個小節測試完畢後，將實驗用的容器刪除。***

## create

基於一鏡像創建新的容器。

```bash
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]

Create a new container
```

### 選項

| 名稱 | 描述 |
| - | - |
| [    --cidfile string](#--cidfile) | Write the container ID to the file |
| [-e, --env list      ](#-e---env) | Set environment variables |
| [    --env-file list ](#--env-file) | Read in a file of environment variables |
| [-i, --interactive   ](#-i---interactive) | Keep STDIN open even if not attached |
| [    --mount mount   ](#--mount) | Attach a filesystem mount to the container |
| [    --name string   ](#--name) | Assign a name to the container |
| [    --network string](#--network) | Connect a container to a network (default "default") |
| [-p, --publish list  ](#-p---publish) | Publish a container's port(s) to the host |
| [    --restart string](#--restart) | Restart policy to apply when a container exits (default "no") |
| [    --rm            ](#--rm) | Automatically remove the container when it exits |
| [-t, --tty           ](#-t---tty) | Allocate a pseudo-TTY |
| [-v, --volume list   ](#-v---volume) | Bind mount a volume |

*本節僅使用 [vsftpd](https://en.wikipedia.org/wiki/Vsftpd) 應用的鏡像，作為創建容器操作的範例。*

> 有關 ftp 操作，可以在 ubuntu [官方文件](https://help.ubuntu.com/community/vsftpd#Test_Your_Setup)瞭解。

基於 vsftpd 鏡像創建容器：

```bash
$ docker create 48763/vsftpd
75ac9dad9541ce6b069b46b5b2d34d7a5ed468b198dd8370b4a3d6ad857e923a
```

其返回值，就是容器唯一性的 `id`。

#### --name

自定義容器的名稱：

```bash
$ docker create --name vsftpd \
    48763/vsftpd
```

查看容器的狀態：

```bash
$ docker ps -a 
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                                                            NAMES
251fcb9925f7        48763/vsftpd        "sh run vsftpd vsftp…"   3 seconds ago       Created                                                                              vsftpd
```

可以發現對應 `NAME` 欄位的名稱，就變成自定義的名稱，否則就是系統隨機命名。

#### --cidfile

將創建的容器識別碼（id）輸出至指定的檔案：

```bash
$ docker create --name vsftpd \
    --cidfile vsftpd-id 48763/vsftpd
ccffd61e23467c536c86ca31b763156fc9c39a1a1ae7334b914b3febbfa52ce2
$ cat vsftpd-id && echo 
ccffd61e23467c536c86ca31b763156fc9c39a1a1ae7334b914b3febbfa52ce2
```

能用下面指令查看容器識別碼（id）：

```bash
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
ccffd61e2346        48763/vsftpd        "sh run vsftpd vsftp…"   5 seconds ago       Created                                 inspiring_engelbart
```

> 識別碼（id）僅會顯示前面的部分。

#### -p, --publish

開放容器的傳輸埠，並將其和本機串聯在一起：

```bash
$ docker create --name vsftpd \
    -p 20:20 \
    -p 21:21 \
    48763/vsftpd
```

> `-p 20:20`：前面的 20 是指本機的傳輸埠，後面的 20 是指容器的傳輸埠。通常會設定一樣，以方便辨識和管理。

容器要運行後，才會佔用傳輸埠。使用下面指令啟動容器，並查看其狀態中的 `PORTS` 欄位：

```bash
$ docker start vsftpd
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                      NAMES
ead1b9b7895b        48763/vsftpd        "sh run vsftpd vsftp…"   About a minute ago   Up 15 seconds       0.0.0.0:20-21->20-21/tcp   gracious_shirley
```

可以發現對應 `PORTS` 欄位多了 `0.0.0.0:20-21->20-21/tcp`。這就表示容器的傳輸埠有映射到本機。

可以使用 `ftp` 嘗試連線：

```bash
$ ftp 10.0.2.15
Connected to 10.0.2.15.
220 Welcome to blah FTP service.
Name (10.0.2.15:vagrant): 
```
> 可使用 `ctrl` + `c` 強制結束，或是在 ftp 終端介面輸入 `exit` 離開。

> 該範例可以和不添加 `-p` 所創建並啟動的容器做比較。

更深入瞭解其映射方法，可以使用 `iptables` 查看：
 
```bash
$ iptables -L -t nat -v 
Chain DOCKER (2 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 RETURN     all  --  docker0 any     anywhere             anywhere            
    0     0 DNAT       tcp  --  !docker0 any     anywhere             anywhere             tcp dpt:ftp to:172.17.0.2:21
    0     0 DNAT       tcp  --  !docker0 any     anywhere             anywhere             tcp dpt:ftp-data to:172.17.0.2:20
```

可以發現目的地到 `20` 和 `21` 的傳輸埠，都會被導向 `172.17.0.2`（容器的 ip）。

#### --network

設定容器使用的網路：

```bash
$ docker create --name vsftpd \
    --network host \
    48763/vsftpd
```

> 選定 host 的話，是使用本機的網路環境。不選定網路，預設是 `bridge`。

使用下面指令啟動容器，並查看容器狀態 `PORTS` 欄位：

```bash
$ docker start vsftpd
$ docker ps -a 
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS               NAMES
cff25700c554        48763/vsftpd        "sh run vsftpd vsftp…"   12 minutes ago      Up 11 minutes                                     vsftpd
```

會發現 `PORTS` 欄位是空的。

> 在啟用該容器時，如果欲使用的傳輸埠已被佔用，`STATUS` 將會顯示 `Exited (2)`。所以必須確認傳輸埠沒有被佔用。*


使用 `ftp` 確認是否可以連線：

```bash
$ ftp 10.0.2.15
Connected to 10.0.2.15.
220 Welcome to blah FTP service.
Name (10.0.2.15:vagrant): 
```

可使用下面指令查看傳輸埠的使用：

```bash
$ netstat -tupln | grep 21
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:21              0.0.0.0:*               LISTEN      25566/vsftpd
```

#### -e, --env

設定運行容器中的環境變數：

```bash
$ docker create --name vsftpd \
    -p 20:20 \
    -p 21:21 \
    -p 60000-61000:60000-61000 \
    -e PASV_ENABLE=YES \
    48763/vsftpd
```

透過下面指令，啟用並查看容器中的檔案 `vsftpd.conf`：

```bash
$ docker start e4b8dbd491d9
$ docker exec -it e4b8dbd491d9 cat vsftpd.conf
...(omit)
pasv_enable=YES
pasv_max_port=61000
pasv_min_port=60000
```

可以和沒添加 `-e` 的容器比較，會發現列出來的參數值是不一樣的。

> 容器內部運作的程序，要看其 dockerfile 如何撰寫，可以參考章節：[dockerfile](../dockerfile)

#### --env-file

讀取檔案，以設定運行容器中的環境變數：

```bash
$ docker create \
    -p 20:20 \
    -p 21:21 \
    -p 60000-61000:60000-61000 \
    --env-file vsftpd.env \
    48763/vsftpd
```

其驗證方式，和 [-e](#-e---env-list) 一樣。

#### -v, --volume

將本地的 `$(pwd)/data` 掛載到容器內的 `/data`：

```bash
$ docker create --name vsftpd \
    -p 20:20 \
    -p 21:21 \
    -v $(pwd)/data:/data \
    48763/vsftpd
```

透過下面指令，啟用並查看容器內的檔案：

```
$ docker start vsftpd
$ touch data/test.txt
$ docker exec vsftpd ls /data
test.txt
```

會發現前面新增的檔案 `test.txt`，也會在容器中出現。

#### --mount

掛載本地目錄/卷宗（volume）到容器內：

```bash
$ docker create \
    -p 20:20 \
    -p 21:21 \
    --mount type=bind,src=$(pwd)/data,dst=/data \
    48763/vsftpd
```

其驗證方式，和 [-v](#-v---volume-list) 一樣。

#### --restart

| Flag | Description |
| - | - |
| no | 不自動重啟容器。（預設值） |
| on-failure | 重啟退出代碼非零的容器。 |
| always | 總是重啟暫停的容器。假如是手動關閉，僅會在 docker 守護進程（dockerd）重啓，以及容器手動重啓的狀況下，才會再次執行重啓功能。 |
| unless-stopped | 與 `always` 類似，除了容器停止時（手動或其它方式），即便重啟 docker 守護進程也不會重啟。 |

#### --rm 

創建的容器運行後，如果有退出，容器將會自動移除：

```
$ docker create --name vsftpd \
    --rm \
    48763/vsftpd
```

逐行輸入下面指令，就可以觀察到該容器在停止後，就會被移除掉：

```
$ docker start vsftpd
$ docker ps
$ docker stop vsftpd
$ docker ps
```

#### -i, --interactive 

開通容器的標準輸入：

```
$ docker create --name vsftpd-1 \
    -i 48763/vsftpd /bin/sh
```

可以執行下面指令再創建一個對照組：

```
$ docker create --name vsftpd-2 \
    48763/vsftpd /bin/sh
```

啟用後，查看容器狀態：

```
$ docker start vsftpd-1 vsftpd-2
$ docker ps -a
```

會發現 `vsftpd-2` 是退出的狀態。因為 `/bin/sh` 會等待標準輸入，可是該容器並沒有開通標準輸入 `-i`，而導致容器退出。

#### -t, --tty 

替容器創建一個 `tty`：

```
$ docker create --name vsftpd \
    -t 48763/vsftpd /bin/sh
```

使用下面的指令啟用容器，並測試終端：

```
$ docker start -i vsftpd
root@8c9639739bdc:/# 
```

> -i：連接容器的標準輸入

但會發現，終端不接受任何指令，因為容器本身創建時，並沒有開通標準輸入 `-i`。所以正常會使用：

```
$ docker create --name vsftpd \
    -it 48763/vsftpd /bin/sh
```

再次啟用容器後，就能正常使用終端。

## rm

刪除一個或多個容器。

```bash
docker rm [OPTIONS] CONTAINER [CONTAINER...]

Remove one or more containers
```

### 選項

| 名稱 | 描述 |
| - | - |
| -f, --force   | Force the removal of a running container (uses SIGKILL) |
| -v, --volumes | Remove anonymous volumes associated with the container |

刪除 **id** 為 `32ef941c4543` 和**名稱**為 `vsftpd` 的容器：

```
$ docker rm 32ef941c4543 vsftpd
```

*如果容器正在運行中，就無法使用該指令刪除。就必須要執行 `docker stop`，再次執行刪除即可。*

#### -f, --force

強制刪除正在運行的容器：

```
$ docker rm -f vsftpd
```

> 通常不建議在正式環境中執行強制刪除，以避免誤刪的情況。

#### -v, --volumes

刪除與該容器有關連的匿名卷宗：

```
$ docker rm -v vsftpd
```

## 參考

- VonC, [CONFUSE ABOUT DOCKER'S -I "KEEP STDIN OPEN EVEN IF NOT ATTACHED"](https://stackoverflow.com/questions/36563630/confuse-about-dockers-i-keep-stdin-open-even-if-not-attached), English