# 创建并部署 WordPress

## 1.WordPress 简介

WordPress（使用 PHP 语言编写）是免费、开源的内容管理系统，用户可以使用 WordPress 搭建自己的网站。完整的 WordPress 应用程序包括以下 Kubernetes 对象，由 MySQL 作为后端数据库。

## 2.Mysql 部署

### 创建 MySQL 密钥

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: MTIzNDU2
  username: cm9vdA==
#user/pass=root/123456
```

### **使用 StatefulSet 部署 mysql**

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql-sts
spec:
  serviceName: "mysql-sts"
  replicas: 1
  volumeClaimTemplates:
  - metadata:
      name: mysql-local-storage
      annotations:
        volume.beta.kubernetes.io/storage-class: "couse-nfs-storage"
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 25Gi
  selector:
    matchLabels:
       app: mysql-sts
  template:
    metadata:
     labels:
       app: mysql-sts
    spec:
      #nodeSelector:
        #wordpress: mysql
      containers:
      - image: mysql:5.7.34
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysecret
              key: password
        #- name: SECRET_USERNAME
        #  valueFrom:
        #  secretKeyRef:
        #    name: mysecret
        #    key: username
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-local-storage
          readOnly: false
          mountPath: /var/lib/mysql
      initContainers:
      - name: init-wordpress-mysql
        image: busybox
        imagePullPolicy: IfNotPresent
        command: ['sh', '-c', 'rm -rf /data/*', 'until nslookup mysql-sts; do echo waiting for mysql-sts; sleep 2; done;']
        volumeMounts:
        - name: mysql-local-storage
          readOnly: false
          mountPath: /data
```

### **Service 创建**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-sts
  labels:
    app: mysql-sts
spec:
  ports:
    - port: 3306
  selector:
    app: mysql-sts
  clusterIP: None
```

## 3. **Wordpress 部署** 

### 创建 MySQL 配置

```yaml
apiVersion: v1
data:
  db-host: mysql-sts
kind: ConfigMap
metadata:
  name: mycm
```

### 使用 NFS 存储

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-wp
spec:
  storageClassName: couse-nfs-storage
  accessModes:
  - ReadWriteMany
  resources:
     requests:
       storage: 12G
```

### Deployment 创建

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      #nodeSelector:
        #wordpress: mysql
      containers:
        - image: wordpress:4.8-apache
          name: wordpress
          imagePullPolicy: IfNotPresent
          env:
            - name: WORDPRESS_DB_HOST
              valueFrom:
                configMapKeyRef:
                  name: mycm
                  key: db-host
            - name: WORDPRESS_DB_USER
              valueFrom:
                secretKeyRef:
                  name: mysecret
                  key: username
            - name: WORDPRESS_DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysecret
                  key: password
          ports:
            - containerPort: 80
              name: wordpress
          resources:
            requests:
              cpu: 0.5
          volumeMounts:
            - name: wordpress-local-storage
              readOnly: false
              mountPath: /var/www/html
      volumes:
        - name: wordpress-local-storage
          persistentVolumeClaim:
            claimName: pvc-wp
```

### Service 创建

```yaml
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30180
  selector:
    app: wordpress
  type: NodePort
```

###  Ingress创建

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wordpress
spec:
  rules:
  - host: wp.tuling.com
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: wordpress
            port:
              number: 80
```

## **4.HPA 的建立** 

```sh
kubectl autoscale deployment wordpress --min=1 --max=40 --cpu-percent=3
```

## 5. **性能测试软件** 

### **1.使用 ab 软件测试**

ab 是 apache 自带的一款功能强大的测试工具,安装了 apache 一般就自带了, 一般我们用到的是-n，-t 和-c 

```sh
yum install httpd-tools -y

# 这个表示一共处理 10000 个请求,每次并发运行 1000 次 index.php 文件
ab -c 1000 -n 10000 http://192.168.56.5:30180/

#这个表示 10000 个请求 2000s,每次并发运行 1000 次
ab -c 1000 -t 2000 http://192.168.56.5:30180/
```

### **2.使用 Forti**

可以直接部署 fortio 应用：

```
kubectl apply -f samples/httpbin/sample-client/fortio-deploy.yaml
```

登入客户端 Pod 并使用 Fortio 工具调用 httpbin 服务。-curl 参数表明发送一次调用：

```sh
export FORTIO_POD=$(kubectl get pods -l app=fortio -o 'jsonpath={.items[0].metadata.name}')
kubectl exec "$FORTIO_POD" -c fortio -- /usr/bin/fortio curl -quiet http://wordpress/
```

发送并发数为 2 的连接（-c 2），请求 20 次（-n 20）：

```sh
kubectl exec "$FORTIO_POD" -c fortio -- /usr/bin/fortio load -c 20 -qps 0 -n 2000 -loglevel Warning http://wordpress/
```

