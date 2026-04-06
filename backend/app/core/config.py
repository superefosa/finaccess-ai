from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "FinAccess AI API"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite:///./finaccess.db"
    cors_origins: str = "http://localhost:5173"
    model_path: str = "/app/model/credit_model.joblib"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
