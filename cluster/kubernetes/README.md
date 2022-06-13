# Kubernetes Cluster with Containerd

### Prerequisites:

- OS: Ubuntu 16.04 (will be updated with additional distros after testing)
- Python: 2.7+
- Ansible: 2.4+

## Ansible 安裝

安裝最新版的 Ansible：

```
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible 
```

添加要部署的主機位址，以及其相關資訊：

```
$ sudo vi /etc/ansible/hosts

[k8s]
192.168.20.39 ansible_become_pass=123
192.168.20.40 ansible_user=beladmin ansible_ssh_pass=123 ansible_become_pass=123
192.168.20.41 ansible_user=beladmin ansible_ssh_pass=123 ansible_become_pass=123
```


## Containerd 安裝

克隆專案，並進入到 Ansible 安裝目錄：

```
$ git clone https://github.com/containerd/cri
$ cd ./cri/contrib/ansible
```

因為 Ansible 2.7[（提交歷史）](https://github.com/ansible/ansible/commit/4ec8599c3801e4737fddcca9b1d034885404a9c1) `state` 不支援 `installed`，將該區塊的 `state=installed` 修改成 `state=present`：

```
$ vi tasks/k8s.yaml 
- name: "Install kubelet, kubeadm, kubectl (Ubuntu)"
  apt: name={{item}} state=present

```

使用 `yaml` 劇本開始部署：

```
$ ansible-playbook cri-containerd.yaml
```

關閉 swap：

```
$ sudo swapoff -a && sudo sysctl -w vm.swappiness=0
```

初始化 kubernetes，並創建相關文件：

```
$ sudo kubeadm init --pod-network-cidr=10.244.0.0/16
$ mkdir -p $HOME/.kube
$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
$ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

配置網路插件：

```
$ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

## 故障排除：

### 新增群集節點

創建加入群集指示物：

```
$ sudo kubeadm token create --print-join-command
```

### 重啟應用

守護進程重載入，重啟 kubelet ：

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart kubelet
```

### 不支援 swap 

錯誤訊息：

```
[ERROR Swap]: running with swap on is not supported. Please disable swap
```

解決方法：

```
$ sudo swapoff -a && sudo sysctl -w vm.swappiness=0
```

### 網路橋接檔案消失

錯誤訊息：

```
[ERROR FileContent--proc-sys-net-bridge-bridge-nf-call-iptables]: /proc/sys/net/bridge/bridge-nf-call-iptables does not exist
```

解決方法：

```
$ sudo modprobe br_netfilter
```

Even if kubelet already has the containerd socket configured, kubeadm also needs to be pointed at the CRI socket of containerd to dispatch all runtime related operations to containerd (eg. pulling Kubernetes images).

```
kubeadm init --ignore-preflight-errors=all --cri-socket /run/containerd/containerd.sock --pod-network-cidr=10.211.0.0/16
```
