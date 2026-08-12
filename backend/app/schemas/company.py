from pydantic import BaseModel, ConfigDict, EmailStr


class CompanyBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    website: str | None = None
    address: str | None = None
    logo: str | None = None
    gst_number: str | None = None


class CompanyCreate(CompanyBase):
    admin_email: EmailStr | None = None
    admin_password: str | None = None


class CompanyUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    website: str | None = None
    address: str | None = None
    logo: str | None = None
    gst_number: str | None = None
    is_active: bool | None = None


class CompanyResponse(CompanyBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)