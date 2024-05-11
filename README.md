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
```
Создает Docker-образа на базе Python 3.10.
- **FROM python:3.10** - устанавливает базовый образ, от которого будет строиться новый образ. В данном случае используется официальный образ Python версии 3.10.


- **WORKDIR /app** - устанавливает рабочую директорию внутри контейнера на /app.


- **COPY ./requirements.txt /app/server/requirements.txt \ ./alembic.ini /app/alembic.ini \ ./src /app/server/src** - копирует несколько файлов из контекста сборки (директории, где находится Dockerfile) в указанные пути внутри контейнера:
    - **requirements.txt** - файл с перечнем зависимостей Python, которые нужно установить.
    - **alembic.ini** - конфигурационный файл для Alembic (инструмента для миграций баз данных). 
    - **src** - директория, содержащая исходный код приложения.


- **RUN pip install --no-cache-dir --upgrade -r /app/server/requirements.txt** - устанавливает зависимости Python, перечисленные в файле requirements.txt, используя pip. Флаг --no-cache-dir предотвращает использование кэша пакетов, а --upgrade обновляет пакеты до последней версии.

### Плохие и хорошие практики
1. **Использование FROM python:latest в Dockerfile не рекомендуется**:
    - Тег latest указывает на самую свежую версию базового образа на момент сборки. Однако содержимое образа с тегом latest может меняться со временем по мере выхода новых версий. Это означает, что при повторной сборке контейнера через некоторое время вы можете получить совершенно другой результат, так как базовый образ изменился. Это нарушает принцип воспроизводимости сборки.
    - Тег latest не указывает на точную версию базового образа, что затрудняет отслеживание зависимостей и воспроизведение среды в будущем.
    - Новые версии базового образа могут содержать изменения, которые ломают совместимость с вашим приложением. Использование latest может привести к непредвиденным сбоям или ошибкам после обновления базового образа.