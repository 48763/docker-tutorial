# Swarm
Docker Swarm provides native clustering functionality for Docker containers, which turns a group of Docker engines into a single, virtual Docker engine. 

In Docker 1.12 and higher, Swarm mode is integrated with Docker Engine. The swarm CLI utility allows users to run various commands to manage nodes in a Swarm, for example, create containers, create discovery tokens, list nodes in the cluster, and more. 

## Environment
- Hostname：u14-swarm-master
  - OS：Ubuntu 14.04
  - IP：10.211.55.24
  - RAM：1G
  - DISK：20G
- Hostname：u14-swarm-node01
  - OS：Ubuntu 14.04
  - IP：10.211.55.23
  - RAM：1G
  - DISK：20G

## Create swarm

### mastar
初始化 `swarm`，並且會生成一組 `token`。

```bash
u14-swarm-master:~$ sudo docker swarm init --advertise-addr 10.211.55.24
Swarm initialized: current node (gw2mhaiqw5gzgtvogqrf4aw6g) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-2a9t9te4ewe4kvk0gm9ulcsnkt3ikuj5qttjqup87dkxvni9ri-dqhuxopn24sgf48milcf9cch5 10.211.55.24:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

### node 
將 `master` 上的生成的 `token` 貼上，便會加入 `swarm`。

```bash
u14-swarm-node01:~$ sudo docker swarm join --token SWMTKN-1-2a9t9te4ewe4kvk0gm9ulcsnkt3ikuj5qttjqup87dkxvni9ri-dqhuxopn24sgf48milcf9cch5 10.211.55.24:2377
This node joined a swarm as a worker.
```

## verify
在 `master` 檢查節點是否正常運作

```bash
u14-swarm-master:~$ sudo docker node ls 
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
gw2mhaiqw5gzgtvogqrf4aw6g *   u14-swarm-master    Ready               Active              Leader
kgre56574jb0ivl79z6gm3939     u14-swarm-node01    Ready               Active              
```
