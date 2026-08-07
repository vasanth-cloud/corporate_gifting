from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from app.api.v1 import api_router
from app.core.database import engine
from app.models.base import Base
import app.models  # Ensures all ORM models are registered with Base

# Create DB tables if not exist
Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
Path("uploads").mkdir(exist_ok=True)

app = FastAPI(
    title="Corporate Gifting Platform",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

app.include_router(
    api_router,
    prefix="/api/v1",
)