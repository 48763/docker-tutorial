# Kubernetes 連線設置

### 前置作業

創建測試用的 `kubeconfig`：

```
yuki$ touch test-config
```

### 設置上下文配置

設置名為 `test-context` 的上下文至 `test-config`：

```
yuki$ kubectl --kubeconfig=./test-config \
    config set-context test-context \
    --cluster=test-cluster \
    --namespace=default \
    --user=test-admin
```

### 設置叢集配置

檢視 kubernetes 的 api 連線字串：

```
kubernet$ kubectl config view --minify | grep -Po '(?<=server: ).*'
https://<k8s-server-ip-and-port>
```

設置名為 `test-cluster` 的叢集配置至 `test-config`：

```
yuki$ kubectl --kubeconfig=./test-config config \
    set-cluster test-cluster \
    --server https://<outside>:48763 \
    --insecure-skip-tls-verify
```

> 連線字串按照需求配置，可以設定為內部 IP，或是外部 IP。


### 設置用戶配置

創建服務帳戶：

```
kubernet$ kubectl apply -f sa-admin.yaml
```

獲取服務帳戶的 `token`：

```
kubernet$ SECRET_NAME=$(kubectl get serviceaccount test-admin-user -o jsonpath='{.secrets[0].name}{"\n"}')
kubernet$ kubectl get secret ${SECRET_NAME} -o jsonpath={.data.token} | base64 -d
```

設置名為 `test-admin` 的用戶配置至 `test-config`：

```
yuki$ kubectl --kubeconfig=./test-config config \
    set-credentials test-admin \
    --token="<token>"
```

### 設置防火牆

如果是使用外部連線，必須設置目的地轉址，以及允許轉發：

```
firewall$ iptables -t nat -A PREROUTING -d <outside-ip> -p tcp --dport 48763 -j DNAT --to <k8s-server-ip-and-port>
firewall$ iptables -A FORWARD -d <k8s-server-ip> -p tcp --dport <k8s-server-port> -j ACCEPT
```

### 測試操作叢集

設置 `test-context` 為 `test-config` 當前使用的上下文配置：

```
yuki$ kubectl --kubeconfig=./test-config \
    config use-context test-context
```

設置完畢後，就可以在本機操作 kubernetes 叢集：

```
yuki$ kubectl --kubeconfig=./test-config \
    get namespaces
```
