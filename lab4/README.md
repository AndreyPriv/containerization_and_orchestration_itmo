## Лабораторная 3 Kubernetes

### Описание
**Создание объектов через CLI**
- Разворачиваем свой собственный сервис в Kubernetes, по аналогии с ЛР 3
  - минимум два Deployment, по количеству сервисов 
  - кастомный образ для минимум одного Deployment (т.е. не публичный и собранный из своего Dockerfile)
  - минимум один Deployment должен содержать в себе контейнер и инит-контейнер 
  - минимум один Deployment должен содержать volume (любой)
  - обязательно использование ConfigMap и/или Secret 
  - обязательно Service хотя бы для одного из сервисов (что логично, если они работают в связке)
  - Liveness и/или Readiness пробы минимум в одном из Deployment 
  - обязательно использование лейблов (помимо обязательных selector/matchLabel, конечно)


- **configmap.yml**
  - Используется для хранения конфигурационных данных, которые могут быть использованы контейнерами в поде. В данном случае, хранится одна переменная окружения APP_ENV, установленная в значение production.
- **Dockerfile**
  - Описывает процесс создания Docker-образа для FastAPI-приложения. Используется образ Python 3.10, устанавливаются зависимости из requirements.txt, копируются все файлы приложения, и запускается приложение с помощью Uvicorn
- **fastapi-deployment-and-service.yml**
  - Разворачивает две реплики приложения FastAPI, используя кастомный образ. Включает init-контейнер, использует ConfigMap и Secret, монтирует volume и определяет livenessProbe.
  - Создает сервис для FastAPI, который позволяет другим приложениям взаимодействовать с ним.
- **redis-deployment-and-service.yml**
  - Разворачивает одну реплику Redis.
  - Создает сервис для Redis, позволяя другим приложениям, таким как FastAPI, взаимодействовать с Redis.
- **secret.yml**
  - Используется для хранения конфиденциальных данных. В данном случае, хранится секретный ключ SECRET_KEY
- main.py
  - Простое приложение, которое подключается к Redis и увеличивает счетчик при каждом запросе к корневому URL (/).
___
### Запуск
```commandline
cd lab3
```
  
```commandline
minikube start
```
**Билдим локальный образ и загружаем его в Minikube:**
- Используется для настройки окружения командной строки Windows (cmd) для работы с Docker, который управляется Minikube.
```commandline
@FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i
```
```commandline
docker build -t fastapi-app:local .
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/lab4/docs/1.png)

```commandline
kubectl create -f configmap.yml
kubectl create -f secret.yml
kubectl create -f fastapi-deployment-and-service.yml
kubectl create -f redis-deployment-and-service.yml
```

**OpenAPI:**
```commandline
minikube service fastapi-service --url
```
```commandline
http://localhost:30007/docs
```

___
```commandline
kubectl get pods
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/lab3/docs/1.png)
___
```commandline
kubectl get configmap
kubectl get deployment
kubectl get secret
kubectl get service
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/lab3/docs/4.png)
___
```commandline
kubectl describe pod <pod_name>
```

![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/lab3/docs/2.png)

___
```commandline
kubectl config view
```
![image](https://github.com/AndreyPriv/containerization_and_orchestration_itmo/blob/main/lab3/docs/3.png)
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
