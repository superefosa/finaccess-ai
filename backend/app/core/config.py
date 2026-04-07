from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FinAccess AI API"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24

    database_url: str
    cors_origins: str = "http://localhost:5173"
    model_path: str = "/opt/render/project/src/backend/app/model/credit_model.joblib"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
        protected_namespaces=("settings_",),
    )


settings = Settings()