from sqlalchemy.orm import Session
from sqlalchemy import func
from app.repositories.dashboard_repository import DashboardRepository

from app.models.company import Company
from app.models.employee import Employee
from app.models.vendor import Vendor
from app.models.gift import Gift
from app.models.campaign import Campaign
from app.models.order import Order


class DashboardService:

    @staticmethod
    def summary(db: Session):

        total_companies = db.query(func.count(Company.id)).scalar()

        total_employees = db.query(func.count(Employee.id)).scalar()

        total_vendors = db.query(func.count(Vendor.id)).scalar()

        total_gifts = db.query(func.count(Gift.id)).scalar()

        total_campaigns = db.query(func.count(Campaign.id)).scalar()

        total_orders = db.query(func.count(Order.id)).scalar()

        return {
            "total_companies": total_companies,
            "total_employees": total_employees,
            "total_vendors": total_vendors,
            "total_gifts": total_gifts,
            "total_campaigns": total_campaigns,
            "total_orders": total_orders,
        }
        
    @staticmethod
    def monthly_orders(db: Session):
        return DashboardRepository.monthly_orders(db)
    
    @staticmethod
    def monthly_revenue(db: Session):
        return DashboardRepository.monthly_revenue(db)
    
    @staticmethod
    def top_gifts(db: Session):
        return DashboardRepository.top_gifts(db)
    
    @staticmethod
    def top_companies(db: Session):
        return DashboardRepository.top_companies(db)
    
    @staticmethod
    def order_status(db: Session):
        return DashboardRepository.order_status(db)
    
