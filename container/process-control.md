# 運行控制
    
- [start](#start)
- [pause](#pause)
- [unpause](#unpause)
- [kill](#kill)
- [stop](#stop)

## start

啟動一（多）個容器。

```bash
docker start [OPTIONS] CONTAINER [CONTAINER...]

Start one or more stopped containers
```

啟動容器 id 為 `f55717b7ff44` 與名稱叫做 `ubuntu` 的容器：

```bash
$ docker start f55717b7ff44 ubuntu
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-a, --attach     ](#-a---attach) | Attach STDOUT/STDERR and forward signals |
| [-i, --interactive](#-i---interactive) | Attach container's STDIN |

#### -a, --attach 

連接容器的標準**輸出**和**錯誤**：

```bash
$ docker start -a ubuntu
```

通常連接在創建時有添加 `-t` 的容器。並且會搭配 [`-i`](#i---interactive)，達到互動性：

```bash
$ docker create -it ubuntu
$ docker start -ia ubuntu
root@2f27a74588de:/# 
```

#### -i, --interactive

連接容器的標準**輸入**：

```bash
$ docker start -i ubuntu 
```

測試範例與 [`-a`](#-a---attach) 相同。

## stop

停止一（多）個容器。

```
docker stop [OPTIONS] CONTAINER [CONTAINER...]

Stop one or more running containers
```

停止容器 id 為 `f55717b7ff44` 與名稱叫做 `ubuntu` 的容器：

```bash
$ docker stop f55717b7ff44 ubuntu
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-t, --time int](#-i---interactive) | Seconds to wait for stop before killing it (default 10) |

#### -t, --time

僅等待 1秒，讓容器正常停止，否則將直接 [`kill`](#kill)：

```
$ docker stop -t 1 ubuntu
```

## kill

終結一（多）個容器。

```
docker kill [OPTIONS] CONTAINER [CONTAINER...]

Kill one or more running containers
```

終結容器 id 為 `f55717b7ff44` 與名稱叫做 `ubuntu` 的容器：

```bash
$ docker Kill f55717b7ff44 ubuntu
```

## pause

暫停一（多）個容器。

```
docker pause CONTAINER [CONTAINER...]

Pause all processes within one or more containers
```

暫停容器 id 為 `f55717b7ff44` 與名稱叫做 `ubuntu` 的容器：

```bash
$ docker pause f55717b7ff44 ubuntu
```

## unpause

取消暫停一（多）個容器。

```
docker unpause CONTAINER [CONTAINER...]

Unpause all processes within one or more containers
```

取消暫停容器 id 為 `f55717b7ff44` 與名稱叫做 `ubuntu` 的容器：

```bash
$ docker unpause f55717b7ff44 ubuntu
```