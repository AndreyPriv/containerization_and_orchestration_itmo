from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.src.auth.schemas import Credentials, Refresh, Token
from server.src.auth.services import (
    authenticate_refresh_token,
    authenticate_user,
    generate_token,
)
from server.src.core.database import get_db
from server.src.core.schemas import ExceptionSchema

from server.src.users.schemas import UserRequest
from server.src.users.services import create_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/login",
    response_model=Token,
    responses={401: {"model": ExceptionSchema}},
)
async def token(credentials: Credentials, db: AsyncSession = Depends(get_db)) -> dict:
    if user := await authenticate_user(
            username=credentials.username,
            password=credentials.password,
            db=db,
    ):
        return await generate_token(
            user_id=user.id
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post(
    "/signup",
    response_model=Token,
    responses={
        status.HTTP_409_CONFLICT: {"model": ExceptionSchema},
    },
    status_code=status.HTTP_201_CREATED,
)
async def user_create(
        user: UserRequest, db: AsyncSession = Depends(get_db)
) -> Token:
    if created_user := await create_user(user=user, db=db):
        return await generate_token(
            user_id=created_user.id
        )
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=f"User '{user.username}' already exists",
    )


@router.post(
    "/refresh",
    response_model=Token,
    responses={401: {"model": ExceptionSchema}},
)
async def refresh(request: Refresh, db: AsyncSession = Depends(get_db)) -> dict:
    if new_token := await authenticate_refresh_token(
            token=request.refresh_token, db=db
    ):
        return new_token
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
