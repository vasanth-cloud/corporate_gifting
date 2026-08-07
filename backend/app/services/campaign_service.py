from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.repositories.campaign_repository import CampaignRepository
from app.schemas.campaign import CampaignCreate, CampaignUpdate


class CampaignService:

    @staticmethod
    def create(db: Session, request: CampaignCreate):

        campaign = Campaign(
            title=request.title,
            description=request.description,
            budget=request.budget,
            start_date=request.start_date,
            end_date=request.end_date,
            status=request.status,
            company_id=request.company_id,
        )

        return CampaignRepository.create(db, campaign)

    @staticmethod
    def get_all(db: Session):
        return CampaignRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, campaign_id: int):

        campaign = CampaignRepository.get_by_id(
            db,
            campaign_id,
        )

        if not campaign:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found",
            )

        return campaign

    @staticmethod
    def update(
        db: Session,
        campaign_id: int,
        request: CampaignUpdate,
    ):

        campaign = CampaignRepository.get_by_id(
            db,
            campaign_id,
        )

        if not campaign:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found",
            )

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(campaign, key, value)

        return CampaignRepository.update(
            db,
            campaign,
        )

    @staticmethod
    def delete(
        db: Session,
        campaign_id: int,
    ):

        campaign = CampaignRepository.get_by_id(
            db,
            campaign_id,
        )

        if not campaign:
            raise HTTPException(
                status_code=404,
                detail="Campaign not found",
            )

        CampaignRepository.delete(
            db,
            campaign,
        )

        return {
            "message": "Campaign deleted successfully"
        }