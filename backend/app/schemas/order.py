from datetime import date
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class OrderCreate(BaseModel):
    order_number: str
    company_id: int
    employee_id: int
    campaign_id: int
    order_date: date
    total_amount: Decimal
    status: OrderStatus = OrderStatus.PENDING


class OrderUpdate(BaseModel):
    order_number: str | None = None
    company_id: int | None = None
    employee_id: int | None = None
    campaign_id: int | None = None
    order_date: date | None = None
    total_amount: Decimal | None = None
    status: OrderStatus | None = None


class OrderResponse(BaseModel):
    id: int
    order_number: str
    company_id: int
    employee_id: int
    campaign_id: int
    order_date: date
    total_amount: Decimal
    status: OrderStatus

    class Config:
        from_attributes = True