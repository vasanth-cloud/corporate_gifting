from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.models.user import User, UserRole
from app.schemas.gift_category import (
    GiftCategoryCreate,
    GiftCategoryUpdate,
    GiftCategoryResponse,
)
from app.services.gift_category_service import GiftCategoryService

router = APIRouter(
    prefix="/gift-categories",
    tags=["Gift Categories"],
)


@router.post(
    "",
    response_model=GiftCategoryResponse,
    status_code=201,
)
def create_category(
    request: GiftCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return GiftCategoryService.create(db, request)


@router.get(
    "",
    response_model=list[GiftCategoryResponse],
)
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GiftCategoryService.get_all(db)


@router.get(
    "/{category_id}",
    response_model=GiftCategoryResponse,
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return GiftCategoryService.get_by_id(
        db,
        category_id,
    )


@router.put(
    "/{category_id}",
    response_model=GiftCategoryResponse,
)
def update_category(
    category_id: int,
    request: GiftCategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
        )
    ),
):
    return GiftCategoryService.update(
        db,
        category_id,
        request,
    )


@router.delete(
    "/{category_id}",
)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.SUPER_ADMIN),
    ),
):
    return GiftCategoryService.delete(
        db,
        category_id,
    )