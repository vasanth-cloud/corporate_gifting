from pydantic import BaseModel, ConfigDict


class VendorBase(BaseModel):
    company_name: str
    contact_person: str
    email: str
    phone: str
    gst_number: str | None = None
    website: str | None = None
    address: str | None = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    company_name: str | None = None
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    gst_number: str | None = None
    website: str | None = None
    address: str | None = None
    is_active: bool | None = None


class VendorResponse(VendorBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)