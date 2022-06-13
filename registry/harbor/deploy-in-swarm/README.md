# harbor-for-swarm

## Environment
準備一個節點數為一個以上（除了管理者）的 *Docker swarm*。（關於 *swarm* 的建置，請參照該[連結](../../../clusters/docker-swarm)）

#### Manager requirements：
- docker 1.10.0+
- docker-compose 1.6.0+
- nfs-common

#### Worker requirements：
- docker 1.10.0+
- nfs-kernel-server (Only need one host)
- nfs-common (Other hosts)

#### Network ports

|Port|Protocol|Description|
|---|---|---|
|80|HTTP|Harbor UI and API will accept requests on this port for http protocol |
|443|HTTPS|Harbor UI and API will accept requests on this port for https protocol|
|4443|HTTPS|Connections to the Docker Content Trust service for Harbor, only needed when Notary is enabled|

## Dependencies
請參照各連結安裝使用。

Software：
- [docker](../../../how-to-use#install)
- [docker-compose](../../../deploy/compose)
- [nfs-kernel-server](/inside-network-service/NFS#set-up-nfs-server-on-server)
- [nfs-common](/inside-network-service/NFS#mount-fns-directory-on-host)

## Installation steps on Swarm

### Mount `/data`
在原本 *vm/harbor* 專案中的 `docker-compose` 檔案中，許多檔案資料都掛載至 `/data`，為達到掛載資料共享，便設定該 `/data` 透過網路和 *swarm* 各用戶（Host）共享。

```bash
Yuki@-worker01:~$ sudo mkdir /data
Yuki@swarm-worker01:~$ sudo vi /etc/exports
/data 192.168.200.0/24(rw,sync,no_root_squash,no_subtree_check)
```

```bash
Yuki@swarm-manager:~$ sudo mkdir /data
Yuki@swarm-manager:~$ sudo mount 192.168.200.132:/data /data
```

****原本存在 `/data` 的文件，會因掛載而消失，直至卸載。務必備份。****

### Prepare in advance

#### Download harbor
下載 `vm/harbor` 專案，並將其解壓縮。
```bash
Yuki@swarm-manager:~$ wget https://storage.googleapis.com/harbor-releases/release-1.5.0/harbor-online-installer-v1.5.0-rc1.tgz
Yuki@swarm-manager:~$ tar xvf harbor-online-installer-v1.5.0-rc1.tgz 
Yuki@swarm-manager:~$ cd harbor/
```

#### Modify hostname in config
簡易修改配置檔內的 `hostname`，可參照參數，進行其它的需求變化。
```
Yuki@swarm-manager:~$ vi harbor.cfg 
...
#The IP address or hostname to access admin UI and registry service.
#DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname = 192.168.200.131
...
##The initial password of Harbor admin, only works for the first time when Harbor starts. 
#It has no effect after the first launch of Harbor.
#Change the admin password from UI after launching Harbor.
harbor_admin_password = Yuki
... 
```

#### Generated config
使用 *vm/harbor* 專案中的 `prepare` 生成各服務所需的配置檔。
```bash
Yuki@swarm-manager:~$ sudo ./prepare 
Generated and saved secret to file: /data/secretkey
Generated configuration file: ./common/config/nginx/nginx.conf
Generated configuration file: ./common/config/adminserver/env
Generated configuration file: ./common/config/ui/env
Generated configuration file: ./common/config/registry/config.yml
Generated configuration file: ./common/config/db/env
Generated configuration file: ./common/config/jobservice/env
Generated configuration file: ./common/config/log/logrotate.conf
Generated configuration file: ./common/config/jobservice/config.yml
Generated configuration file: ./common/config/ui/app.conf
Generated certificate, key file: ./common/config/ui/private_key.pem, cert file: ./common/config/registry/root.crt
The configuration files are ready, please use docker-compose to start the service.
```

#### Move config
在 *vm/harbor* 專案中的 `docker-compose`，各個服務所需的配置檔都存在 `./harbor/common`，為了讓各個節點都能共享資料，故將其搬移至 `/data`。
```bash
Yuki@swarm-manager:~$ sudo mv common/ /data/
```

### Deploy in swarm
請使用該文件內的 `docker-compose-2.yml` 部署。該檔案符合 `docker-compose v3`，並對各服務的掛載資料進行調試，和各服務啟用的參數設定，以及其它參數的修改。
```bash
Yuki@swarm-manager:~$ sudo docker stack deploy --compose-file docker-compose-2.yml harbor
```

## Check service running
檢查 `harbor` 應用中的各個服務是否正常運作。
```
Yuki@swarm-manager:~$ sudo docker stack services harbor
ID                  NAME                 MODE                REPLICAS            IMAGE                                      PORTS
6u1l1loehl04        harbor_registry      replicated          1/1                 vmware/registry-photon:v2.6.2-v1.5.0-rc1   
b944b70raezc        harbor_jobservice    replicated          1/1                 vmware/harbor-jobservice:v1.5.0-rc1        
epbj3r0apahw        harbor_ui            replicated          1/1                 vmware/harbor-ui:v1.5.0-rc1                
goqyawywheku        harbor_proxy         replicated          1/1                 vmware/nginx-photon:v1.5.0-rc1             *:80->80/tcp, *:443->443/tcp, *:4443->4443/tcp
sincxlndp9ih        harbor_mysql         replicated          1/1                 vmware/harbor-db:v1.5.0-rc1                
swltk2nhvuy1        harbor_redis         replicated          1/1                 vmware/redis-photon:v1.5.0-rc1             
yl6o30vr9dt5        harbor_adminserver   replicated          1/1                 vmware/harbor-adminserver:v1.5.0-rc1       
za5vqsiyyhev        harbor_log           replicated          1/1                 vmware/harbor-log:v1.5.0-rc1               *:1514->10514/tcp
```

檢查 `harbor` 應用中的各服務狀態，以及所在的節點位置。
```
Yuki@swarm-manager:~$ sudo docker stack ps harbor | grep Running
okt89099d9bh        harbor_ui.1                vmware/harbor-ui:v1.5.0-rc1                swarm-manager    Running             Running 33 hours ago                                       
pelf9vrg7zd1        harbor_proxy.1             vmware/nginx-photon:v1.5.0-rc1             swarm-worker01    Running             Running 33 hours ago                                       
2u1t9isz2j9i        harbor_jobservice.1        vmware/harbor-jobservice:v1.5.0-rc1        swarm-worker02    Running             Running 33 hours ago                                       
zo3363za6jz5        harbor_adminserver.1       vmware/harbor-adminserver:v1.5.0-rc1       swarm-worker02    Running             Running 33 hours ago                                       
inptqggce23q        harbor_mysql.1             vmware/harbor-db:v1.5.0-rc1                swarm-worker01    Running             Running 33 hours ago                                       
fycm1xfkl9q8        harbor_registry.1          vmware/registry-photon:v2.6.2-v1.5.0-rc1   swarm-worker01    Running             Running 33 hours ago                                       
t1ndk4uig0sz        harbor_log.1               vmware/harbor-log:v1.5.0-rc1               swarm-manager    Running             Running 34 hours ago                                       
oam10dfqfa4u        harbor_redis.1             vmware/redis-photon:v1.5.0-rc1             swarm-worker02    Running             Running 34 hours ago     
```
