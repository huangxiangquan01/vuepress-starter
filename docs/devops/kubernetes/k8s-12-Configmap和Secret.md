#  Configmap and Secret
## 1.Configmap
**使用场景**
用来存储配置文件的 kubernetes 资源对象，配置内容都存储在 etcd 中。

### **定义方法**

1. 通过直接在命令行中指定 configmap 参数创建，即--from-literal

2. 通过指定文件创建，即将一个配置文件创建为一个 ConfigMap --from-file=<文件>

3. 通过指定目录创建，即将一个目录下的所有配置文件创建为一个 ConfigMap，--from-file=<目录>

4. 事先写好标准的 configmap 的 yaml 文件，然后 kubectl create -f 创建

### **如何使用**

1. 第一种是通过环境变量的方式，直接传递给 pod 

- 使用 configmap 中指定的 key

- 使用 configmap 中所有的 key

2. 第二种是通过在 pod 的命令行下运行的方式(启动命令中)

3. 第三种是作为 volume 的方式挂载到 pod 内configmap 的热更新，

**更新 ConfigMap 后**：

- 使用该 ConfigMap 挂载的 Env 不会同步更新

- 使用该 ConfigMap 挂载的 Volume 中的数据需要一段时间（实测大概 10 秒）才能同步更新

#### **通过环境变量使用** 

1. 使用 valueFrom、configMapKeyRef、name、key 指定要用的 key:

```
spec.containers.name.env. valueFromonfigMapKeyRef
Containers:
 env: 
 -name: SPECIAL_LEVEL_KEY 
 valueFrom: 
 configMapKeyRef: 
 name: special-config 
 key: special.how
```

2. 通过 envFrom、configMapRef、name 使得 configmap 中的所有 key/value 对都自动变成

环境变量：

```
Containers:
 envFrom: 
 configMapRef: 
 name: special-config
```

> Env and envfrom in the container.

### **在启动命令中引用** 

```
containers:
 command: [ "/bin/sh", "-c", "echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)" ] 
 env: 
 -name: SPECIAL_LEVEL_KEY 
 	valueFrom: 
 		configMapKeyRef: 
     name: special-config 
     key: SPECIAL_LEVEL
```

#### **作为 volume 挂载使用** 

```
spec: 
 containers:
 volumeMounts: 
 - name: config-volume4 
   mountPath: /tmp/config4
   subPath: my.cnf
   volumes: 
   - name: config-volume4 
     configMap: 
     	name: test-config4
```

## **2.Secrets** 

**使用场景**

Secret 解决了密码、token、密钥等敏感数据的配置问题，而不需要把这些敏感数据暴露到镜像或者 Pod Spec 中。Secret 可以以 Volume 或者环境变量的方式使用。

###  **三种类型**

- Opaque：base64 编码格式的 Secret，用来存储密码、密钥等；但数据也通过 base64 –decode解码得到原始数据
- kubernetes.io/dockerconfigjson：用来存储私有 docker registry 的认证信息。
- kubernetes.io/service-account-token： 用于被 serviceaccount 引用。

### **定义方法**

- Yaml 文件

- 从文件中产生

### **如何使用**

- 以环境变量方式

- 以 Volume 方式

## **3.例子** 

### **1 通过命令行参数创建 cm**

```sh
kubectl create configmap test-config1 --from-literal=db.host=10.5.10.116 --fromliteral=db.port='3306’
vi configs
db.host 10.5.10.116 
db.port 3306
kubectl create configmap test-config4 --from-env-file=./configs
```

### **2.指定文件创建 cm**

```
kubectl create configmap test-config2 --from-file=key1=./app.properties
```

### **3 指定目录创建 cm**

```
kubectl create configmap test-config4 --from-file=./configs
```

### **4 yaml 文件创建 cm**

```
apiVersion: v1
data:
 lsec1: ltop1
 lsec2: ltop2
 lsec3: ltop3
kind: ConfigMap
metadata:
 creationTimestamp: null
 name: cm8
```

### **5. yaml 文件创建 secret**

```sh
echo -n 'admin' | base64 
#vYWRtaW4= $ 
echo -n '1f2d1e2e67df' | base64 
#MWYyZDFlMmU2N2Rm
```

```yaml
apiVersion: v1
kind: Secret
metadata:
 name: mysecret
type: Opaque
data:
 username: YWRtaW4=
 password: MWYyZDFlMmU2N2Rm
```

```sh
kubectl create -f ./secret.yaml 
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
# 1f2d1e2e67df
```

### **6.命令行创建 secret**

```
kubectl create secret generic test --from-literal=username=admin --from-literal=password=1f2d1e2e67df
```

### **7.查看命令以及验证**

```sh
kubectl get cm 
kubectl describe cm test-config1

kubectl get secrets
kubectl describe secrets test-config1
```

### **8.通过 env 使用 CM 传递启动命令参数**

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: dapi-test-pod
spec:
 containers:
 - name: test-container
 	 image: busybox
   command: [ "/bin/sh", "-c", "echo $(SPECIAL_LEVEL_KEY) $(SPECIAL_TYPE_KEY)" ]
   env:
   - name: SPECIAL_LEVEL_KEY
     valueFrom:
       configMapKeyRef:
        name: special-config
        key: SPECIAL_LEVEL
   - name: SPECIAL_TYPE_KEY
     valueFrom:
      configMapKeyRef:
   			name: special-config
 				key: SPECIAL_TYPE
 restartPolicy: Never
```

### **9.通过 env 使用 CM 和 Secret**

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: secret-env-pod
spec:
 	containers:
 	- name: mycontainer
 	 	image: nginx
   	env:
   	- name: SECRET_USERNAME
   	 	valueFrom:
     		- configMapKeyRef:
       		name: mycm
       		key: username
    - name: SECRET_password
      valueFrom:
      - secretKeyRef:
       	name: mysecret
       	key: password
```

### **10.通过 envFrom 使用 CM 和 Secret**

```
apiVersion: v1
kind: Pod
metadata:
 	name: dapi-test-pod
spec:
	containers:
 	- name: test-container
 		image: busybox
 		command: [ "/bin/sh", "-c", "env" ]
 		envFrom:
 		- configMapRef:
 				name: mycm
 		- secretRef:
 				name: mysecret
 restartPolicy: Never
```

### **11.通过 Volume 使用 CM 和 Secrets**

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: secret-test-pod
 labels:
 name: secret-test
spec:
 	volumes:
 	- name: secret-volume
 	 	secret:
   		secretName: ssh-key-secret
 	- name: cm-volume
 	 	configMap:
 			name: mycm
	containers:
 	- name: ssh-test-container
 		image: busybox
 		volumeMounts:
		- name: secret-volume
 			readOnly: true
 			mountPath: "/etc/secret-volume"
 		- name: cm-volume
 			mountPath: "/etc/cm-volume"
```

