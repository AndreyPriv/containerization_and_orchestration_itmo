from fastapi import FastAPI
import redis

app = FastAPI()

r = redis.Redis(host='redis', port=6379)

@app.get("/")
def read_root():
    r.incr('hits')
    return {"message": "Welcome to FastAPI with Redis!", "hits": r.get('hits')}
