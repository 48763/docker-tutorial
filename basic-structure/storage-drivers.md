# 儲存驅動

容器運行時的讀寫，都是透過儲存驅動來管理讀寫層的檔案系統，而這種額外的抽象操作，與直接透過主機文件系統寫入數據卷（[Volume](../volume)）相比，這種額外的抽象降低讀寫效能。

| 儲存驅動 | 支持的文件系統 | 
| - | - |
| overlay2, overlay	| xfs（ftype=1）, ext4 |
| aufs | xfs, ext4 | 
| devicemapper | direct-lvm |
| btrfs | btrfs |
| zfs | zfs |
| vfs | any filesystem |


### overlay2 

目前 docker 所支援的 Linux 發行版優先選擇的儲存驅動，不需要添加額外的配置即可使用。

>內核版本需求 4.0以上

### aufs 

當 [Ubuntu](https://en.wikipedia.org/wiki/Ubuntu#Releases) 內核不支援 overlay2 時，優先選擇該儲存驅動。

### devicemapper 

[CentOS](https://en.wikipedia.org/wiki/CentOS#Versioning_and_releases) 和 [RHEL](https://access.redhat.com/articles/3078) 內核不支援 overlay2 時。推薦選擇該儲存驅動。檔案系統需要 *direct-lvm*，雖然 `loopback-lvm` 為零配置，但性能很差。

### btrfs & zfs

如果系統的檔案系統是 btrfs 或 zfs，儲存驅動則使用 btrfs 或 zfs。這些檔案系統允許使用進階選項（如：快照（[snapshots](https://zh.wikipedia.org/wiki/快照_(電腦儲存))）），但可能需要更多的維護和設定。

### vfs

用於測試目的，或無法利用寫入時複製（[copy-on-write](https://zh.wikipedia.org/wiki/寫入時複製)）檔案系統的狀況時使用；其效能很差，不建議在生產中使用。

## 參考

- Docker, [MANAGE DATA IN DOCKER](https://docs.docker.com/storage/), English
- Docker, [DOCKER STORAGE DRIVERS](https://docs.docker.com/storage/storagedriver/select-storage-driver/), English
- Wikipedia, [UNION MOUNT](https://en.wikipedia.org/wiki/Union_mount), English