"""
FastAPI dependencies for authentication and database access
"""

import time
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.schemas.user import TokenData


# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from JWT token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify the token
        payload = verify_token(credentials.credentials, token_type="access")
        if payload is None:
            raise credentials_exception
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        token_data = TokenData(user_id=int(user_id))
    except (ValueError, TypeError):
        raise credentials_exception
    
    # Get user from database
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get the current active user (alias for get_current_user)
    """
    return current_user


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get the current user if authenticated, otherwise return None
    Useful for endpoints that work with or without authentication
    """
    if not credentials:
        return None
    
    try:
        payload = verify_token(credentials.credentials, token_type="access")
        if payload is None:
            return None
        
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None or not user.is_active:
            return None
        
        return user
    except (ValueError, TypeError):
        return None


def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure the current user is an admin
    Note: You'll need to add an is_admin field to the User model for this to work
    """
    # For now, we'll just return the current user
    # In a real application, you'd check for admin privileges
    return current_user


class RateLimiter:
    """
    Simple rate limiter dependency
    """
    def __init__(self, requests: int = 100, period: int = 60):
        self.requests = requests
        self.period = period
        self.clients = {}
    
    def __call__(self, request: Request):
        # Simple in-memory rate limiting
        # In production, you'd use Redis or a proper rate limiting service
        client_ip = request.client.host
        current_time = time.time()
        
        if client_ip not in self.clients:
            self.clients[client_ip] = []
        
        # Remove old requests
        self.clients[client_ip] = [
            req_time for req_time in self.clients[client_ip]
            if current_time - req_time < self.period
        ]
        
        # Check rate limit
        if len(self.clients[client_ip]) >= self.requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded"
            )
        
        # Add current request
        self.clients[client_ip].append(current_time)
        
        return True


# Create rate limiter instances
rate_limiter = RateLimiter(requests=100, period=60)
strict_rate_limiter = RateLimiter(requests=10, period=60)
