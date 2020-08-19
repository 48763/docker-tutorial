# 創建和移除

- [create](#create)
- [rm](#rm)

## 基礎相關操作指令

該篇著重在 `create` 和 `rm`，但為了測試其選項功能對容器的作用，得先瞭解下面幾項操作指令，以利於操作驗證。

### 啟動容器：

```bash
$ docker start <container-id>|<container-name>
```

### 查看容器狀態

```bash
$ docker ps -a
```

**-a：查看所有容器、相關資訊及狀態。**

### 刪除容器

```bash
$ docker rm --force <container-name>
```

**--force：強制執行**

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
|      --cidfile string  | Write the container ID to the file |
|  -e, --env list        | Set environment variables |
|      --env-file list   | Read in a file of environment variables |
|  -i, --interactive     | Keep STDIN open even if not attached |
|      --mount mount     | Attach a filesystem mount to the container |
|      --name string     | Assign a name to the container |
|      --network string  | Connect a container to a network (default "default") |
|  -p, --publish list    | Publish a container's port(s) to the host |
|      --restart string  | Restart policy to apply when a container exits (default "no") |
|      --rm              | Automatically remove the container when it exits |
|  -t, --tty             | Allocate a pseudo-TTY |
|  -v, --volume list     | Bind mount a volume |

*本節僅使用 [vsftpd](https://en.wikipedia.org/wiki/Vsftpd) 應用的鏡像，作為創建容器操作的範例。*

> 有關 ftp 操作，可以在 ubuntu [官方文件](https://help.ubuntu.com/community/vsftpd#Test_Your_Setup)瞭解。

基於 vsftpd 鏡像創建容器：

```bash
$ docker create 48763/vsftpd
75ac9dad9541ce6b069b46b5b2d34d7a5ed468b198dd8370b4a3d6ad857e923a
```

#### --cidfile string 

將創建的容器識別碼（id）輸出至指定的檔案：

```bash
$ docker create --cidfile vsftpd-id 48763/vsftpd
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

#### -p, --publish list 

將本機的傳輸埠和容器的傳輸埠串聯在一起：

```bash
$ docker create \
    -p 20:20 \
    -p 21:21 \
    48763/vsftpd
```

> `-p 20:20`：前面的 20 是指本機的傳輸埠，後面的 20 是指容器的傳輸埠。通常會設定一樣，以方便辨識和管理。

容器要運行後，才會佔用傳輸埠。使用下面指令啟動容器，並查看其狀態中的 `PORTS` 欄位：

```bash
$ docker start ead1b9b7895b
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

#### --network string 

設定容器使用的網路：

```bash
$ docker create \
    --network host \
    48763/vsftpd
```

> 選定 host 的話，是使用本機的網路環境。不選定網路，預設是 `bridge`。

使用下面指令啟動容器，並查看容器狀態 `PORTS` 欄位：

```bash
$ docker start cff25700c554
$ docker ps -a 
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS               NAMES
cff25700c554        48763/vsftpd        "sh run vsftpd vsftp…"   12 minutes ago      Up 11 minutes                                     quirky_kare
```

會發現 `PORTS` 欄位是空的。

> 在啟用該容器時，如果要使用的傳輸埠已被佔用，`STATUS` 將會顯示 `Exited (2)`。所以必須確認傳輸埠沒有被佔用。*


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

#### -e, --env list 

設定運行容器中的環境變數：

```bash
$ docker create \
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

#### --env-file list 

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

#### -v, --volume list 

將本地的 `$(pwd)/vsftpd` 掛載到容器內的 `/etc/vsftpd`：

```bash
$ docker create \
    -p 20:20 \
    -p 21:21 \
    -v $(pwd)/vsftpd:/etc/vsftpd \
    48763/vsftpd
```

透過下面指令，啟用並查看容器內的檔案：

```
$ docker start 561b3d4bcbde
$ docker exec 561b3d4bcbde ls
addftpuser
run
vsftpd-run.conf
vsftpd.conf
```

在本地和容器新增檔案：

```
$ touch vsftpd/test1
$ docker exec 561b3d4bcbde touch test2
```

再次檢查本地與容器內的檔案：

```
$ ls vsftpd
$ docker exec 561b3d4bcbde ls
```

會發現前面新增的檔案 `test2` 和 `test2`，不論容是本地或器內，都是存在的。

#### --mount mount 

掛載本地目錄/卷宗（volume）到容器內：

```bash
$ docker create \
    -p 20:20 \
    -p 21:21 \
    --mount type=bind,src=$(pwd)/vsftpd,dst=/etc/vsftpd \
    48763/vsftpd
```

其驗證方式，和 [-v](#-v---volume-list) 一樣。

#### --name string

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

#### --restart string 

| Flag | Description |
| - | - |
| no | 不自動重啟容器。（預設值） |
| on-failure | 重啟退出代碼非零的容器。 |
| always | 總是重啟暫停的容器。假如是手動關閉，僅會在 docker 守護進程（dockerd）重啓，以及容器手動重啓的狀況下，才會再次執行重啓功能。 |
| unless-stopped | 與 `always` 類似，除了容器停止時（手動或其它方式），即便重啟 docker 守護進程也不會重啟。 |

#### --rm 

創建的容器運行後，如果有退出，容器將會自動移除：

```
$ docker create \
    --rm \
    48763/vsftpd
```

逐行輸入下面指令，就可以觀察到該容器在停止後，就會被移除掉：

```
$ docker create --name vsftpd --rm  48763/vsftpd
$ docker start vsftpd
$ docker ps
$ docker stop vsftpd
$ docker ps
```

#### -i, --interactive 

將本機的標準輸入連接到容器：

```
$ docker create \
    -i 48763/vsftpd /bin/sh
```

創建完後，可以使用下面指令啟用，並嘗試鍵入 `pwd`：

```
$ docker start -i vsftpd
pwd
/
exit
```

容器在 `start` 運行後，系統的標準輸入被導向到容器內，所以後續的操作，都是在容器內。

#### -t, --tty 

```
$ docker create \
    -t 48763/vsftpd /bin/sh
```

## rm


## 參考

- VonC, [CONFUSE ABOUT DOCKER'S -I "KEEP STDIN OPEN EVEN IF NOT ATTACHED"](https://stackoverflow.com/questions/36563630/confuse-about-dockers-i-keep-stdin-open-even-if-not-attached), English