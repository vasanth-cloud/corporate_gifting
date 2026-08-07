from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.gift_category import GiftCategory
from app.repositories.gift_category_repository import GiftCategoryRepository
from app.schemas.gift_category import (
    GiftCategoryCreate,
    GiftCategoryUpdate,
)


class GiftCategoryService:

    @staticmethod
    def create(db: Session, request: GiftCategoryCreate):

        if GiftCategoryRepository.get_by_name(db, request.name):
            raise HTTPException(
                status_code=400,
                detail="Category already exists",
            )

        category = GiftCategory(**request.model_dump())

        return GiftCategoryRepository.create(db, category)

    @staticmethod
    def get_all(db: Session):
        return GiftCategoryRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, category_id: int):

        category = GiftCategoryRepository.get_by_id(
            db,
            category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        return category

    @staticmethod
    def update(
        db: Session,
        category_id: int,
        request: GiftCategoryUpdate,
    ):

        category = GiftCategoryRepository.get_by_id(
            db,
            category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(category, key, value)

        return GiftCategoryRepository.update(db, category)

    @staticmethod
    def delete(db: Session, category_id: int):

        category = GiftCategoryRepository.get_by_id(
            db,
            category_id,
        )

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

        GiftCategoryRepository.delete(db, category)

        return {
            "message": "Category deleted successfully"
        }