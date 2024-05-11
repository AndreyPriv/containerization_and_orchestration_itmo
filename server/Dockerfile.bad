from python:latest

workdir /app

copy ./requirements.txt /app/server/requirements.txt
copy ./alembic.ini /app/alembic.ini
copy ./src /app/server/src

run pip install --no-cache-dir --upgrade -r /app/server/requirements.txt

cmd ["uvicorn", "server.src.main:app", "--host", "0.0.0.0", "--port", "8000"]

volume /app/data
