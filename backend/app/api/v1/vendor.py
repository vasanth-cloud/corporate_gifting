from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.models.user import User, UserRole
from app.schemas.vendor import (
    VendorCreate,
    VendorUpdate,
    VendorResponse,
)
from app.services.vendor_service import VendorService

router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"],
)


@router.post(
    "",
    response_model=VendorResponse,
    status_code=201,
)
def create_vendor(
    request: VendorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return VendorService.create(db, request)


@router.get(
    "",
    response_model=list[VendorResponse],
)
def get_vendors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VendorService.get_all(db)


@router.get(
    "",
    response_model=list[VendorResponse],
)
def get_vendors(
    search: str | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return VendorService.get_all(
        db=db,
        search=search,
        page=page,
        limit=limit,
    )


@router.put(
    "/{vendor_id}",
    response_model=VendorResponse,
)
def update_vendor(
    vendor_id: int,
    request: VendorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return VendorService.update(
        db,
        vendor_id,
        request,
    )


@router.delete(
    "/{vendor_id}",
)
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return VendorService.delete(
        db,
        vendor_id,
    )