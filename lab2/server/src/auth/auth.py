from typing import Annotated

from fastapi import Depends

from server.src.auth.services import auth, auth_admin
from server.src.users.models import User

CurrentUser = Annotated[User, Depends(auth)]
Admin = Annotated[User, Depends(auth_admin)]
