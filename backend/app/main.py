from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, profiles, applications, admin
import app.models  # noqa: F401

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(applications.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message":"FinAccess backend is running"}
