from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from ..src.users.utils import create_admin
from ..src.core.routers import api_router


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await create_admin()
#     yield


def create_app():
    app = FastAPI(
        title="APP",
        version="0.0.1",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
        # lifespan=lifespan
    )

    app.include_router(api_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    return app
