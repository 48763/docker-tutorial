# 創建和移除

- [create](#create)
- [rm](#rm)

## 基礎容器操作指令

該篇著重在 dockefile 指令，但為了測試其指令功能對鏡像或容器的作用，得先瞭解下面三項操作容器的指令：

### 啟動容器：

```bash 
$ docker start <container-id>|<container-name>
```

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

***可以在每個小節測試完畢後，將實驗用的容器刪除。***

## create

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

選定鏡像以創建容器：

```
$ docker create 48763/vsftpd
75ac9dad9541ce6b069b46b5b2d34d7a5ed468b198dd8370b4a3d6ad857e923a
```

#### --cidfile string 

將創建的容器識別碼（id）輸出至指定的檔案：

```
$ docker create --cidfile vsftpd-id 48763/vsftpd
ccffd61e23467c536c86ca31b763156fc9c39a1a1ae7334b914b3febbfa52ce2
$ cat vsftpd-id && echo 
ccffd61e23467c536c86ca31b763156fc9c39a1a1ae7334b914b3febbfa52ce2
```

可以用 `docker ps -a` 查看容器識別碼（id）：

```
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
ccffd61e2346        48763/vsftpd        "sh run vsftpd vsftp…"   5 seconds ago       Created                                 inspiring_engelbart
```

> 識別碼（id）僅會顯示前面的部分。

#### -p, --publish list 

將本機的傳輸埠和容器的傳輸埠串聯在一起：

```
$ docker create \
    -p 20:20 \
    -p 21:21 \
    48763/vsftpd
```

> `-p 20:20`：前面的 20 是指本機的傳輸埠，後面的 20 是指容器的傳輸埠。通常會設定一樣，以方便辨識和管理。

容器要運行後，才會佔用傳輸埠。使用下面指令啟動容器，並查看容器狀態欄位 `PORTS`：

```
$ docker start ead1b9b7895b
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED              STATUS              PORTS                      NAMES
ead1b9b7895b        48763/vsftpd        "sh run vsftpd vsftp…"   About a minute ago   Up 15 seconds       0.0.0.0:20-21->20-21/tcp   gracious_shirley
```

可以發現欄位 `PORTS` 多了 `0.0.0.0:20-21->20-21/tcp`。這就表示容器的傳輸埠有映射到本機。

也可以使用 `ftp` 嘗試連線：
```
$ ftp 10.0.2.15
Connected to 10.0.2.15.
220 Welcome to blah FTP service.
Name (10.0.2.15:vagrant): 
```

更深入瞭解其映射方法，可以使用 `iptables` 查看：

```
$ iptables -L -t nat -v 
Chain DOCKER (2 references)
 pkts bytes target     prot opt in     out     source               destination         
    0     0 RETURN     all  --  docker0 any     anywhere             anywhere            
    0     0 DNAT       tcp  --  !docker0 any     anywhere             anywhere             tcp dpt:ftp to:172.17.0.2:21
    0     0 DNAT       tcp  --  !docker0 any     anywhere             anywhere             tcp dpt:ftp-data to:172.17.0.2:20
```

#### --network string 

設定容器使用的網路：

```
$ docker create \
    --network host \
    48763/vsftpd
```

> 選定 host 的話，是使用本機的網路環境。不選定網路，預設是 `bridge`。

使用下面指令啟動容器，並查看容器狀態欄位 `PORTS`：

```
$ docker start cff25700c554
$ docker ps -a 
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                        PORTS               NAMES
cff25700c554        48763/vsftpd        "sh run vsftpd vsftp…"   12 minutes ago      Up 11 minutes                                     quirky_kare
```

可以發現欄位 `PORTS` 是空的。

*在啟用該容器前，就已經有傳輸埠佔用，啟動後 `STATUS` 將會因為傳輸埠被佔用，而顯示 `Exited (2)`。所以必須確認傳輸埠沒有被佔用。*


我們仍可以使用 `ftp` 連線：

```
$ ftp 10.0.2.15
Connected to 10.0.2.15.
220 Welcome to blah FTP service.
Name (10.0.2.15:vagrant): 
```
也可以使用下面指令查看埠的使用：

```
$ netstat -tupln | grep 21
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:21              0.0.0.0:*               LISTEN      25566/vsftpd
```

#### -e, --env list 

```
$ docker create \
    -p 20:20 \
    -p 21:21 \
    -e PASV_ENABLE=YES \
    48763/vsftpd
```

#### --env-file list 

```
$ docker create \
    -p 20:20 \
    -p 21:21 \
    -p 60000-61000:60000-61000 \
    --env-file vsftpd.env \
    48763/vsftpd
```

#### --mount mount 

```
$ docker create \
    -p 20:20 \
    -p 21:21 \
    -v $(pwd)/vsftpd:/etc/vsftpd \
    48763/vsftpd
```

#### -v, --volume list 

```
$ docker create \
    -p 20:20 \
    -p 21:21 \
    -v $(pwd)/vsftpd:/etc/vsftpd \
    48763/vsftpd
```

#### --name string 

```
$ docker create --name vsftpd \
    -p 20:20 \
    -p 21:21 \
    -v $(pwd)/vsftpd:/etc/vsftpd \
    48763/vsftpd
```

#### --restart string 

| Flag | Description |
| - | - |
| no | Do not automatically restart the container. (the default) |
| on-failure | Restart the container if it exits due to an error, which manifests as a non-zero exit code. |
| always | Always restart the container if it stops. If it is manually stopped, it is restarted only when Docker daemon restarts or the container itself is manually restarted. (See the second bullet listed in restart policy details) |
| unless-stopped | Similar to always, except that when the container is stopped (manually or otherwise), it is not restarted even after Docker daemon restarts. |

#### --rm 

```
$ docker create \
    --rm \
    48763/vsftpd
```

#### -i, --interactive 

```
$ docker create \
    -i 48763/vsftpd /bin/sh
```

#### -t, --tty 

```
$ docker create \
    -t 48763/vsftpd /bin/sh
```

## rm
