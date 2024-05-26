from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, model_validator

from server.src.auth.utils import get_password_hash
from server.src.users.enums import Order, Roles, Sort
from server.src.core.schemas import PageSchema, PaginationSchema, ResponseSchema

from server.src.users.models import Education, City, Language, Hard, Soft, Country, Industry, Experience


class UserRequest(BaseModel):
    username: str
    password: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None


class UserCreate(UserRequest):
    active: bool = True
    role: Roles = Roles.USER

    @model_validator(mode="after")
    def validator(cls, values: "UserCreate") -> "UserCreate":
        values.password = get_password_hash(values.password)
        return values


class UserResponse(ResponseSchema):
    username: str
    email: EmailStr
    first_name: str | None
    last_name: str | None
    country: Country | None
    city: City | None
    telegram: str | None
    linkedin: str | None
    github: str | None
    education: Education | None
    industry: Industry | None
    experience: Experience | None
    language: Language | None
    hard: Hard | None
    soft: Soft | None
    active: bool
    role: Roles
    create_date: datetime
    update_date: datetime


class UserUpdateRequest(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    telegram: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    education: Optional[str] = None
    industry: Optional[str] = None
    experience: Optional[str] = None
    language: Optional[str] = None
    hard: Optional[str] = None
    soft: Optional[str] = None


class UserUpdateRequestAdmin(UserUpdateRequest):
    active: bool | None = None
    role: Roles | None = None


class UserUpdate(UserUpdateRequestAdmin):
    @model_validator(mode="after")
    def validator(cls, values: "UserUpdate") -> "UserUpdate":
        if password := values.password:
            values.password = get_password_hash(password)
        return values


class UserPage(PageSchema):
    users: list[UserResponse]


class UserPagination(PaginationSchema):
    sort: Sort = Sort.ID
    order: Order = Order.ASC


class UserId(BaseModel):
    user_id: int


class Username(BaseModel):
    username: str
