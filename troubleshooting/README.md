MEMORY 不足

```
$ sudo docker run --name vsftpd -p 20:20 -p 21:21 -p 60000-61000:60000-61000 --env-file vsftpd.env -d 48763/vsftpd
5b0859ee2bf5f5a09a21e527ed29d38fe758b7be6e5a97979ce0ed103e0a6f11
docker: Error response from daemon: driver failed programming external connectivity on endpoint vsftpd (bf9f19db4cba65abbdd880dea39de9542a68026492677d4108ecc15dab1d394b): Error starting userland proxy:.
```