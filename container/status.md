# 狀態查詢

- [ps](#ps)

## ps

```bash
docker ps [OPTIONS]

List containers
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-a, --all          ](#-a---all) | 列出所有容器（預設只列出運行中） |
| [-f, --filter filter](#-f---filter) | 基於提供的條件過濾輸出 |
| [    --format string](#--format) | 使用 go 模板列出容器 |
| [-n, --last int     ](#-n---last) | 列出最後 n個創建的容器（包含所有狀態） |
| [-l, --latest       ](#-l---latest) | 列出最後一個創建的容器（包含所有狀態） |
| [    --no-trunc     ](#--no-trunc) | 不截斷輸出 |
| [-q, --quiet        ](#-q---quiet) | 只顯示容器 ID |
| [-s, --size         ](#-s---size) | 顯示容器檔案大小 |


#### -a, --all          

預設輸出僅顯示狀態 `UP` 的容器，欲列出所有狀態的容器要使用 `-a/--all`：

```bash
$ docker ps -a
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                     PORTS     NAMES
14feba22e7f3   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Exited (0) 2 seconds ago             test-2
6bef0791654a   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes               80/tcp    test-1
```

#### -f, --filter

```bash
$ docker ps -f 
```

#### --format

```bash
$ docker ps --format
```

#### -n, --last

列出最後 n（任意數，範例為 `1`）個創建的容器：

```bash
$ docker ps -n 1
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                      PORTS     NAMES
14feba22e7f3   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Exited (0) 19 seconds ago             test-2
```

#### -l, --latest

列出最後一個創建的容器：

```bash
$ docker ps -l 
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                      PORTS     NAMES
14feba22e7f3   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Exited (0) 54 seconds ago             test-2
```

> 等效於 `docker ps -n 1`

#### --no-trunc

不截斷輸出的容器資訊：

```bash
$ docker ps --no-trunc
CONTAINER ID                                                       IMAGE          COMMAND                                          CREATED         STATUS         PORTS     NAMES
6bef0791654ab0418e651ce20c9ee8647f8621fb4477da08575675ca75187f41   nginx:alpine   "/docker-entrypoint.sh nginx -g 'daemon off;'"   3 minutes ago   Up 3 minutes   80/tcp    test-1
```

#### -q, --quiet

僅列出運行中的容器 ID：

```bash
$ docker ps -q
6bef0791654a
```

列出所有的容器 ID：

```bash
$ docker ps -aq
14feba22e7f3
6bef0791654a
```

> ps 的指令只要加 `-q`，輸出一律都是 ID。

#### -s, --size

輸出容器的檔案大小：

```bash
$ docker ps -s
6bef0791654a   nginx:alpine   "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   80/tcp    test-1    1.09kB (virtual 22.1MB)
```

> 1.09kB (virtual 22.1MB)：容器曾大小（鏡像大小）