# 儲存倉上搜索、拉取、標籤與推送

- [搜索（search）](#search)
- [拉取（pull）](#pull)
- [標籤（tag）](#tag)
- [推送（push）](#push)

## search

在 docker hub 進行鏡像的搜索。

```bash
$ docker search [OPTIONS] TERM

Search the Docker Hub for images
```

> 該指令僅在 docker hub 上進行搜索，而無法在私有倉搜索。

只要加上想搜尋的鏡像倉庫名稱，就能進行查詢。

```bash
$ docker search --limit 1 ubuntu
NAME                DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
ubuntu              Ubuntu is a Debian-based Linux operating sys…   10169               [OK]   
# --limit 1 僅顯示一筆資料            
```

欄位訊息的含義：
- NAME：鏡像的倉庫名稱。
- DESCRIPTION：該倉庫描述。
- STARS：其倉庫獲得的星數。
- OFFICIAL：是否為官方提供的倉庫。
- AUTOMATED：是否為自動化建置。

但該指令無法列出該鏡像的各版本號，通常會到 [docker hub](https://hub.docker.com/) 頁面進行搜索翻閱。上面範例中，ubuntu 在 docker hub 上的頁面 - [ubuntu](https://hub.docker.com/_/ubuntu/)。

## pull

從儲存倉拉取指定的鏡像倉庫。

```bash
$ docker pull [OPTIONS] NAME[:TAG|@DIGEST]

Pull an image or a repository from a registry
```

指定鏡像倉庫進行拉取：

```bash
$ docker pull ubuntu
```
> docker 對鏡像操作時，如果不加版號標籤，則預設是 - *latest*。

如果想要拉取指定的版本：

```bash
$ docker pull ubuntu:xenial
```

而這個版本號的標籤，就必須觀看 [docker hub](https://hub.docker.com/) 的頁面才能得知。

## tag

指定一鏡像，給予自定義的**倉庫名稱（repository）**與**版號（tag）**，以進行創建；類似別名的感覺。

```bash
$ docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]

Create a tag TARGET_IMAGE that refers to SOURCE_IMAGE
```

先用 `images` 列出本地鏡像。（詳細欄位含義請參照章節 - [`images`](list.md#本地查詢#欄位訊息的含義：)）

```bash
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
ubuntu                              latest              775349758637        2 weeks ago         64.2MB
```

替鏡像創建新的倉庫名稱，底下註解指令也是相同作用。（請記住版號標籤不指定，預設為 - *latest*）

```bash
$ docker tag ubuntu linux 
# docker tag ubuntu:latest linux
# docker tag 775349758637 linux
$ docker images 
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
ubuntu                              latest              775349758637        2 weeks ago         64.2MB
linux                               latest              775349758637        2 weeks ago         64.2MB
```

`tag` 不單只有創建新的倉庫名稱，在推送（[`push`](#push)）鏡像時，系統會按照倉庫名稱以進行推送。

如果要推送至 docker hub：

```bash
USER/REPOSITORY[:TAG]
```

如果要推送至私有倉：

```bash
SERVER/PROJECT/REPOSITORY[:TAG]
```

## push

選定推送的鏡像倉庫名稱，就可以推送至儲存倉。

```bash
$ docker push [OPTIONS] NAME[:TAG]

Push an image or a repository to a registry
```

推送鏡像至 [docker hub](https://hub.docker.com/) 上的用戶 - 48763：

```bash
$ docker push 48763/ubuntu 
The push refers to repository [docker.io/48763/ubuntu]
e0b3afb09dc3: Mounted from library/ubuntu 
6c01b5a53aac: Mounted from library/ubuntu 
2c6ac8e5063e: Mounted from library/ubuntu 
cc967c529ced: Mounted from library/ubuntu 
latest: digest: sha256:134c7fe821b9d359490cd009ce7ca322453f4f2d018623f849e580a89a685e5d size: 1152
```

> 在傳送的輸出中會看到 `Mounted from library/ubuntu`，是因為上傳的鏡像每層都在 docker hub 已存在，因此儲存倉將會自動關聯，而不會重複傳送；這也是[分層儲存](../basic-structure/layer-storage.md#分層儲存)的優點，重複的分層將會重複使用。