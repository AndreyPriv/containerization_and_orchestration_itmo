from sqlalchemy import exists, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from ..users.enums import Roles
from ..users.models import User
from ..users.schemas import UserCreate
from ..core.database import SessionLocal
from ..core.settings import settings


async def create_admin(db: AsyncSession = SessionLocal()):
    admin_user = User(
        **UserCreate(
            username=settings.admin_username,
            password=settings.admin_password,
            email=settings.admin_email,
            role=Roles.ADMIN,
        ).model_dump()
    )
    try:
        if not await db.scalar(select(exists().where(User.role == Roles.ADMIN))):
            db.add(admin_user)
            await db.commit()
            await db.refresh(admin_user)
    except IntegrityError:
        pass
    finally:
        await db.close()
