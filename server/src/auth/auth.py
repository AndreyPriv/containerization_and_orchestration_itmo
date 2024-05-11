from typing import Annotated

from fastapi import Depends

from ..auth.services import auth, auth_admin
from ..users.models import User

CurrentUser = Annotated[User, Depends(auth)]
Admin = Annotated[User, Depends(auth_admin)]
