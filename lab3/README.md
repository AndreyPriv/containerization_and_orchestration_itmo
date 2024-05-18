## Лабораторная 3 Kubernetes

### Запуск
```commandline
cd lab3\server
```
**Часть 2 шаг 1**
```commandline
echo apiVersion: v1 > pg_configmap.yml
echo kind: ConfigMap >> pg_configmap.yml
echo metadata: >> pg_configmap.yml
echo   name: postgres-configmap >> pg_configmap.yml
echo   labels: >> pg_configmap.yml
echo     app: postgres >> pg_configmap.yml
echo data: >> pg_configmap.yml
echo   POSTGRES_DB: "postgres" >> pg_configmap.yml
echo   POSTGRES_USER: "postgres" >> pg_configmap.yml
echo   POSTGRES_PASSWORD: "password" >> pg_configmap.yml

```
```commandline
echo apiVersion: v1 > pg_service.yml
echo kind: Service >> pg_service.yml
echo metadata: >> pg_service.yml
echo   name: postgres-service >> pg_service.yml
echo   labels: >> pg_service.yml
echo     app: postgres >> pg_service.yml
echo spec: >> pg_service.yml
echo   type: NodePort >> pg_service.yml
echo   ports: >> pg_service.yml
echo     - port: 5432 >> pg_service.yml
echo   selector: >> pg_service.yml
echo     app: postgres >> pg_service.yml

```
```commandline
echo apiVersion: apps/v1 > pg_deployment.yml
echo kind: Deployment >> pg_deployment.yml
echo metadata: >> pg_deployment.yml
echo   name: postgres >> pg_deployment.yml
echo spec: >> pg_deployment.yml
echo   replicas: 1 >> pg_deployment.yml
echo   selector: >> pg_deployment.yml
echo     matchLabels: >> pg_deployment.yml
echo       app: postgres >> pg_deployment.yml
echo   template: >> pg_deployment.yml
echo     metadata: >> pg_deployment.yml
echo       labels: >> pg_deployment.yml
echo         app: postgres >> pg_deployment.yml
echo     spec: >> pg_deployment.yml
echo       containers: >> pg_deployment.yml
echo         - name: postgres-container >> pg_deployment.yml
echo           image: postgres:14 >> pg_deployment.yml
echo           resources: >> pg_deployment.yml
echo             limits: >> pg_deployment.yml
echo               cpu: 200m >> pg_deployment.yml
echo               memory: 256Mi >> pg_deployment.yml
echo             requests: >> pg_deployment.yml
echo               cpu: 100m >> pg_deployment.yml
echo               memory: 128Mi >> pg_deployment.yml
echo           imagePullPolicy: 'IfNotPresent' >> pg_deployment.yml
echo           ports: >> pg_deployment.yml
echo             - containerPort: 5432 >> pg_deployment.yml
echo           envFrom: >> pg_deployment.yml
echo             - configMapRef: >> pg_deployment.yml
echo                 name: postgres-configmap >> pg_deployment.yml
```
**Часть 2 шаг 2**

```commandline
kubectl create –f pg_configmap.yml
```
```commandline
kubectl create –f pg_service.yml
```
```commandline
kubectl create –f pg_deployment.yml
```
**Часть 2 шаг 3**

```commandline
kubectl describe configmap/postgres-configmap
```
```commandline
kubectl describe service/postgres-service
```
```commandline
kubectl describe deployment.apps/postgres
```
**Часть 2 шаг 4**
```commandline
@echo off
(
echo apiVersion: v1
echo kind: Secret
echo metadata:
echo   name: nextcloud-secret
echo   labels:
echo     app: nextcloud
echo type: Opaque
echo stringData:
echo   NEXTCLOUD_ADMIN_PASSWORD: "password"
echo ---
echo kind: Deployment
echo apiVersion: apps/v1
echo metadata:
echo   name: nextcloud
echo   labels:
echo     app: nextcloud
echo spec:
echo   replicas: 1
echo   selector:
echo     matchLabels:
echo       app: nextcloud
echo   template:
echo     metadata:
echo       labels:
echo         app: nextcloud
echo     spec:
echo       containers:
echo       - name: nextcloud
echo         image: docker.io/nextcloud:stable-apache
echo         resources:
echo           limits:
echo             cpu: 500m
echo             memory: 256Mi
echo           requests:
echo             cpu: 250m
echo             memory: 128Mi
echo         ports:
echo         - name: http
echo           containerPort: 80
echo           protocol: TCP
echo         env:
echo         - name: NEXTCLOUD_UPDATE
echo           value: '1'
echo         - name: ALLOW_EMPTY_PASSWORD
echo           value: 'yes'
echo         - name: POSTGRES_HOST
echo           value: postgres-service
echo         - name: POSTGRES_DB
echo           valueFrom:
echo             configMapKeyRef:
echo               name: postgres-configmap
echo               key: POSTGRES_DB
echo         - name: NEXTCLOUD_TRUSTED_DOMAINS
echo           value: "127.0.0.1"
echo         - name: POSTGRES_USER
echo           valueFrom:
echo             configMapKeyRef:
echo               name: postgres-configmap
echo               key: POSTGRES_USER
echo         - name: POSTGRES_PASSWORD
echo           valueFrom:
echo             configMapKeyRef:
echo               name: postgres-configmap
echo               key: POSTGRES_PASSWORD
echo         - name: NEXTCLOUD_ADMIN_USER
echo           value: itmo2024
echo         - name: NEXTCLOUD_ADMIN_PASSWORD
echo           valueFrom:
echo             secretKeyRef:
echo               name: nextcloud-secret
echo               key: NEXTCLOUD_ADMIN_PASSWORD
echo         imagePullPolicy: IfNotPresent
echo       restartPolicy: Always
echo       dnsPolicy: ClusterFirst
) > nextcloud.yml
```

```commandline
kubectl create –f nextcloud.yml
```
```commandline
kubectl describe deployment.apps/nextcloud
```

**Часть 2 шаг 5**

```commandline
kubectl get pods
```

```commandline
kubectl logs nextcloud-5ff596fd79-jl5kf
```