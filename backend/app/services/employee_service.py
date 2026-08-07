from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.employee import Employee
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

        return EmployeeRepository.create(
            db,
            employee,
        )

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        department: str | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        return EmployeeRepository.get_all(
            db=db,
            search=search,
            department=department,
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