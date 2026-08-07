from sqlalchemy.orm import Session

from app.models.gift import Gift


class GiftRepository:

    @staticmethod
    def create(db: Session, gift: Gift):
        db.add(gift)
        db.commit()
        db.refresh(gift)
        return gift

    @staticmethod
    def get_all(db: Session):
        return (
            db.query(Gift)
            .filter(Gift.is_deleted == False)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, gift_id: int):
        return (
            db.query(Gift)
            .filter(
                Gift.id == gift_id,
                Gift.is_deleted == False,
            )
            .first()
        )

    @staticmethod
    def get_by_sku(db: Session, sku: str):
        return (
            db.query(Gift)
            .filter(Gift.sku == sku)
            .first()
        )

    @staticmethod
    def update(db: Session, gift: Gift):
        db.commit()
        db.refresh(gift)
        return gift

    @staticmethod
    def delete(db: Session, gift: Gift):
        gift.is_deleted = True
        db.commit()
        
    @staticmethod
    def get_by_id(db, gift_id: int):
        return (
            db.query(Gift)
            .filter(Gift.id == gift_id)
            .first()
        )