from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    phone: str | None = None
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.EMPLOYEE


class RegisterResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole

    model_config = {
        "from_attributes": True
    }