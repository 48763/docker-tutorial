# 安裝 Docker

- [Unix-like](#Unix-like)
- [MacOSX](#MacOSX)

## Unix-like

Docker 支援的 Unix-like 系統：
- Ubuntu
- Centos
- Fedora
- Raspbian

指令串的 `curl` 抓取的網頁，是由 Docker 官方所提供的腳本，會直接幫用戶按照系統環境，安裝最新穩定版 docker。

```bash
$ curl -fsSL https://get.docker.com | sudo sh
```

如果不想使用最新穩定版 docker，可以再利用指令移除。
```bash
$ sudo apt-get remove docker-ce
```

再選用下列指令找尋想要的 docker 版號：
```bash
$ apt-cache madison docker
$ apt-cache madison docker.io
$ apt-cache madison docker-ce
```

最後在利用 `apt-get install` 進行套件安裝即可。

## MacOSX

可以申請 Docker 官方帳號，[從 Docker Hub 下載](https://hub.docker.com/?overlay=onboarding)安裝。

或選擇安裝 [Homebrew](https://brew.sh/index_zh-tw)，使用下面指令安裝 docker：
```bash
$ brew install docker
```

> 在這建議申請帳號，因為在[鏡像](../image/pull&push.md#儲存倉上搜索拉取標籤與推送)推送或拉取會需要。

## 參考
- Docker, [DOCKER-INSTALL](https://github.com/docker/docker-install#dockerdocker-install), English
- Docker, [GET DOCKER ENGINE - COMMUNITY FOR UBUNTU](https://docs.docker.com/install/linux/docker-ce/ubuntu/), English