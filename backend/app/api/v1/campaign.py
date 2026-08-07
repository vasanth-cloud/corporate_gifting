from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.campaign import (
    CampaignCreate,
    CampaignUpdate,
    CampaignResponse,
)
from app.services.campaign_service import CampaignService

router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"],
)


@router.post(
    "",
    response_model=CampaignResponse,
    status_code=201,
)
def create_campaign(
    request: CampaignCreate,
    db: Session = Depends(get_db),
):
    return CampaignService.create(db, request)


@router.get(
    "",
    response_model=list[CampaignResponse],
)
def get_campaigns(
    db: Session = Depends(get_db),
):
    return CampaignService.get_all(db)


@router.get(
    "/{campaign_id}",
    response_model=CampaignResponse,
)
def get_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
):
    return CampaignService.get_by_id(
        db,
        campaign_id,
    )


@router.put(
    "/{campaign_id}",
    response_model=CampaignResponse,
)
def update_campaign(
    campaign_id: int,
    request: CampaignUpdate,
    db: Session = Depends(get_db),
):
    return CampaignService.update(
        db,
        campaign_id,
        request,
    )


@router.delete(
    "/{campaign_id}",
)
def delete_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
):
    return CampaignService.delete(
        db,
        campaign_id,
    )