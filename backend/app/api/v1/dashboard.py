from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DashboardService.summary(db, current_user)


@router.get("/monthly-orders")
def monthly_orders(
    db: Session = Depends(get_db),
):
    return DashboardService.monthly_orders(db)

@router.get("/monthly-revenue")
def monthly_revenue(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DashboardService.monthly_revenue(db)

@router.get("/top-gifts")
def top_gifts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DashboardService.top_gifts(db)

@router.get("/top-companies")
def top_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DashboardService.top_companies(db)

@router.get("/order-status")
def order_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return DashboardService.order_status(db)
