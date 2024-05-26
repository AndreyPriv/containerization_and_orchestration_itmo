## Лабораторная 3 Kubernetes

### Запуск
```commandline
cd lab3
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/lab3/docs/1.png)
___
**Создание объектов через CLI**
- Запускаем minikube и создаем yml-файлы (манифесты) конфигмапы, сервиса и деплоймента.
  - Осуществляем махинации над манифестами:
      - Для постгреса перенести POSTGRES_USER и POSTGRES_PASSWORD из конфигмапы в секреты (очевидно, понадобится новый манифест для сущности Secret)
      - Для некстклауда перенести его переменные (NEXTCLOUD_UPDATE, ALLOW_EMPTY_PASSWORD и проч.) из деплоймента в конфигмапу (очевидно, понадобится новый манифест для сущности ConfigMap)
      - Для некстклауда добавить Liveness и Readiness пробы
```commandline
minikube start
kubectl create -f pg_configmap.yml
kubectl create -f postgres-secrets.yml
kubectl create -f pg_service.yml
kubectl create -f pg_deployment.yml
kubectl create -f nextcloud_configmap.yml
kubectl create -f nextcloud.yml
```

```commandline
kubectl get pods
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/docs/1.png)
___
```commandline
kubectl get configmap
kubectl get deployment
kubectl get secret
kubectl get service
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/docs/4.png)
___
```commandline
kubectl describe pod <pod_name>
```

![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/docs/2.png)

___
```commandline
kubectl config view
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/docs/3.png)
___

### Вопросы
**Bажен ли порядок выполнения этих манифестов? Почему?**

Да, порядок выполнения этих манифестов важен по следующим причинам:
- **pg_configmap.yml** и **postgres-secrets.yml** создают ConfigMap и Secret, которые нужны для настройки и запуска PostgreSQL. Эти ресурсы должны быть созданы до создания деплоя PostgreSQL, так как деплой использует эти ресурсы для настройки окружения контейнера.
- **pg_service.yml** создает сервис, который предоставляет доступ к базе данных PostgreSQL через сеть Kubernetes. Это важно, чтобы Nextcloud мог подключиться к базе данных по имени сервиса 'postgres-service'
- **pg_deployment.yml** создает деплой PostgreSQL, который зависит от существования ConfigMap и Secret, чтобы успешно запуститься.
- **nextcloud_configmap.yml** создает ConfigMap для Nextcloud, который содержит настройки, необходимые для инициализации и конфигурации Nextcloud.
- **nextcloud.yml** создает деплой Nextcloud, который использует ConfigMap и Secret для своей конфигурации, а также подключается к базе данных PostgreSQL через сервис postgres-service.



**Что (и почему) произойдет, если отскейлить количество реплик postgres-deployment в 0, затем обратно в 1, после чего попробовать снова зайти на Nextcloud?**

- Когда количество реплик PostgreSQL устанавливается в 0, все поды PostgreSQL будут остановлены. Это приведет к недоступности базы данных для всех клиентов, включая Nextcloud.
- Когда снова устанавим количество реплик в 1, будет создан новый под PostgreSQL. Он будет использовать существующие ConfigMap и Secret для настройки и запуска.
- Пока база данных недоступна (в промежутке между остановкой и запуском новых реплик), Nextcloud не сможет подключиться к базе данных и, вероятно, увидим ошибки подключения в Nextcloud.
- После запуска новой реплики PostgreSQL и завершения ее инициализации Nextcloud снова сможет подключиться к базе данных.
