from sqlalchemy.orm import Session

from app.models.order_item import OrderItem


class OrderItemRepository:

    @staticmethod
    def create(db: Session, item: OrderItem):
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def get_all(db: Session):
        return db.query(OrderItem).all()

    @staticmethod
    def get_by_id(db: Session, item_id: int):
        return (
            db.query(OrderItem)
            .filter(OrderItem.id == item_id)
            .first()
        )
    @staticmethod
    def get_by_order_id(
        db: Session,
        order_id: int,
    ):
        return (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order_id)
            .all()
        )

    @staticmethod
    def update(db: Session):
        db.commit()

    @staticmethod
    def delete(db: Session, item: OrderItem):
        db.delete(item)
        db.commit()