# 建構與移除

- [建構（build）](#build)
- [移除（rmi）](#rmi)

## build

透過 dockerfile 建構鏡像。

```bash
docker build [OPTIONS] PATH | URL | -

Build an image from a Dockerfile
```

請先用下面指令拉取 dockerfile 範例，以便此章節後續的指令操作練習。

```bash
$ curl -fsSL https://raw.githubusercontent.com/48763/docker-tu/master/image/Dockerfile -o Dockerfile
```

> 有關 Dockerfile 的撰寫，請參照章節：[Dockerfile](../dockerfile)。

### 選項

| 名稱 | 描述 |
| - | - |
| [    --build-arg list](#--build-arg) | 設定建置時的變數 |
| [-f, --file string   ](#-f---file) | Dockerfile 的名稱（預設路徑 `'$PATH/Dockerfile'`） |
| [    --force-rm      ](#--force-rm) | 總是刪除中間層鏡像 |
| [-q, --quiet         ](#-q---quiet) | 抑制建置輸出並在成功時輸出鏡像 ID |
| [    --rm            ](#--rm) | 在建置成功後，移除中間層鏡像（預設 `true`） |
| [-t, --tag list      ](#-t---tag) | 名稱和可選的標籤格式（`name:tag`） |


指令中 `.` 為指定建置鏡像的工作目錄：

```bash
$ docker build . 
# 與 docker build $(pwd) 等效
```

> build 默認在工作目錄中尋找 dockerfile

#### -f, --file

指定 dockerfile 的檔案路徑：

```bash
$ docker build . -f dockerfile
```

#### -t, --tag

替建置的鏡像標籤倉庫名稱與版號：

```bash
$ docker build . -t lab.yukifans.com/tutorial/test-build
```

其選項與 [`docker tag`](./pull&push.md#tag) 同理。如未給定倉庫名稱，則會顯示 `<none>`。

> 一組倉庫名稱與標籤僅能有一個鏡像使用，如重複給予新的鏡像，舊的鏡像會變成懸掛（dangling）[1] 的狀態，其名稱與標籤將顯示為 `<none>`。

#### -q, --quiet

建置時的過程不輸出：

```bash
$ docker build . -t test-build -q
```

#### --force-rm

建置不論成功失敗，都會將建置期間產生的容器刪除：

```bash
$ docker build . -t test-build --force-rm
```

**鏡像建置失敗的範例：**

添加 `/` 在最後一行中

```bash
$ cat Dockerfile
FROM alpine:3.1

ARG PASSWD

RUN set -x \
	&& echo "Your password is $PASSWD" \
	&& uname -a /
```

再使用下面指令進行鏡像失敗的建置：

```bash
$ docker build . -t test-build
Step 3/3 : RUN set -x 	&& echo "Your password is $PASSWD" 	&& uname -a /
 ---> Running in a57d806144c9
```

失敗後，使用下面指令，就能看到建置失敗退出的容器。可以比照上面指令輸出 `Running in a57d806144c9`，與下面的輸出的 `CONTAINER ID` 一致。

```bash
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                      PORTS               NAMES
a57d806144c9        eda01b51d164        "/bin/sh -c 'set -x …"   10 seconds ago      Exited (1) 10 seconds ago                       sad_haibt
```

後續可以自行執行一次成功案例，以進行觀察比較其輸出。

#### --rm

如果不想刪除建置期間產生的容器：

```bash
$ docker build . -t test-build --rm=false
```

> `--rm=false` 是設定系統不刪除，而 `--force-rm` 是要求應用強制刪除。當同時使用，仍會刪除。

#### --build-arg

使用該參數可以傳入變數：

```bash
$ docker build . -t test-build-arg --build-arg PASSWD=yukifans
Step 3/3 : RUN set -x 	&& echo "Your password is $PASSWD" 	&& uname -a
```

> 在 dockerfile 中需要先定義 `ARG`，否則只會輸出空白字串。[1]

觀察建置的輸出會發現，`echo` 的值會隨著輸入不同而改變。

```bash
Step 3/3 : RUN set -x 	&& echo "Your password is $PASSWD" 	&& uname -a
 ---> Running in fae4598554b5
+ echo Your password is yukifans
+ uname -a
```

## rmi

可以刪除沒有**相依性**（相依性指的是基於該鏡像，所創建容器或鏡像）的鏡像。

```bash
$ docker rmi [OPTIONS] IMAGE [IMAGE...]

Remove one or more images
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-f, --force   ](-f---force)  | Force removal of the image |
| [    --no-prune](--no-prune)  | Do not delete untagged parents |

移除指定的鏡像：

```bash
$ docker rmi ubuntu:latest
```

#### -f, --force

強制刪除所有同 ID 的鏡像：

```bash
$ docker rmi --force 1c1ff5e10075
```

#### --no-prune

不刪除未標記（`<none>`）的父鏡像（通常指中間層）：

```bash
$ docker rmi --no-prune test-build-arg
```
> 中間層（intermediate layers：是在鏡像建構時所產生的層，能減少硬碟使用並加快 docker 鏡像建構）。

使用下面指令查看中間層：

```bash
$ docker images -a
<none>              <none>              edf80cca7c97        9 seconds ago       5.05MB
```

> 有關查看鏡像請參考[本地查詢](list.md#本地查詢)章節。

## 參考

[1] Docker, [DOCKER IMAGES：IMAGES-DANGLING](https://docs.docker.com/engine/reference/commandline/images/#show-untagged-images-dangling), English

[2] Docker, [DOCKERFILE REFERENCE](https://docs.docker.com/engine/reference/builder/#scope), English


---

- Docker, [DOCKER BUILD](https://docs.docker.com/engine/reference/commandline/build/), English