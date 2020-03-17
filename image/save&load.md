# 儲存與載入

- [儲存（save）](#save)
- [載入（load）](#load)

## save

該指令會以標準輸出串流方式，輸出鏡像（含所有的父層、標記版號和參數）的 [tar](https://zh.wikipedia.org/wiki/Tar) 資料串流[1]。

```bash
Usage:	docker save [OPTIONS] IMAGE [IMAGE...]

Save one or more images to a tar archive (streamed to STDOUT by default)
```

### 選項

| 名稱 | 描述 |
| - | - |
|  [-o, --output string](#-o---output) | 寫到檔案，代替標準輸出 |

串接 gzip 壓縮：

```bash
$ docker save alpine:3.1 | gzip > images.tar.gz
# 與 docker save alpine:3.1 -o images.tar && gzip images.tar 等效
```

#### -o, --output

指定鏡像輸出的 tar 名稱：

```bash
$ docker save alpine:3.1 -o images.tar
# 與 docker save alpine:3.1 > images.tar 等效
```

## load

該指令可以從 tar 壓縮（即使 gzip, bzip2 或 xz 都可以）的檔案或標準輸入中，載入鏡像[2]。

```bash
Usage:	docker load [OPTIONS]

Load an image from a tar archive or STDIN
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-i, --input string](#-i---input) | 讀取 tar 壓縮檔，代替標準輸入 |
| [-q, --quiet       ](#-q---quiet) | 抑制載入輸出 |


#### -i, --input

指定要載入鏡像的 tar 壓縮檔案：

```bash
docker load -i images.tar.gz
```

#### -q, --quiet

如果不希望過程有輸出：

```bash
docker load -i images.tar.gz -q 
```

## 參考

[1] Docker, [DOCKER SAVE](https://docs.docker.com/engine/reference/commandline/save/), English

[2] Docker, [DOCKER LOAD](https://docs.docker.com/engine/reference/commandline/load/), English