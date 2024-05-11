from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.auth import Admin, CurrentUser
from ..users.schemas import (
    UserPage,
    UserPagination,
    UserRequest,
    UserResponse,
    UserUpdateRequest,
)

from ..users.services import create_user, delete_user, list_users, update_user
from ..core.database import get_db
from ..core.schemas import ExceptionSchema
from ..users.models import User

router = APIRouter(prefix="/user")


@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"model": ExceptionSchema},
    },
    status_code=status.HTTP_200_OK,
    tags=["user"],
)
async def user_get(user: CurrentUser) -> UserResponse:
    return UserResponse.model_validate(user)


@router.put(
    "/",
    response_model=UserResponse,
    responses={
        status.HTTP_401_UNAUTHORIZED: {"model": ExceptionSchema},
        status.HTTP_409_CONFLICT: {"model": ExceptionSchema},
    },
    tags=["user"],
)
async def user_update(
        user: CurrentUser,
        payload: UserUpdateRequest,
        db: AsyncSession = Depends(get_db),
) -> UserResponse:
    if updated_user := await update_user(user=user, payload=payload, db=db):
        return updated_user
    raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail=f"User '{payload.username}' already exists",
    )


@router.delete(
    "/",
    responses={status.HTTP_401_UNAUTHORIZED: {"model": ExceptionSchema}},
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["user"],
)
async def user_delete(user: CurrentUser, db: AsyncSession = Depends(get_db)) -> None:
    await delete_user(user=user, db=db)
    return None


@router.get(
    "/search",
    response_model=List[UserResponse],
    responses={status.HTTP_401_UNAUTHORIZED: {"model": ExceptionSchema}},
    tags=["user"],
)
async def user_search(
        query: str,
        db: AsyncSession = Depends(get_db),
) -> List[UserResponse]:
    results = await db.execute(
        select(User).filter(
            (
                    User.username.ilike(f"%{query}%") |
                    User.first_name.ilike(f"%{query}%") |
                    User.last_name.ilike(f"%{query}%")
            )
        )
    )
    users = results.scalars().all()

    return [UserResponse.model_validate(user) for user in users]


@router.get(
    "/all",
    response_model=UserPage,
    responses={status.HTTP_401_UNAUTHORIZED: {"model": ExceptionSchema}},
    tags=["user"],
)
async def users_list(
        pagination: UserPagination = Depends(),
        db: AsyncSession = Depends(get_db),
) -> UserPage:
    return await list_users(
        page=pagination.page,
        size=pagination.size,
        sort=pagination.sort,
        order=pagination.order,
        db=db,
    )
