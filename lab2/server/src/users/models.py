from sqlalchemy import Boolean, Column, String, Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import JSONB
from server.src.core.models import Model

from server.src.users.enums import Education, City, Language, Hard, Soft, Country, Industry, Experience


class User(Model):
    __tablename__ = "User"
    username = Column(name="username", type_=String, unique=True, index=True)
    password = Column(name="password", type_=String)
    email = Column(name="email", type_=String)
    country = Column(SQLAlchemyEnum(Country))
    city = Column(SQLAlchemyEnum(City))
    telegram = Column(name="telegram", type_=String)
    linkedin = Column(name="linkedin", type_=String)
    github = Column(name="github", type_=String)
    education = Column(SQLAlchemyEnum(Education))
    industry = Column(SQLAlchemyEnum(Industry))
    experience = Column(SQLAlchemyEnum(Experience))
    language = Column(SQLAlchemyEnum(Language))
    hard = Column(SQLAlchemyEnum(Hard))
    soft = Column(SQLAlchemyEnum(Soft))
    first_name = Column(name="first_name", type_=String, nullable=True)
    last_name = Column(name="last_name", type_=String, nullable=True)
    active = Column(name="active", type_=Boolean)
    role = Column(name="role", type_=String)

