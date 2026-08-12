from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.user import User, UserRole
from app.core.security import hash_password
from app.repositories.employee_repository import EmployeeRepository
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeService:

    @staticmethod
    def create(db: Session, request: EmployeeCreate):

        existing = EmployeeRepository.get_by_email(
            db,
            request.work_email,
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Employee already exists",
            )

        employee = Employee(**request.model_dump())
        created_emp = EmployeeRepository.create(
            db,
            employee,
        )

        # Auto-provision user account for single employee creation
        user_account = db.query(User).filter(User.email == request.work_email).first()
        if not user_account:
            emp_user = User(
                full_name=f"{request.first_name} {request.last_name}".strip(),
                email=request.work_email,
                password_hash=hash_password("emp123"),
                role=UserRole.EMPLOYEE,
                company_id=request.company_id,
                is_active=True,
                is_verified=True,
            )
            db.add(emp_user)
            db.commit()

        return created_emp

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        department: str | None = None,
        company_id: int | None = None,
        page: int = 1,
        limit: int = 100,
    ):
        return EmployeeRepository.get_all(
            db=db,
            search=search,
            department=department,
            company_id=company_id,
            page=page,
            limit=limit,
        )

    @staticmethod
    def get_by_id(
        db: Session,
        employee_id: int,
    ):

        employee = EmployeeRepository.get_by_id(
            db,
            employee_id,
        )

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found",
            )

        return employee

    @staticmethod
    def update(
        db: Session,
        employee_id: int,
        request: EmployeeUpdate,
    ):

        employee = EmployeeRepository.get_by_id(
            db,
            employee_id,
        )

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found",
            )

        update_data = request.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(employee, key, value)

        return EmployeeRepository.update(
            db,
            employee,
        )

    @staticmethod
    def delete(
        db: Session,
        employee_id: int,
    ):

        employee = EmployeeRepository.get_by_id(
            db,
            employee_id,
        )

        if not employee:
            raise HTTPException(
                status_code=404,
                detail="Employee not found",
            )

        EmployeeRepository.delete(
            db,
            employee,
        )

        return {
            "message": "Employee deleted successfully"
        }