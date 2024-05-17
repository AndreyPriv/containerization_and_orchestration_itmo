from fastapi import APIRouter

from server.src.auth import auth_router
from server.src.users import users_router
from server.src.common import common_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(common_router)
