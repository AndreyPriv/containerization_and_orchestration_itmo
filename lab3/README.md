## Лабораторная 3 Kubernetes

### Запуск
```commandline
cd lab3
```
```commandline
minikube start
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/master/docs/1.png)

**Создание объектов через CLI**

```commandline
kubectl create -f pg_configmap.yml
kubectl create -f postgres-secrets.yml
kubectl create -f pg_service.yml
kubectl create -f pg_deployment.yml
kubectl create -f nextcloud_configmap.yml
kubectl create -f nextcloud.yml
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/master/docs/2.png)


