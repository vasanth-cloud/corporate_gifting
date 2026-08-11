from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles, verify_company_access, verify_employee_access
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
    # Enforce company scoping on creation
    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(request.company_id, current_user)

    return EmployeeService.create(db, request)


@router.get(
    "/me",
    response_model=EmployeeResponse,
)
def get_current_employee_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    emp = EmployeeService.get_by_email(db, current_user.email) if hasattr(EmployeeService, 'get_by_email') else None
    if not emp:
        # Fallback query
        from app.models.employee import Employee
        emp = db.query(Employee).filter(Employee.work_email == current_user.email).first()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not linked to user account.",
        )
    return emp


@router.get(
    "",
    response_model=list[EmployeeResponse],
)
def get_employees(
    search: str | None = None,
    department: str | None = None,
    company_id: int | None = None,
    page: int = 1,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
            UserRole.HR_MANAGER,
        )
    ),
):
    # Server-Side Tenant Scoping: Non-SuperAdmins can ONLY view employees for their company
    if current_user.role != UserRole.SUPER_ADMIN:
        company_id = current_user.company_id

    return EmployeeService.get_all(
        db=db,
        search=search,
        department=department,
        company_id=company_id,
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
    emp = EmployeeService.get_by_id(db, employee_id)
    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(emp.company_id, current_user)
        verify_employee_access(emp.id, current_user)
    return emp


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
    emp = EmployeeService.get_by_id(db, employee_id)
    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(emp.company_id, current_user)

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
    emp = EmployeeService.get_by_id(db, employee_id)
    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(emp.company_id, current_user)

    return EmployeeService.delete(
        db,
        employee_id,
    )