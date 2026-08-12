from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest


class AuthService:

    @staticmethod
    def register(
        db: Session,
        request: RegisterRequest,
    ):

        existing = UserRepository.get_by_email(
            db,
            request.email,
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already registered",
            )

        user = User(
            full_name=request.full_name,
            email=request.email,
            phone=request.phone,
            password_hash=hash_password(request.password),
            role=request.role,
        )

        return UserRepository.create(db, user)

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str,
    ):

        user = UserRepository.get_by_email(
            db,
            email,
        )

        # On-the-fly provisioning for existing employees imported before user creation logic was added
        if not user:
            emp = db.query(Employee).filter(Employee.work_email == email).first()
            if emp:
                user = User(
                    full_name=f"{emp.first_name} {emp.last_name}".strip(),
                    email=emp.work_email,
                    password_hash=hash_password("emp123"),
                    role=UserRole.EMPLOYEE,
                    company_id=emp.company_id,
                    is_active=True,
                    is_verified=True,
                )
                db.add(user)
                db.commit()
                db.refresh(user)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role.value,
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }