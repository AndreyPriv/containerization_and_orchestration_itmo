from fastapi import APIRouter

from ..auth import auth_router
from ..users import users_router
from ..common import common_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(common_router)
