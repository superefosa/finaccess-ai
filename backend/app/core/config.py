import os
from dotenv import load_dotenv

# Load .env file from the current directory
load_dotenv()


class Settings:
    # Use lowercase to match what Pydantic expects
    app_name: str = "FinAccess AI API"
    secret_key: str = os.getenv("SECRET_KEY", "finaccess-local-secret-key-2026")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./finaccess.db")  # lowercase!
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    model_path: str = os.getenv("MODEL_PATH", "../ai/model/credit_model.joblib")


settings = Settings()