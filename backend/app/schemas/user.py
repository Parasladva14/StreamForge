from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# ---------------------------
# Base User Schema
# ---------------------------
class UserBase(BaseModel):
    username: str
    email: EmailStr


# ---------------------------
# Create User
# ---------------------------
class UserCreate(UserBase):
    password: str
    role: Optional[str] = "Viewer"


# ---------------------------
# Login
# ---------------------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ---------------------------
# Update User Role
# ---------------------------
class UserRoleUpdate(BaseModel):
    role: str


# ---------------------------
# User Response
# ---------------------------
class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------
# JWT Token
# ---------------------------
class Token(BaseModel):
    access_token: str
    token_type: str


# ---------------------------
# Token Payload
# ---------------------------
class TokenData(BaseModel):
    email: Optional[str] = None