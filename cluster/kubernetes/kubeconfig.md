# Kube config

### 顯示所有配置詳情

列出在 `kubeconfig` 中，所有環境配置詳情：

```
$ kubectl config view
```

列出當前使用的環境配置詳情：

```
$ kubectl config view --minify
```

### 顯示當前環境配置

列出在 `kubeconfig` 中，目前所使用的環境配置：

```
$ kubectl config current-context
```

### 顯示所有叢集列表

列出在 `kubeconfig` 中，所有環境配置的叢集名稱：

```
$ kubectl config get-clusters
```

### 顯示所有環境配置

列出在 `kubeconfig` 中，所有環境配置的叢集名稱：

```
$ kubectl config get-contexts
```

### 變更環境配置名稱

修改在 `kubeconfig` 中，個別配置環境的名稱：

```
$ kubectl config rename-context <old-name> <new-name>
```

### 切換當前環境配置

在 `kubeconfig` 中，切換使用的配置環境：

```
$ kubectl config use-context <name>
```
