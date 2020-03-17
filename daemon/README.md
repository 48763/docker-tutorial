# Docker Daemon

## 重啟 docker daemon

```bash
$ sudo service docker restart
```

或

```bash
$ sudo systemctl restart docker
```

## 添加私有倉

```bash
$ sudo /etc/docker/daemon.json
{
  "insecure-registries": ["10.211.55.6:5000"]
}
```
## 參考

- Docker, [DOCKERD](https://docs.docker.com/engine/reference/commandline/dockerd/#on-linux), English