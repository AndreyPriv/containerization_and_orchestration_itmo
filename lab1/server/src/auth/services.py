from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError, jwt
from jose.exceptions import JWTClaimsError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.enums import TokenType
from ..auth.utils import verify_password
from ..users.enums import Roles
from ..users.models import User
from ..core.database import get_db
from ..core.settings import settings


async def validate_user(user: User) -> User:
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your account is blocked",
        )
    return user


async def authenticate_user(
        username: str, password: str, db: AsyncSession
) -> User | None:
    user = (
        (await db.execute(select(User).filter_by(username=username)))
        .scalars()
        .one_or_none()
    )
    if user and verify_password(plain_password=password, hashed_password=user.password):
        return await validate_user(user=user)
    return None


async def authenticate_token(
        user_id: int,
        db: AsyncSession,
) -> User | None:
    user: User | None = await db.get(User, user_id)
    return await validate_user(user=user)


async def generate_token(
        user_id: int
) -> dict:
    access = {
        "user_id": user_id,
        "exp": datetime.utcnow()
               + timedelta(minutes=settings.access_token_expire_minutes),
        "token_type": TokenType.ACCESS,
    }
    refresh = access.copy()
    refresh.update(
        {
            "exp": datetime.utcnow()
                   + timedelta(days=settings.refresh_token_expire_days),
            "token_type": TokenType.REFRESH,
        }
    )
    access_token = jwt.encode(access, settings.secret_key, algorithm=settings.algorithm)
    refresh_token = jwt.encode(
        refresh, settings.secret_key, algorithm=settings.algorithm
    )
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


async def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=settings.algorithm)
    except (JWTError, ExpiredSignatureError, JWTClaimsError):
        return {}


async def authenticate_access_token(
        token: str, db: AsyncSession, roles: list | None = None
) -> User | None:
    payload = await decode_token(token)
    if payload and payload.get("token_type") == TokenType.ACCESS:
        if user := await authenticate_token(
                user_id=payload["user_id"],
                db=db,
        ):
            if not roles or user.role in roles:
                return user
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access restricted. "
                       f"Only {roles} are allowed to access this endpoint.",
            )
    return None


async def authenticate_refresh_token(token: str, db: AsyncSession) -> dict | None:
    payload = await decode_token(token)
    if payload and payload.get("token_type") == TokenType.REFRESH:
        if user := await authenticate_token(
                user_id=payload["user_id"],
                db=db,
        ):
            return await generate_token(
                user_id=user.id,
            )
    return None


async def authenticate(token: str, db: AsyncSession, roles: list | None = None) -> User:
    if user := await authenticate_access_token(token=token, roles=roles, db=db):
        return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Invalid or expired token {user} ",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def auth(
        token: HTTPAuthorizationCredentials = Security(HTTPBearer()),
        db: AsyncSession = Depends(get_db),
) -> User:
    return await authenticate(token=token.credentials, db=db)


async def auth_admin(
        token: HTTPAuthorizationCredentials = Security(HTTPBearer()),
        db: AsyncSession = Depends(get_db),
) -> User:
    return await authenticate(token=token.credentials, db=db, roles=[Roles.ADMIN.value])
