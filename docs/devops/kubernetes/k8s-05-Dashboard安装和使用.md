# Dashboard

## **Dashboard 安装和介绍**

### **1 dashboard 安装** 

第一步：安装文件和 image

> Dashboard project
>
> https://github.com/kubernetes/dashboard

```sh
yum install wget -y
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml
change image pull and service type
kubectl apply -f kubernetes-dashboard.yaml
```

第二步：查看 dashboard 的 POD 是否正常启动，如果正常说明安装成功

```sh
 kubectl get pods --namespace=kube-system
```

第三步：配置外网访问（不配置的话默认只能集群内访问）

```sh
# 修改 service 配置，将 type: ClusterIP 改成 NodePort 
kubectl edit service kubernetes-dashboard --namespace=kube-system
# 查看外网暴露端口(我们可以看到外网端口是 32240)
 kubectl get service --namespace=kube-system
```

### **2.访问 dashboard** 

- 创建 dashboard 用户

  ​	创建 admin-token.yaml 文件，文件内容如下：

```yaml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
 name: dashboard-admin
 annotations:
  rbac.authorization.kubernetes.io/autoupdate: "true"
roleRef:
 kind: ClusterRole
 name: cluster-admin
 apiGroup: rbac.authorization.k8s.io
subjects:
- kind: ServiceAccount
  name: dashboard-admin
  namespace: kube-system
--- 
apiVersion: v1
kind: ServiceAccount
metadata:
 name: dashboard-admin
 namespace: kube-system
 labels:
   kubernetes.io/cluster-service: "true"
   addonmanager.kubernetes.io/mode: Reconcile
```

- 创建用户

```sh
 kubectl create -f admin-token.yaml
```

- 获取登陆 token

```sh
 kubectl describe secret/$(kubectl get secret -n=kube-system |grep admin|awk '{print $1}') -n=kube-system
```

- 使用 kubeconf 登陆

```sh
DASH_TOCKEN=$(kubectl get secret -n kube-system dashboard-admin-token-5kzp5 -o jsonpath={.data.token}|base64 -d)

kubectl config set-cluster kubernetes --server=192.168.56.5:6443 --kubeconfig=/root/dashbord-admin.conf

kubectl config set-credentials dashboard-admin --token=$DASH_TOCKEN --kubeconfig=/root/dashbord-admin.conf

kubectl config set-context dashboard-admin@kubernetes --cluster=kubernetes --user=dashboard-admin --kubeconfig=/root/dashbord-admin.conf

kubectl config use-context dashboard-admin@kubernetes --kubeconfig=/root/dashbord-admin.conf\
```

生成的 dashbord-admin.conf 即可用于登录 dashboard

- 使用用户名和密码登陆。

```sh
# 如果你的环境内不止一个 master,那 basic-auth-file 这个文件要在每一个 master 上生成,并 保证路径及内容和其他 master 一致！并且每个 master 都要修改 kube-apiserver.yaml 文件！

# 创建用户文件 user,password,userID userID 不可重复
echo 'admin,admin,1' > /etc/kubernetes/pki/basic_auth_file
# 修改配置
vim /etc/kubernetes/manifests/kube-apiserver.yaml
# 增加如下参数
- --basic-auth-file=/etc/kubernetes/pki/basic_auth_file
# 重启 api-server

# 更新配置
kubectl apply -f /etc/kubernetes/manifests/kube-apiserver.yaml

# 将用户与权限绑定
kubectl create clusterrolebinding login-on-dashboard-with-cluster-admin --clusterrole=cluster-admin --user=admin

# 查看绑定
kubectl get clusterrolebinding login-on-dashboard-with-cluster-admin

# 修改 kubernetes-dashboard.yaml
# 开启 authentication-mode=basic 配置
args:
 - --auto-generate-certificates
 - --namespace=kubernetes-dashboard
 - --token-ttl=43200
 - --authentication-mode=basic
 
# 更新 kubernetes-dashboard
kubectl apply -f kubernetes-dashboard.yaml
```

#### **3.dashboard 使用** 

创建 pod,service,deployment and application



  

​		



