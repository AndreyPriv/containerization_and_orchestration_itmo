import uvicorn
from server.src.app import create_app
from server.src.core.settings import get_settings


app = create_app()

if get_settings().environment == "development":
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
