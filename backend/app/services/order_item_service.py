from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order_item import OrderItem
from app.repositories.gift_repository import GiftRepository
from app.repositories.order_item_repository import OrderItemRepository
from app.repositories.order_repository import OrderRepository
from app.schemas.order_item import (
    OrderItemCreate,
    OrderItemUpdate,
)


class OrderItemService:

    @staticmethod
    def create(db: Session, request: OrderItemCreate):

        order = OrderRepository.get_by_id(db, request.order_id)

        if not order:
            raise HTTPException(404, "Order not found")

        gift = GiftRepository.get_by_id(db, request.gift_id)

        if not gift:
            raise HTTPException(404, "Gift not found")

        if gift.stock < request.quantity:
            raise HTTPException(
                400,
                "Insufficient stock",
            )

        gift.stock -= request.quantity

        item = OrderItem(
            order_id=request.order_id,
            gift_id=request.gift_id,
            quantity=request.quantity,
            price=gift.price,
        )

        created = OrderItemRepository.create(db, item)

        # Update order total
        order.total_amount += gift.price * request.quantity
        OrderRepository.update(db)

        return created

    @staticmethod
    def get_all(db: Session):
        return OrderItemRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, item_id: int):

        item = OrderItemRepository.get_by_id(db, item_id)

        if not item:
            raise HTTPException(404, "Order Item not found")

        return item

    @staticmethod
    def update(db: Session, item_id: int, request: OrderItemUpdate):

        item = OrderItemRepository.get_by_id(db, item_id)

        if not item:
            raise HTTPException(404, "Order Item not found")

        for key, value in request.model_dump(
            exclude_unset=True
        ).items():
            setattr(item, key, value)

        OrderItemRepository.update(db)

        return item

    @staticmethod
    def delete(db: Session, item_id: int):

        item = OrderItemRepository.get_by_id(db, item_id)

        if not item:
            raise HTTPException(404, "Order Item not found")

        OrderItemRepository.delete(db, item)

        return {
            "message": "Order Item deleted successfully"
        }