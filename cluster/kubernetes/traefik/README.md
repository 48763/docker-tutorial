# traefik


## Ingress class

*IngressClass* 內的 `controller` 的值固定為 `traefik.io/ingress-controller`，其源碼如下：

```
# kubernetes.go#L33
traefikDefaultIngressClassController = "traefik.io/ingress-controller"

# client.go#L502
for _, ic := range ingressClasses {
    if ic.Spec.Controller == traefikDefaultIngressClassController {
    ics = append(ics, ic)
    }
}
```

> 源碼位址: [kubernetes.go](https://github.com/traefik/traefik/blob/master/pkg/provider/kubernetes/ingress/kubernetes.go#L33), [client.go](https://github.com/traefik/traefik/blob/master/pkg/provider/kubernetes/ingress/client.go#L502)

> 好奇的原因是因為 nginx ingress controller 其值是可以自定義。