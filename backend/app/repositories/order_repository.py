from sqlalchemy.orm import Session

from app.models.order import Order


class OrderRepository:

    @staticmethod
    def create(db: Session, order: Order):

        db.add(order)

        db.commit()

        db.refresh(order)

        return order

    @staticmethod
    def get_all(db: Session):

        return db.query(Order).all()

    @staticmethod
    def get_by_id(db: Session, order_id: int):

        return (
            db.query(Order)
            .filter(Order.id == order_id)
            .first()
        )

    @staticmethod
    def update(db: Session):

        db.commit()

    @staticmethod
    def delete(db: Session, order: Order):

        db.delete(order)

        db.commit()