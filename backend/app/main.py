"""
MealMate Backend API
A FastAPI application for recipe management and meal planning
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from pathlib import Path

from app.core.config import settings
from app.core.database import create_tables
from app.api.v1.api import api_router
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    setup_logging()
    await create_tables()
    
    # Create upload directory if it doesn't exist
    upload_path = Path(settings.UPLOAD_PATH)
    upload_path.mkdir(parents=True, exist_ok=True)
    
    yield
    
    # Shutdown
    pass


def create_application() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title="MealMate API",
        description="Backend API for MealMate recipe management application",
        version="1.0.0",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Add trusted host middleware
    if not settings.DEBUG:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=settings.ALLOWED_HOSTS
        )

    # Include API routes
    app.include_router(api_router, prefix="/api/v1")

    # Mount static files
    if os.path.exists(settings.UPLOAD_PATH):
        app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_PATH), name="uploads")

    @app.get("/")
    async def root():
        """Root endpoint"""
        return {
            "message": "Welcome to MealMate API",
            "version": "1.0.0",
            "docs": "/docs" if settings.DEBUG else "Documentation not available in production"
        }

    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {"status": "healthy", "environment": settings.ENVIRONMENT}

    return app


# Create the application instance
app = create_application()
