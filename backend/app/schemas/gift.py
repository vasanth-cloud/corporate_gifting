from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class GiftBase(BaseModel):
    name: str
    sku: str
    description: str | None = None
    brand: str | None = None
    price: Decimal
    stock: int
    image_url: str | None = None
    category_id: int


class GiftCreate(GiftBase):
    pass


class GiftUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    description: str | None = None
    brand: str | None = None
    price: Decimal | None = None
    stock: int | None = None
    image_url: str | None = None
    category_id: int | None = None
    is_active: bool | None = None


class GiftResponse(GiftBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)