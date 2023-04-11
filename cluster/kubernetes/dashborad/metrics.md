# Kubelet 系統資訊

## 安裝指標和儀表板

```
$ kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

> `--kubelet-insecure-tls`: 添加在 args，以忽略 kubelet 的證書。

## 獲取指標

### 創建服務帳戶與權限綁定

```
$ kubectl apply -f monitor-ac.md
```

### 獲取服務帳戶的 `token`

```
$ kubectl -n kube-system get secrets monitoring-secret-token -o jsonpath='{.data.token}' | base64 -d
```

### 獲取叢集連線字串

```
$ kubectl cluster-info | grep master | grep -o "https://.*"
```

### 訪問 kubelet 獲取指標

```
$ curl ${APISERVER}/api/v1/nodes/$(hostname)/proxy/metrics \
    --header "Authorization: Bearer ${TOKEN}" \
    -ks
```

```
$ curl localhost:10250/metrics \
    --header "Authorization: Bearer ${TOKEN}" \
    -ks
```

```
$ curl ${APISERVER}/api/v1/nodes/$(hostname)/proxy/metrics/cadvisor \
    --header "Authorization: Bearer ${TOKEN}" \
    -ks
```

```
$ curl localhost:10250/metrics/cadvisor \
    --header "Authorization: Bearer ${TOKEN}" \
    -ks
```

## 獲取 json 格式的指標

### 配置 [kubelet config][1]

```
$ cat kubelet-config.yaml
...
readOnlyPort: 10255
...
```

### 訪問服務器

```
$ curl http://localhost:10255/stats/summary
```

## 叢集健康狀況

```
$ curl localhost:10248/healthz
```

```
$ curl https://localhost:10250/healthz \
    --header "Authorization: Bearer ${TOKEN}" \
    -ks
```

## 參考

1. lcavajani, [[doc] 4.2.2.1 kubelet port 10250 not accessible anymore ](https://github.com/SUSE/doc-caasp/issues/166#issuecomment-476191064), Mar 25 2019, English

[1]: https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/ "kubelet config"
