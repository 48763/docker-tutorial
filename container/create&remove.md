# 創建和移除

- [create](#create)
- [rm](#rm)

## create

```bash
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]

Create a new container
```

### 選項

| 名稱 | 描述 |
| - | - |
|      --cidfile string  | Write the container ID to the file |
|  -e, --env list        | Set environment variables |
|      --env-file list   | Read in a file of environment variables |
|  -i, --interactive     | Keep STDIN open even if not attached |
|      --mount mount     | Attach a filesystem mount to the container |
|      --name string     | Assign a name to the container |
|      --network string  | Connect a container to a network (default "default") |
|  -p, --publish list    | Publish a container's port(s) to the host |
|      --restart string  | Restart policy to apply when a container exits (default "no") |
|      --rm              | Automatically remove the container when it exits |
|  -t, --tty             | Allocate a pseudo-TTY |
|  -v, --volume list     | Bind mount a volume |



```
$ docker create 48763/vsftpd
75ac9dad9541ce6b069b46b5b2d34d7a5ed468b198dd8370b4a3d6ad857e923a
```

#### --cidfile string 

```
$ docker create --cidfile vsftpd-id 48763/vsftpd
11a42ada866861b4afa84744f2dd85eded119c9f0f32f63ad661cf68f5de1302
$ cat vsftpd-id && echo 
11a42ada866861b4afa84744f2dd85eded119c9f0f32f63ad661cf68f5de1302
```

#### -e, --env list 

```
$ docker run \
    -p 20:20 \
    -p 21:21 \
    -e PASV_ENABLE=YES \
    -d 48763/vsftpd
```

#### --env-file list 

```
$ docker run \
    -p 20:20 \
    -p 21:21 \
    -p 60000-61000:60000-61000 \
    --env-file vsftpd.env \
    -d 48763/vsftpd
```

#### -i, --interactive 

```
$ sudo docker run -i 48763/vsftpd /bin/sh
```

#### --mount mount 

```
docker run --name vsftpd \
    -p 20:20 \
    -p 21:21 \
    -v $(pwd)/vsftpd:/etc/vsftpd \
    -d 48763/vsftpd
```

#### --name string 


#### --network string 


#### -p, --publish list 


#### --restart string 

| Flag | Description |
| - | - |
| no | Do not automatically restart the container. (the default) |
| on-failure | Restart the container if it exits due to an error, which manifests as a non-zero exit code. |
| always | Always restart the container if it stops. If it is manually stopped, it is restarted only when Docker daemon restarts or the container itself is manually restarted. (See the second bullet listed in restart policy details) |
| unless-stopped | Similar to always, except that when the container is stopped (manually or otherwise), it is not restarted even after Docker daemon restarts. |

#### --rm 


#### -t, --tty 


#### -v, --volume list 

## rm