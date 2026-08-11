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
    def get_all(
        db: Session,
        company_id: int | None = None,
        employee_id: int | None = None,
        vendor_id: int | None = None,
    ):
        query = db.query(Order)

        if company_id:
            query = query.filter(Order.company_id == company_id)

        if employee_id:
            query = query.filter(Order.employee_id == employee_id)

        if vendor_id and hasattr(Order, "vendor_id"):
            query = query.filter(Order.vendor_id == vendor_id)

        return query.order_by(Order.id.desc()).all()

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