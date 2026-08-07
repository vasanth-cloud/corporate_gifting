from datetime import date
from pydantic import BaseModel, EmailStr


class VoucherCreate(BaseModel):
    recipient_email: EmailStr
    recipient_name: str | None = None
    amount: float
    company_id: int
    days_valid: int = 30


class VoucherClaimRequest(BaseModel):
    code: str
    gift_id: int
    shipping_address: str
    phone: str


class VoucherResponse(BaseModel):
    id: int
    code: str
    amount: float
    recipient_email: str
    recipient_name: str | None = None
    expiry_date: date | None = None
    is_redeemed: bool
    company_id: int

    class Config:
        from_attributes = True
