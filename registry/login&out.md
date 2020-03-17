# 登入/出

當對儲存倉進行需要權限的操作，像是拉取（[`pull`](../image/pull&push.md#pull)）非公開的鏡像，或是推送（[`push`](../image/pull&push.md#push)）鏡像到儲存倉，這時就必須登入至該儲存倉，才能進行有權限的操作。

- [login](#login)
- [logout](#logout)

## login

登入儲存倉。

```bash
$ docker login [OPTIONS] [SERVER]
```

#### 選項

| 名稱 | 描述 |
| - | - |
| -p, --password string | 用戶密碼 |
|     --password-stdin  | 從標準輸入獲取密碼 |
| -u, --username string | 用戶名稱 |

Docker 預設登入儲存倉是 docker hub，所以不需加任何伺服器參數即可，登入指令如下：

```bash
$ docker login
```

或者：

```bash
$ docker login -u yuki -p password
```

> 通常不建議將密碼直接輸入在命令列中，因為會記錄在 `.bash_history`，甚至會因為安全管理，伺服器都會側錄所有指令。

登入私有倉：

```bash
$ docker login lab.yukifans.com
```

> docker 在訪問儲存倉時，預設協議是 https，如果登入的私有倉沒有安裝憑證，就必需將其伺服器位址加入至 `deamon.json`，才能進行訪問。請參照章節 - [Daemon 配置](../daemon/#添加私有倉)以進行配置。

上述登入方法在登入成功後，docker 都會將**伺服器位址**、**用戶名稱**和**密碼**存在 `~/.docker/config.json`，其認證欄位是用 [base64 編碼](https://zh.wikipedia.org/zh-tw/Base64)。

```bash
$ sudo cat ~/.docker/config.json
{
	"auths": {
		"https://index.docker.io/v1/": {
			"auth": "aHR0cHM6Ly9naXRodWIuY29tLzQ4NzYzL2RvY2tlci10dQ=="
		},
		"lab.yukifans.com": {
			"auth": "c3RhciBtZS5wbHogPjw="
		}
    }
}
```

## logout

登出儲存倉：

```bash
$ docker logout [SERVER]
```

登出 docker hub：

```bash
$ docker logout
```

登出私有倉：

```bash
$ docker logout lab.yukifans.com
```

指令執行成功後，docker 會將寫入 `~/.docker/config.json` 的[鍵值](https://zh.wikipedia.org/wiki/鍵-值儲存)刪除。
