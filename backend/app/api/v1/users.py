from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.company import Company
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


class UserCreateRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole
    phone: str | None = None
    company_id: int | None = None


@router.get("", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
):
    users = db.query(User).filter(User.is_deleted == False).all()
    return users


@router.post("", response_model=UserResponse, status_code=201)
def create_user(
    request: UserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="User email already registered",
        )

    user = User(
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password(request.password),
        role=request.role,
        phone=request.phone,
        company_id=request.company_id,
        is_active=True,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
