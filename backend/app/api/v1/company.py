from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
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
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CompanyService.get_all(
        db=db,
        search=search,
        page=page,
        limit=limit,
    )


@router.get(
    "",
    response_model=list[CompanyResponse],
)
def get_companies(
    search: str | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return CompanyService.get_all(
        db=db,
        search=search,
        page=page,
        limit=limit,
    )


@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update_company(
    company_id: int,
    request: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN)
    ),
):
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