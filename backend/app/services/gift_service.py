from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.gift import Gift
from app.repositories.gift_repository import GiftRepository
from app.repositories.gift_category_repository import GiftCategoryRepository
from app.schemas.gift import GiftCreate, GiftUpdate


class GiftService:

    @staticmethod
    def create(db: Session, request: GiftCreate):

        if GiftRepository.get_by_sku(db, request.sku):
            raise HTTPException(
                status_code=400,
                detail="SKU already exists",
            )

        if not GiftCategoryRepository.get_by_id(db, request.category_id):
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        gift = Gift(**request.model_dump())

        return GiftRepository.create(db, gift)

    @staticmethod
    def get_all(db: Session):
        return GiftRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, gift_id: int):

        gift = GiftRepository.get_by_id(db, gift_id)

        if not gift:
            raise HTTPException(
                status_code=404,
                detail="Gift not found",
            )

        return gift

    @staticmethod
    def update(
        db: Session,
        gift_id: int,
        request: GiftUpdate,
    ):

        gift = GiftRepository.get_by_id(db, gift_id)

        if not gift:
            raise HTTPException(
                status_code=404,
                detail="Gift not found",
            )

        if request.category_id is not None:
            if not GiftCategoryRepository.get_by_id(
                db,
                request.category_id,
            ):
                raise HTTPException(
                    status_code=404,
                    detail="Category not found",
                )

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(gift, key, value)

        return GiftRepository.update(db, gift)

    @staticmethod
    def delete(db: Session, gift_id: int):

        gift = GiftRepository.get_by_id(db, gift_id)

        if not gift:
            raise HTTPException(
                status_code=404,
                detail="Gift not found",
            )

        GiftRepository.delete(db, gift)

        return {
            "message": "Gift deleted successfully"
        }