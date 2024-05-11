# containerization_and_orchestration_itmo
Контейнеризация и оркестрация приложений, ITMO, весна 2024

## Лабораторная 1

### Запуск
```commandline
cd server
```
```commandline
docker build -t test_name .
```
```commandline
docker run -d --name test_name -p 8000:8000 test_name
```
```commandline
OpenAPI: http://localhost:8000/api/docs
```
### Описание Dockerfile

**Плохой Dockerfile**
```
FROM python:latest

WORKDIR /app

COPY ./requirements.txt /app/server/requirements.txt
COPY ./alembic.ini /app/alembic.ini
COPY ./src /app/server/src

RUN pip install --no-cache-dir --upgrade -r /app/server/requirements.txt

CMD ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]

VOLUME /app/data
```


**Хороший Dockerfile**
```
FROM python:3.10

WORKDIR /app

COPY ./requirements.txt /app/server/requirements.txt
COPY ./alembic.ini /app/alembic.ini
COPY ./src /app/server/src

RUN pip install --no-cache-dir --upgrade -r /app/server/requirements.txt

CMD ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]

VOLUME /app/data
```
Создает Docker-образа на базе Python 3.10.
- **FROM python:3.10** - устанавливает базовый образ, от которого будет строиться новый образ. В данном случае используется официальный образ Python версии 3.10.


- **WORKDIR /app** - устанавливает рабочую директорию внутри контейнера на /app.


- **COPY ./requirements.txt /app/server/requirements.txt \ ./alembic.ini /app/alembic.ini \ ./src /app/server/src** - копирует несколько файлов из контекста сборки (директории, где находится Dockerfile) в указанные пути внутри контейнера:
    - **requirements.txt** - файл с перечнем зависимостей Python, которые нужно установить.
    - **alembic.ini** - конфигурационный файл для Alembic (инструмента для миграций баз данных). 
    - **src** - директория, содержащая исходный код приложения.


- **RUN pip install --no-cache-dir --upgrade -r /app/server/requirements.txt** - устанавливает зависимости Python, перечисленные в файле requirements.txt, используя pip. Флаг --no-cache-dir предотвращает использование кэша пакетов, а --upgrade обновляет пакеты до последней версии.
- **CMD ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]** - запускает сервер uvicorn с приложением, определенным в модуле main из пакета server.src, на хосте "0.0.0.0" и порту "8000".
- **VOLUME /app/data** - Все данные, которые будут записаны в этот каталог внутри контейнера, будут сохранены за пределами контейнера, что позволит сохранить их даже после остановки или удаления контейнера.


### Плохие и хорошие практики
1. **Использование FROM python:latest в Dockerfile не рекомендуется**:
    - Тег latest указывает на самую свежую версию базового образа на момент сборки. Однако содержимое образа с тегом latest может меняться со временем по мере выхода новых версий. Это означает, что при повторной сборке контейнера через некоторое время вы можете получить совершенно другой результат, так как базовый образ изменился. Это нарушает принцип воспроизводимости сборки.
    - Тег latest не указывает на точную версию базового образа, что затрудняет отслеживание зависимостей и воспроизведение среды в будущем.
    - Новые версии базового образа могут содержать изменения, которые ломают совместимость с вашим приложением. Использование latest может привести к непредвиденным сбоям или ошибкам после обновления базового образа.
2. **Рекомендуется использовать apt-get update**:
    - Обновление списков пакетов: Когда вы устанавливаете новый пакет или обновляете существующий, ваша операционная система должна знать, где искать эти пакеты. apt-get update обновляет список доступных пакетов из репозиториев, чтобы ваша система могла быть уверена, что она имеет самые актуальные сведения о доступных пакетах и их версиях
    - Предотвращение ошибок установки: Если вы не выполняете apt-get update перед установкой новых пакетов, то можете столкнуться с ошибками, связанными с тем, что версии пакетов в списках пакетов устарели или недоступны.
    - Обеспечение безопасности: Обновление списка пакетов также важно с точки зрения безопасности. Новые обновления могут содержать исправления уязвимостей, и обновление списка пакетов поможет вам убедиться, что вы получаете последние безопасные версии пакетов.

### Когда НЕ стоит использовать контейнеры в целом
1. **Малые проекты или микросервисы с низкой степенью изоляции:** 
    - Если ваш проект очень маленький или не требует сложной инфраструктуры, контейнеры могут быть избыточны. Например, если у вас есть простое приложение на одном языке программирования без зависимостей, которые необходимо изолировать, просто установка его на хост-машину может быть более простым и менее накладным способом.
2. **Локальная разработка на отдельных машинах:**
   - Если ваша команда работает на отдельных машинах и не нуждается в стандартизации среды разработки, контейнеры могут быть излишними. Вместо этого, каждый разработчик может настроить свою среду в соответствии с собственными предпочтениями.