from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class OrderItemCreate(BaseModel):
    order_id: int
    gift_id: int
    quantity: int


class OrderItemUpdate(BaseModel):
    quantity: int | None = None


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    gift_id: int
    quantity: int
    price: Decimal

    model_config = ConfigDict(from_attributes=True)