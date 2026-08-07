from sqlalchemy.orm import Session

from app.models.gift_category import GiftCategory


class GiftCategoryRepository:

    @staticmethod
    def create(db: Session, category: GiftCategory):
        db.add(category)
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(GiftCategory)
            .filter(GiftCategory.is_deleted == False)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, category_id: int):
        return (
            db.query(GiftCategory)
            .filter(
                GiftCategory.id == category_id,
                GiftCategory.is_deleted == False,
            )
            .first()
        )

    @staticmethod
    def get_by_name(db: Session, name: str):
        return (
            db.query(GiftCategory)
            .filter(GiftCategory.name == name)
            .first()
        )

    @staticmethod
    def update(db: Session, category: GiftCategory):
        db.commit()
        db.refresh(category)
        return category

    @staticmethod
    def delete(db: Session, category: GiftCategory):
        category.is_deleted = True
        db.commit()