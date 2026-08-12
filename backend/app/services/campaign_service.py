import uuid
from datetime import date, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.employee import Employee
from app.models.voucher import Voucher
from app.repositories.campaign_repository import CampaignRepository
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from app.services.email_service import EmailService


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

        old_status = campaign.status
        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(campaign, key, value)

        updated_campaign = CampaignRepository.update(
            db,
            campaign,
        )

        # When Company Admin approves campaign (status becomes ACTIVE), auto-provision vouchers to all company employees
        new_status = getattr(campaign, "status", None)
        if old_status != "ACTIVE" and new_status == "ACTIVE":
            employees = db.query(Employee).filter(
                Employee.company_id == campaign.company_id,
                Employee.is_deleted == False
            ).all()

            per_emp_budget = campaign.budget / len(employees) if employees else campaign.budget

            for emp in employees:
                # Avoid duplicate voucher creation for the same campaign/employee email
                existing = db.query(Voucher).filter(
                    Voucher.recipient_email == emp.work_email,
                    Voucher.company_id == campaign.company_id,
                    Voucher.is_redeemed == False
                ).first()

                if not existing:
                    v_code = f"GC-{uuid.uuid4().hex[:6].upper()}"
                    v_expiry = date.today() + timedelta(days=60)
                    v = Voucher(
                        code=v_code,
                        amount=per_emp_budget,
                        recipient_email=emp.work_email,
                        recipient_name=f"{emp.first_name} {emp.last_name}".strip(),
                        expiry_date=v_expiry,
                        is_redeemed=False,
                        company_id=campaign.company_id,
                    )
                    db.add(v)
                    EmailService.send_voucher_code(
                        recipient_email=emp.work_email,
                        recipient_name=f"{emp.first_name} {emp.last_name}".strip(),
                        code=v_code,
                        amount=per_emp_budget,
                    )
            db.commit()

        return updated_campaign

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