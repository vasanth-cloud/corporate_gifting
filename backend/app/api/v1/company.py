from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles, verify_company_access
from app.models.user import User, UserRole
from app.schemas.company import (
    CompanyCreate,
    CompanyUpdate,
    CompanyResponse,
)
from app.services.company_service import CompanyService

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.post(
    "",
    response_model=CompanyResponse,
    status_code=201,
)
def create_company(
    request: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return CompanyService.create(db, request)


@router.get("", response_model=list[CompanyResponse])
def get_companies(
    search: str | None = None,
    page: int = 1,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    all_companies = CompanyService.get_all(
        db=db,
        search=search,
        page=page,
        limit=limit,
    )

    # Server-Side Multi-Tenant Data Isolation:
    # Non-SuperAdmins can ONLY view their own company profile!
    if current_user.role != UserRole.SUPER_ADMIN:
        if current_user.company_id is None:
            return []
        return [c for c in all_companies if c.id == current_user.company_id]

    return all_companies


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(company_id, current_user)

    return CompanyService.get_by_id(db, company_id)


@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update_company(
    company_id: int,
    request: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != UserRole.SUPER_ADMIN:
        if current_user.role != UserRole.COMPANY_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Company Admins or Super Admins can update company profiles.",
            )
        verify_company_access(company_id, current_user)

    return CompanyService.update(
        db,
        company_id,
        request,
    )


@router.delete(
    "/{company_id}",
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
    return CompanyService.delete(
        db,
        company_id,
    )