# 鏡像管理

## image

`image` 集結鏡像操作有關的指令。本篇僅會列出尚未介紹的指令，已介紹的指令將會有超連結引導至對應章節，其用法大同小異，差別在多加 `image` 在前，後面接的指令按照下表即可使用。

```bash
$ docker image COMMAND [--help]

Manage images
```

## 指令

| 名稱 | 描述 |
| - | - |
| [build  ](build&remove.md#build) | 從 Dockerfile 建置鏡像 |
| *[history]() | 顯示鏡像的歷史紀錄 |
| *[inspect]() | 顯示一個或多個鏡像的詳細資訊 |
| [load   ](save&load.md#load) | 從壓縮檔或標準輸入載入鏡像 |
| [ls     ](list.md#images) | 列出鏡像 |
| [prune  ](#prune) | 移除未使用的鏡像 |
| [pull   ](pull&push.md#pull) | 推送鏡像倉庫到儲存倉 |
| [push   ](pull&push.md#push) | 從儲存倉拉取鏡像倉庫 |
| [rm     ](build&remove.md#rmi) | 移除一個或多個鏡像 |
| [save   ](save&load.md#save) | 儲存一個或多個鏡像到壓縮檔（預設使用標準輸出串流） |
| [tag    ](pull&push.md#tag) | 替鏡像創建鏡像倉庫的標籤名稱 |

### prune

刪除未使用的鏡像。

```bash
$ docker image prune [OPTIONS]

Remove unused images
```

#### 選項

| 名稱 | 描述 |
| - | - |
| [-a, --all          ]() | 移除所有未使用的鏡像，而不僅是懸虛鏡像 |
| [    --filter filter]() | 提供過濾的值 (e.g. `'until=<timestamp>'`) |
| [-f, --force        ]() | 不提示確認 |

在不添加選項時，只會刪除未使用的懸掛鏡像：

```bash
$ docker image prune 
```

#### -a, --all

刪除所有未使用的鏡像：

```bash
$ docker image prune -a
```

#### -f, --force

不詢問的直接進行鏡像刪除：

```bash
$ docker image prune 
```