from datetime import date, datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict


class CampaignStatus(str, Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class CampaignBase(BaseModel):
    title: str
    description: str | None = None
    budget: Decimal
    start_date: date
    end_date: date
    status: CampaignStatus = CampaignStatus.DRAFT
    company_id: int


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    budget: Decimal | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: CampaignStatus | None = None
    company_id: int | None = None


class CampaignResponse(CampaignBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)