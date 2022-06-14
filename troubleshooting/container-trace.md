# 容器程序查詢

```
$ ps aux | grep nginx
root      7617  0.0  0.0  13900   896 ?        Ss   Dec11   0:00 nginx: master process nginx -g daemon off;
systemd+  8098  0.0  0.0  15320  4576 ?        S    Dec11   0:04 nginx: worker process
```

```
$ pstree -ps 7617
systemd(1)───containerd(1574)───containerd-shim(7564)───nginx(7617)───nginx(8098)
```

```
$ kubectl get -A pods \
    -o custom-columns=namespace:.metadata.namespace,name:.metadata.name,container-id:status.containerStatuses[0].containerID \
    | grep 7564
```

```
$ docker inspect --format "{{.Id}} {{.State.Pid}}" $(sudo docker ps -aq) | grep 7564
```

```
$ nsenter -t 7564 -n
$ ip addr
```

```
$ kubectl get service -n kube-system kube-dns
$ nsenter -t 7564 -n dig <domain-name> <@dns-ip>
```

```
$ conntrack -L
```
