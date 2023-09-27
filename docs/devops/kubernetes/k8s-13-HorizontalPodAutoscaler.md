# **应用自动弹性伸缩-HPA**

## **1.HPA 介绍** 

Horizontal Pod Autoscaler 根据观察到的 CPU 利用率（或者，在自定义指标 支持下，根据其他一些应用程序提供的指标）自动扩展复制控制器、部署、副本集或有状态集中的 Pod 数量。请注意，Horizontal Pod Autoscaling 不适用于无法缩放的对象，例如 DaemonSet。

Horizontal Pod Autoscaler 实现为 Kubernetes API 资源和控制器。资源决定了控制器的行为。控制器会定期调整复制控制器或部署中的副本数量，以将观察到的指标（例如平均 CPU 利用率、平均内存利用率或任何其他自定义指标）与用户指定的目标相匹配。

K8s通过HPA，基于获取到的metrics(CPU utilization, custom metrics) value，对rc, deployment管理的 pods 进行自动伸缩。

HPA Controller 周期性(默认每 30s 一次，可通过 kube-controller-manager 的 flag--horizontal-pod-autoscaler-sync-period 进行设置)的调整对应的 rc,Deployment 中的 replicas 数量，使得指定的 metrics value 能匹配用户指定的 target utilization value。 

在每个 HPA Controller 的处理周期中，kube-controller-manager 都去查询 HPA 中定义的 metrics 的 utilization。查询方式根据 metric 类型不同而不同：

- 如果 metric type 是 resource metrics，则通过 resource metrics API 查询。

- 如果 metric type 属于 custom metrics，则通过 custom metrics API 查询。

## **2.部署 metrics-server** 

> Project Add: https://github.com/kubernetes-sigs/metrics-server

** 下载部署清单文件**

```sh
wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.3.6/components.yaml
```
**修改 components.yaml 文件**

```yaml
# 修改了镜像地址为：scofield/metrics-server:v0.3.6
# 修改了 metrics-server 启动参数 args

- name: metrics-server
  image: scofield/metrics-server:v0.3.6
  imagePullPolicy: IfNotPresent
  args:
  - --cert-dir=/tmp
  - --secure-port=4443
  - /metrics-server
  - --kubelet-insecure-tls
  - --kubelet-preferred-address-types=InternalIP
```

**能获取要 top 信息视为成功**

```
kubectl top nodes
```

## **3.通过 CPU、内存监控指标实现应用自动弹性** 

### **先决条件**

在 rs/rc/deployment 配置下必须有下面的配置，与 image 相同位置

```yaml
resources:
 requests:
	cpu: 1
```
### 手动配置

```
kubectl autoscale deployment wordpress --min=1 --max=40 --cpu-percent=35
```

### Yaml 创建

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
 name: ngx-hpa
 namespace: default
spec:
 scaleTargetRef:
 	apiVersion: extensions/v1beta1
 	kind: Deployment
 	name: ngx
 minReplicas: 1
 maxReplicas: 10
 targetCPUUtilizationPercentage: 5
```

```
kubectl get hpa
kubectl get pod -w
Watch -n 1 kubectl get pod
```

