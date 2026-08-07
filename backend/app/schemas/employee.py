from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr


class EmployeeBase(BaseModel):
    employee_code: str
    first_name: str
    last_name: str
    work_email: EmailStr
    personal_email: EmailStr | None = None
    phone: str | None = None
    department: str
    designation: str
    joining_date: date
    date_of_birth: date | None = None
    profile_image: str | None = None
    company_id: int


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    work_email: EmailStr | None = None
    personal_email: EmailStr | None = None
    phone: str | None = None
    department: str | None = None
    designation: str | None = None
    joining_date: date | None = None
    date_of_birth: date | None = None
    profile_image: str | None = None
    company_id: int | None = None


class EmployeeResponse(EmployeeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)