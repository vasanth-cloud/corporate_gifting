from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.models.user import User, UserRole
from app.schemas.gift import (
    GiftCreate,
    GiftUpdate,
    GiftResponse,
)
from app.services.gift_service import GiftService

router = APIRouter(
    prefix="/gifts",
    tags=["Gifts"],
)


@router.post(
    "",
    response_model=GiftResponse,
    status_code=201,
)
def create_gift(
    request: GiftCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return GiftService.create(db, request)


@router.get(
    "",
    response_model=list[GiftResponse],
)
def get_gifts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GiftService.get_all(db)


@router.get(
    "/{gift_id}",
    response_model=GiftResponse,
)
def get_gift(
    gift_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GiftService.get_by_id(
        db,
        gift_id,
    )


@router.put(
    "/{gift_id}",
    response_model=GiftResponse,
)
def update_gift(
    gift_id: int,
    request: GiftUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return GiftService.update(
        db,
        gift_id,
        request,
    )


@router.delete(
    "/{gift_id}",
)
def delete_gift(
    gift_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN),
    ),
):
    return GiftService.delete(
        db,
        gift_id,
    )