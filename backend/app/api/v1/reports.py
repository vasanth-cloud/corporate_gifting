from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

from app.schemas.report import (
    OrderReport,
    CampaignReport,
    EmployeeReport,
    RevenueReport,
)

from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get(
    "/orders",
    response_model=OrderReport,
)
def order_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService.order_report(db)


@router.get(
    "/campaigns",
    response_model=CampaignReport,
)
def campaign_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService.campaign_report(db)


@router.get(
    "/employees",
    response_model=EmployeeReport,
)
def employee_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService.employee_report(db)


@router.get(
    "/revenue",
    response_model=RevenueReport,
)
def revenue_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService.revenue_report(db)