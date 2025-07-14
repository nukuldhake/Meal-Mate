"""
Authentication endpoints
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    authenticate_user,
    create_user_tokens,
    get_password_hash,
    refresh_access_token,
    verify_token
)
from app.core.dependencies import security
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    PasswordReset,
    PasswordResetConfirm
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        if existing_user.email == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        is_active=True,
        is_verified=False
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


@router.post("/login", response_model=Token)
async def login_user(
    user_credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login user and return access tokens
    """
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    tokens = create_user_tokens(user)
    return tokens


@router.post("/refresh", response_model=dict)
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    token_data = refresh_access_token(credentials.credentials, db)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token_data


@router.post("/logout")
async def logout_user():
    """
    Logout user (client should discard tokens)
    """
    return {"message": "Successfully logged out"}


@router.post("/forgot-password")
async def forgot_password(
    password_reset: PasswordReset,
    db: Session = Depends(get_db)
):
    """
    Request password reset
    """
    user = db.query(User).filter(User.email == password_reset.email).first()
    if not user:
        # Don't reveal if email exists or not
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # In a real application, you would send an email with the reset token
    # For now, we'll just return a success message
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    password_reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Reset password using reset token
    """
    # Verify the reset token
    payload = verify_token(password_reset_data.token, token_type="password_reset")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )
    
    # Find user and update password
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(password_reset_data.new_password)
    db.commit()
    
    return {"message": "Password successfully reset"}


@router.post("/verify-token")
async def verify_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Verify if an access token is valid
    """
    payload = verify_token(credentials.credentials, token_type="access")
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {
        "valid": True,
        "user_id": payload.get("sub"),
        "username": payload.get("username"),
        "expires_at": payload.get("exp")
    }
