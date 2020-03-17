# Docker

![](../img/basic-structure/001.jpg)


## Docker Client
Docker Client 是其架構中，用戶與 Docker Daemon 建立通信的客戶端。用戶使用的可執行文件為 docker，通過 docker 命令列工具可以發起眾多 container 管理的請求。

Docker Client 可以通過以下三種方式和 Docker Daemon 建立通信：`tcp://host:port`、`unix://path_to_socket` 和 `fd://socketfd`。為了簡單起見，本文一律使用第一種方式作為講述兩者通信的原型。與此同時，與 Docker Daemon 建立連接並傳輸請求的時候，Docker Client 可以通過設置命令行 flag 參數的形式設置安全傳輸層協議（TLS）的有關參數，保證傳輸的安全性。

Docker Client 發送容器管理請求後，由 Docker Daemon 接受並處理請求，當 Docker Client 接收到返回的請求相應並簡單處理後，Docker Client 一次完整的生命週期就結束了。當需要繼續發送容器管理請求時，用戶必須再次通過 docker 命令創建 Docker Client。

## Docker Daemon
Docker Daemon 是其架構中一個常駐在後台的系統進程，功能是：接受並處理 Docker Client 發送的請求。該守護進程在後台啟動了一個 Server，負責接受 Docker Client 發送的請求；接受請求後，Server 通過路由與分發調度，找到相應的 Handler 來執行請求。

Docker Daemon 啟動可執行文件也為 docker，與 Docker Client 啟動可執行文件 docker 相同。在 docker 命令執行時，通過傳入的參數來判別 Docker Daemon 與 Docker Client。

Docker Daemon 的架構，大致可以分為以下三部分：*Docker Server*、*Engine* 和 *Job*。 

- ### Docker Server
Docker Server 在其架構中是專門服務於 Docker Client 的 server。該 server 的功能是：接受並調度分發 Docker Client 發送的請求。 

在 Docker 的啟動過程中，通過包 `gorilla/mux`，創建了一個 mux.Router，提供請求的路由功能。在 Golang 中，`gorilla/mux` 是一個強大的 URL 路由器以及調度分發器。該 mux.Router 中添加了眾多的路由項，每一個路由項由 HTTP 請求方法（`PUT`、`POST`、`GET` 或 `DELETE`）、URL、Handler 三部分組成。

若 Docker Client 通過 HTTP 的形式訪問 Docker Daemon，創建完 mux.Router 之後，Docker 將 Server 的監聽地址以及 mux.Router 作為參數，創建一個`httpSrv=http.Server{}`，最終執行 `httpSrv.Serve()` 為請求服務。

在 Server 服務過程中，Server 在 listener 上接受 Docker Client 的訪問請求，並創建一個全新的 goroutine 來服務該請求。在 goroutine 中，首先讀取請求內容，然後做解析工作，接著找到相應的路由項，隨後調用相應的 Handler 來處理該請求，最後 Handler 處理完請求之後回复該請求。

需要注意的是：Docker Server 的運行在 Docker 的啟動過程中，是靠一個名為 *serveapi* 的 job 的運行來完成的。原則上，Docker Server 的運行是眾多 job 中的一個，但是為了強調 Docker Server 的重要性以及為後續 job 服務的重要特性，將該 *serveapi* 的 job 單獨抽離出來分析，理解為 Docker Server。

- ### Engine
Engine 是其架構中的運行引擎，同時也 Docker 運行的核心模塊。它扮演 Docker container 存儲倉庫的角色，並且通過執行 job 的方式來操縱管理這些容器。

在 Engine 數據結構的設計與實現過程中，有一個 handler 對象。該 handler 對象存儲的都是關於眾多特定 job 的 handler 處理訪問。舉例說明，Engine 的 handler 對像中有一項為：{"create": daemon.ContainerCreate,}，則說明當 "create" 的 job 在運行時，執行的是 daemon.ContainerCreate 的 handler。

- ### Job
一個 Job 可以認為是其架構中 Engine 內部最基本的工作執行單元。 Docker 可以做的每一項工作，都可以抽象為一個 job。例如：在容器內部運行一個進程，這是一個job；創建一個新的容器，這是一個 job，從 Internet 上下載一個文檔，這是一個 job；包括之前在 Docker Server 部分說過的，創建 Server 服務於 HTTP 的 API，這也是一個 job，等等。

Job 的設計者，把 Job 設計得與 Unix 進程相仿。比如說：Job 有一個名稱，有參數，有環境變量，有標準的輸入輸出，有錯誤處理，有返回狀態等。

## Docker Registry
Docker Registry 是一個存儲容器鏡像的倉庫。而容器鏡像是在容器被創建時，被加載用來初始化容器的文件架構與目錄。

在 Docker 的運行過程中，Docker Daemon 會與 Docker Registry 通信，並實現搜索鏡像、下載鏡像、上傳鏡像三個功能，這三個功能對應的 job 名稱分別為 `search`、`pull` 與 `push`。

其中，在其架構中，Docker 可以使用公有的 Docker Registry，即大家熟知的 Docker Hub，如此一來，Docker 獲取容器鏡像文件時，必須通過互聯網訪問 Docker Hub；同時 Docker 也允許用戶構建本地私有的 Docker Registry，這樣可以保證容器鏡像的獲取在內網完成。

## Graph
Graph 在其架構中扮演已下載容器鏡像的保管者，以及已下載容器鏡像之間關係的記錄者。一方面，Graph 存儲著本地具有版本信息的文件系統鏡像，另一方面也通過 GraphDB 記錄著所有文件系統鏡像彼此之間的關係。

其中，GraphDB 是一個構建在 SQLite 之上的小型圖數據庫，實現了節點的命名以及節點之間關聯關係的記錄。它僅僅實現了大多數圖數據庫所擁有的一個小的子集，但是提供了簡單的接口表示節點之間的關係。

同時在 Graph 的本地目錄中，關於每一個的容器鏡像，具體存儲的信息有：該容器鏡像的元數據，容器鏡像的大小信息，以及該容器鏡像所代表的具體 rootfs。

## Driver
Driver 是其架構中的驅動模塊。通過 Driver 驅動，Docker 可以實現對 Docker 容器執行環境的定制。由於 Docker 運行的生命週期中，並非用戶所有的操作都是針對Docker 容器的管理，另外還有關於 Docker 運行信息的獲取，Graph 的存儲與記錄等。因此，為了將 Docker 容器的管理從 Docker Daemon 內部業務邏輯中區分開來，設計了 Driver 層驅動來接管所有這部分請求。

在 Docker Driver 的實現中，可以分為以下三類驅動：graphdriver、networkdriver 和 execdriver。

- ### graphdriver
主要用於完成容器鏡像的管理，包括存儲與獲取。即當用戶需要下載指定的容器鏡像時，graphdriver 將容器鏡像存儲在本地的指定目錄；同時當用戶需要使用指定的容器鏡像來創建容器的 rootfs 時，graphdriver 從本地鏡像存儲目錄中獲取指定的容器鏡像。

在 graphdriver 的初始化過程之前，有4種文件系統或類文件系統在其內部註冊，它們分別是 `aufs`、`btrfs`、`vfs` 和 `devmapper`。而 Docker 在初始化之時，通過獲取系統環境變量 ”DOCKER_DRIVER” 來提取所使用 driver 的指定類型。而之後所有的 graph 操作，都使用該 driver 來執行。

- ### networkdriver
的用途是完成 Docker 容器網絡環境的配置，其中包括 Docker 啟動時為 Docker 環境創建網橋；Docker 容器創建時為其創建專屬虛擬網卡設備；以及為 Docker 容器分配 IP、端口並與宿主機做端口映射，設置容器防火牆策略等。

- ### execdriver
作為 Docker 容器的執行驅動，負責創建容器運行命名空間，負責容器資源使用的統計與限制，負責容器內部進程的真正運行等。在 execdriver 的實現過程中，原先可以使用 LXC 驅動調用 LXC 的接口，來操縱容器的配置以及生命週期，而現在 execdriver 默認使用 native 驅動，不依賴於 LXC。具體體現在 Daemon 啟動過程中加載的 ExecDriverflag 參數，該參數在配置文件已經被設為 ***native***。這可以認為是 Docker 在1.2版本上一個很大的改變，或者說 Docker 實現跨平台的一個先兆。

- ### libcontainer
libcontainer 是其架構中一個使用 Go 語言設計實現的庫，設計初衷是希望該庫可以不依靠任何依賴，直接訪問內核中與容器相關的 API。

正是由於 libcontainer 的存在，Docker 可以直接調用 libcontainer，而最終操縱容器的 *namespace*、*cgroups*、*apparmor*、網絡設備以及防火牆規則等。這一系列操作的完成都不需要依賴 LXC 或者其他包。 

另外，libcontainer 提供了一整套標準的接口來滿足上層對容器管理的需求。或者說，libcontainer 屏蔽了 Docker 上層對容器的直接管理。又由於 libcontainer 使用 Go 這種跨平台的語言開發實現，且本身又可以被上層多種不同的編程語言訪問，因此很難說，未來的 Docker 就一定會緊緊地和 Linux 捆綁在一起。而於此同時，Microsoft 在其著名云計算平台 Azure 中，也添加了對 Docker 的支持，可見 Docker 的開放程度與業界的火熱度。

## Docker container
Docker container 是 Docker 架構中服務交付的最終體現形式。

Docker 按照用戶的需求與指令，訂製相應的 Docker 容器：

- 指定容器鏡像，使得 Docker 容器可以自定義 rootfs 等文件系統；
- 指定計算資源的配額，使得 Docker 容器使用指定的計算資源；
- 配置網絡及其安全策略，使得 Docker 容器擁有獨立且安全的網絡環境；
- 指定運行的命令，使得 Docker 容器執行指定的工作。

