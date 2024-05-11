FROM python:3.10

WORKDIR /app

COPY ./requirements.txt /app/server/requirements.txt
COPY ./alembic.ini /app/alembic.ini
COPY ./src /app/server/src

RUN apt-get update && pip install --no-cache-dir --upgrade -r /app/server/requirements.txt

CMD ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]

VOLUME /app/data
