from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.models.user import User, UserRole
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeeResponse,
)
from app.services.employee_service import EmployeeService

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=201,
)
def create_employee(
    request: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
            UserRole.HR_MANAGER,
        )
    ),
):
    return EmployeeService.create(db, request)


@router.get(
    "",
    response_model=list[EmployeeResponse],
)
def get_employees(
    search: str | None = None,
    department: str | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return EmployeeService.get_all(
        db=db,
        search=search,
        department=department,
        page=page,
        limit=limit,
    )


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return EmployeeService.get_by_id(
        db,
        employee_id,
    )


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def update_employee(
    employee_id: int,
    request: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
            UserRole.HR_MANAGER,
        )
    ),
):
    return EmployeeService.update(
        db,
        employee_id,
        request,
    )


@router.delete(
    "/{employee_id}",
)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return EmployeeService.delete(
        db,
        employee_id,
    )