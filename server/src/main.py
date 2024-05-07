import uvicorn
from src.app import create_app
from src.core.settings import get_settings


app = create_app()

if get_settings().environment == "development":
    uvicorn.run(app, host="0.0.0.0", port=8000)
