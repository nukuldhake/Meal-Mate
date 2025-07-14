"""
Application configuration settings
"""

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from pydantic import Field, validator
from typing import List, Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings"""
    
    # Server Configuration
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")
    DEBUG: bool = Field(default=True, description="Debug mode")
    ENVIRONMENT: str = Field(default="development", description="Environment")
    
    # Database Configuration
    DATABASE_URL: str = Field(default="sqlite:///./mealmate.db", description="Database URL")
    
    # JWT Configuration
    SECRET_KEY: str = Field(..., description="Secret key for JWT tokens")
    ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="Access token expiration")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, description="Refresh token expiration")
    
    # CORS Configuration
    FRONTEND_URL: str = Field(default="http://localhost:5173", description="Frontend URL")
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="Allowed CORS origins"
    )
    ALLOWED_HOSTS: List[str] = Field(default=["*"], description="Allowed hosts")
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = Field(default=5242880, description="Max file size in bytes (5MB)")
    UPLOAD_PATH: str = Field(default="uploads/", description="Upload directory path")
    ALLOWED_EXTENSIONS: List[str] = Field(
        default=["jpg", "jpeg", "png", "gif"],
        description="Allowed file extensions"
    )
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = Field(default=100, description="Rate limit requests")
    RATE_LIMIT_PERIOD: int = Field(default=60, description="Rate limit period in seconds")
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    LOG_FILE: str = Field(default="logs/mealmate.log", description="Log file path")
    
    # Redis Configuration
    REDIS_URL: str = Field(default="redis://localhost:6379/0", description="Redis URL")
    
    # Email Configuration
    SMTP_HOST: Optional[str] = Field(default=None, description="SMTP host")
    SMTP_PORT: Optional[int] = Field(default=587, description="SMTP port")
    SMTP_USERNAME: Optional[str] = Field(default=None, description="SMTP username")
    SMTP_PASSWORD: Optional[str] = Field(default=None, description="SMTP password")
    
    # Dataset Configuration
    DATASET_PATH: str = Field(default="../Cleaned_Indian_Food_Dataset.csv", description="Dataset file path")
    
    @validator("SECRET_KEY")
    def validate_secret_key(cls, v):
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    @validator("UPLOAD_PATH")
    def validate_upload_path(cls, v):
        # Ensure upload path exists
        Path(v).mkdir(parents=True, exist_ok=True)
        return v
    
    @validator("DATASET_PATH")
    def validate_dataset_path(cls, v):
        if not os.path.exists(v):
            raise ValueError(f"Dataset file not found: {v}")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
