from pydantic import BaseModel, ConfigDict


class GiftCategoryBase(BaseModel):
    name: str
    description: str | None = None


class GiftCategoryCreate(GiftCategoryBase):
    pass


class GiftCategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class GiftCategoryResponse(GiftCategoryBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)