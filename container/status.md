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

使用過濾器對輸出進行篩選。下面表格是目前支持的過濾條件：

| 過濾器 | 描述 |
| - | - |
| id | 容器的 ID |
| name | 容器的名稱 |
| label | 隨意字串表示一個鍵值或鍵值對。表示方式： `<key>` 或 `<key>=<value>` |
| exited | 容器的退出整數代碼。僅適用於 `--all`. |
| status | 下列其中之一： `created`, `restarting`, `running`, `removing`, `paused`, `exited`, 或 `dead` |
| ancestor | 過濾共享同一個鏡像的容器。表示方式： `<image-name>[:<tag>]`, `<image id>`, 或 `<image@digest>` |
| before/since | 給定一個容器 ID，依照該容器的創建時間前/後進行過濾 |
| volume | 給定卷宗或綁定掛載，對運行中的容器過濾 |
| network | 給定網路名稱，對運行中的容器連接過濾 |
| publish/expose | 給定一傳輸埠，對容器埠號過濾。表示方式： `<port>[/<proto>]` 或 `<startport-endport>/[<proto>]` |
| health | 基於健康檢查的狀態過濾。下列其中之一： `starting`, `healthy`, `unhealthy` 或 `none` |
| isolation | （僅微軟使用） 下列其中之一： `default`, `process`, 或 `hyperv` |
| is-task | 過濾作為 `task` 服務的容器Filters containers that are a “task” for a service. 布林選項 （`true` 或 `false`） |



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
