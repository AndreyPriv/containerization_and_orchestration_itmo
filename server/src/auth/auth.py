from typing import Annotated

from fastapi import Depends

from src.auth.services import auth, auth_admin
from src.users.models import User

CurrentUser = Annotated[User, Depends(auth)]
Admin = Annotated[User, Depends(auth_admin)]
