from functools import lru_cache

from pydantic import model_validator, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_title: str = "Hackathon App API"
    version: str = "1.0.0"

    environment: str

    admin_username: str = "admin"
    admin_password: str = "admin"
    admin_email: str = "admin@admin.admin"

    access_token_expire_minutes: int
    refresh_token_expire_days: int
    secret_key: str
    algorithm: str = "HS256"

    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host: str
    postgres_port: int
    postgres_uri: str | None = None

    server_port: int
    client_port: int

    model_config = SettingsConfigDict(env_file="../.env")

    @model_validator(mode="after")
    def validator(cls, values: "Settings") -> "Settings":
        values.postgres_uri = (
            f"{values.postgres_user}:{values.postgres_password}@"
            f"{values.postgres_host}:{values.postgres_port}/{values.postgres_db}"
        )
        return values


try:
    Settings()
except ValidationError as exc:
    print(repr(exc.errors()[0]['type']))


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
