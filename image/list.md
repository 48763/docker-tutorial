# 本地查詢

## images

可查詢本地端的鏡像，並以清單的方式列出來。

```bash
$ docker images [OPTIONS] [REPOSITORY[:TAG]]

List images
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-a, --all](#-a---all)           | 顯示所有鏡像 (預設隱藏中間層) |
|     [--digests](#--digests)       | 顯示雜湊 |
| [-f, --filter filter](#-f---filter) | 根據提供的條件過濾輸出 |
|     --format string | 使用 Go 模板漂亮的列出鏡像 |
| [-q, --quiet](#-q---quiet)         | 僅顯示編號 ID |

列出所有的鏡像，但不包含中間層：

```bash
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
ubuntu                              latest              775349758637        2 weeks ago         64.2MB
linux                               latest              775349758637        2 weeks ago         64.2MB
```

> 中間層（intermediate layers）是在鏡像建構時所產生的層，減少硬碟使用並加快 docker 鏡像建構）。

#### 欄位訊息的含義：
- REPOSITORY：鏡像所在的倉庫名稱。
- TAG：鏡像所在倉庫中的版本標籤。
- IMAGE ID：鏡像的 ID，其值是利用 sha256 產生的為唯一值。
- CREATED：鏡像的創建時間。
- SIZE：鏡像各層累加的大小。

> 一般講的鏡像名稱，是指鏡像的倉庫（REPOSITORY）名稱。

僅對**特定鏡像**搜索：

```bash
$ docker images ubuntu
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
ubuntu              latest              775349758637        2 weeks ago         64.2MB
```

#### -a, --all

如果想要**中間層**一併列出，可以添加 `-a`：

```bash
$ docker images -a
```

#### -q, --quiet

如果僅想獲取取**鏡像 ID**：

```bash
$ docker images ubuntu -q
775349758637
```

#### --digests

如果想知道鏡像的**雜湊值（DIGEST）**，可以加上 `--digests`：

```bash
$ docker images --digests
REPOSITORY                          TAG                 DIGEST                                                                    IMAGE ID            CREATED             SIZE
ubuntu                              latest              sha256:6e9f67fa63b0323e9a1e587fd71c561ba48a034504fb804fd26fd8800039835d   775349758637        2 weeks ago         64.2MB

```

> 鏡像的雜湊值與 ID 雖然都是 sha256 所生成 ，但是雜湊值是在儲存倉中的尋址標識符[1][2]。

#### -f, --filter

如果想找出**懸掛鏡像**，可以使用 `--filter` 進行清單的過濾[3]：

```bash
$ docker images --filter "dangling=true"
```

## 參考

[1] Docker, [DOCKER IMAGES：CONTENT-ADDRESSABLE](https://docs.docker.com/engine/reference/commandline/images/#list-image-digests), English

[2] xji, [WHAT'S THE DIFFERENCE BETWEEN A DOCKER IMAGE'S IMAGE ID AND ITS DIGEST?](https://stackoverflow.com/a/56391252), May 31 2019, English

[3] Docker, [DOCKER IMAGES：IMAGES-DANGLING](https://docs.docker.com/engine/reference/commandline/images/#show-untagged-images-dangling), English