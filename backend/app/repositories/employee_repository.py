from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.employee import Employee


class EmployeeRepository:

    @staticmethod
    def create(db: Session, employee: Employee):
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        department: str | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        query = db.query(Employee)

        if search:
            query = query.filter(
                or_(
                    Employee.first_name.ilike(f"%{search}%"),
                    Employee.last_name.ilike(f"%{search}%"),
                    Employee.employee_code.ilike(f"%{search}%"),
                    Employee.work_email.ilike(f"%{search}%"),
                )
            )

        if department:
            query = query.filter(
                Employee.department.ilike(f"%{department}%")
            )

        return (
            query.offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
    
    @staticmethod
    def get_by_id(db, employee_id: int):
        return (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

    @staticmethod
    def get_by_id(db: Session, employee_id: int):
        return (
            db.query(Employee)
            .filter(Employee.id == employee_id)
            .first()
        )

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(Employee)
            .filter(Employee.work_email == email)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        employee: Employee,
    ):
        db.commit()
        db.refresh(employee)
        return employee

    @staticmethod
    def delete(db: Session, employee: Employee):
        db.delete(employee)
        db.commit()