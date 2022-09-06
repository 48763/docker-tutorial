# 常用指令

## 檢視資源訊息

```
$ kubectl get node
$ kubectl get namespaces
$ kubectl get [-n <namespace_name>|-A] pods
$ kubectl get [-n <namespace_name>|-A] pods -o wide
$ kubectl get [-n <namespace_name>|-A] pods --field-selector spec.nodeName=<node_name>
$ kubectl get [-n <namespace_name>|-A] svc
```

## 檢視資源消耗

```
$ kubectl top node
$ kubectl top pods -n <namespace_name> [pod_name]
$ kubectl top pods -n <namespace_name> [pod_name] --containers
```

## 檢視節點的容器

```
$ kubectl get pods \
    --all-namespaces \
    --field-selector spec.nodeName=<node_name> \
    -o jsonpath='{range .items[*]}{range .spec.containers[*]}{.name}{"\n"}'
```

## 轉發端口位置

```
$ kubectl port-forward [-n <namespace_name>|-A] svc/<service_name> <local_port_number>:<service_port_number>
```

## Decode base64 

```
$ kubectl get -n <namespace_name> secret <secret_name> -o jsonpath={.data.token} | base64 -d && echo 
```
