from typing import Annotated

from fastapi import Depends, APIRouter

from server.src.core.settings import Settings, get_settings

router = APIRouter(tags=["common"], prefix="/common")


@router.get("/")
def read_root():
    return {"Hello": "World"}


@router.get("/info")
async def info(settings: Annotated[Settings, Depends(get_settings)]):
    return {
        "app_name": settings.app_title,
        "environment": settings.environment,
    }
