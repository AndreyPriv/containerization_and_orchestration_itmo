import uvicorn
from ..src.app import create_app
from ..src.core.settings import get_settings

app = create_app()

if __name__ == "__main__":
    settings = get_settings()
    if settings.environment == "development":
        uvicorn.run(app, host="0.0.0.0", port=settings.server_port)