# 狀態查詢

- [ps](#ps)

## ps

```bash
docker ps [OPTIONS]

List containers
```

### 選項

| 名稱 | 描述 |
| - | - |
| [-a, --all          ](#-a---all) | Show all containers (default shows just running) |
| [-f, --filter filter](#-f---filter) | Filter output based on conditions provided |
| [    --format string](#--format) | Pretty-print containers using a Go template |
| [-n, --last int     ](#-n---last) | Show n last created containers (includes all states) (default -1) |
| [-l, --latest       ](#-l---latest) | Show the latest created container (includes all states) |
| [    --no-trunc     ](#--no-trunc) | Don't truncate output |
| [-q, --quiet        ](#-q---quiet) | Only display container IDs |
| [-s, --size         ](#-s---size) | Display total file sizes |


#### -a, --all          

```bash
$ docker ps -a
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                     PORTS     NAMES
14feba22e7f3   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Exited (0) 2 seconds ago             test-2
6bef0791654a   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes               80/tcp    test-1
```

#### -f, --filter

```bash
$ docker ps -f 
```

#### --format

```bash
$ docker ps --format
```

#### -n, --last

```bash
$ docker ps -n 1
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                      PORTS     NAMES
14feba22e7f3   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Exited (0) 19 seconds ago             test-2
```

#### -l, --latest

```bash
$ docker ps -l 
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                      PORTS     NAMES
14feba22e7f3   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Exited (0) 54 seconds ago             test-2
```

#### --no-trunc

```bash
$ docker ps --no-trunc
CONTAINER ID                                                       IMAGE          COMMAND                                          CREATED         STATUS         PORTS     NAMES
6bef0791654ab0418e651ce20c9ee8647f8621fb4477da08575675ca75187f41   nginx:alpine   "/docker-entrypoint.sh nginx -g 'daemon off;'"   3 minutes ago   Up 3 minutes   80/tcp    test-1
```

#### -q, --quiet

```bash
$ docker ps -q
6bef0791654a
```

```bash
$ docker ps -aq
14feba22e7f3
6bef0791654a
```

#### -s, --size

```bash
$ docker ps -s
6bef0791654a   nginx:alpine   "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes   80/tcp    test-1    1.09kB (virtual 22.1MB)
```