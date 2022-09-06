# 遷移

在節點進行版本升級或是服務調配，可能會因為節點關閉或服務搬移，因此在執行前，必須將節點上運行的應用遷移至其它節點。下面列出各項行為：

- [taint](#污點taint)
- [drain](#驅逐drain)
- [tolerations](#容忍tolerations)

## 污點（taint）

```bash
$ kubectl taint nodes <node_name> <key>=<value>:<effect><->
```

#### effect

- NoSchedule：僅有容忍該污點，否則 pod 將不會被放置該節點，***原本就存在的 pod 會繼續運行***。
- PreferNoSchedule：系統會***避免***放置無法容忍（[`tolerations`](#容忍tolerations)）該污點的的 pod。是 `NoSchedule` 的軟化版。
- NoExecute：與 `NoSchedule` 差異在 - ***驅逐原本存在但無法容忍（[`tolerations`](#容忍tolerations)）的 pod***。
- `-`：尾部串接 `-`，代表移除該污點。

## 驅逐（drain）

下面命令將會驅逐該節點上的 pods：

```
$ kubectl drain <node_name> --ignore-daemonsets --delete-local-data
```

## 容忍（tolerations）

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  tolerations:
  - key: "<key>"
    operator: "<operator>"
    effect: "<effect>"
```

#### operator

- Exists：只要 `key` 對應到，不管其 `value`。
- Equal：`key` 所對應的 `value`  要符合。
