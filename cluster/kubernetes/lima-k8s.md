# Lima 

使用官方 **kubernetes** 範例 - `k8s.yaml` 創建環境：

```
$ limactl start /opt/homebrew/Cellar/lima/0.11.1/share/doc/lima/examples/k8s.yaml
```

設置環境，使本地的 `kubectl` 可以訪問前面創建的 **kubernetes**：

```bash
$ mkdir -p "/Users/yuki/.lima/k8s/conf"
$ export KUBECONFIG="/Users/yuki/.lima/k8s/conf/kubeconfig.yaml"
$ limactl shell k8s sudo cat /etc/kubernetes/admin.conf >$KUBECONFIG
```
