# traefik

### 創建命名空間

```
$ kubectl create ns traefik
```

### 使用 helm 部署

#### 安裝

```
$ helm repo add traefik https://helm.traefik.io/traefik
$ helm repo update
$ helm install --namespace traefik --values=./values.yml traefik traefik/traefik
```

#### 更新

```
$ helm upgrade --namespace traefik traefik traefik/traefik -f values.yaml
```

#### 卸載

```
$ helm uninstall traefik --namespace traefik
```
