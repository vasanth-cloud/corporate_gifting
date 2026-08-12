from sqlalchemy.orm import Session
from sqlalchemy import func
from app.repositories.dashboard_repository import DashboardRepository

from app.models.company import Company
from app.models.employee import Employee
from app.models.user import User, UserRole
from app.models.order import Order
from app.models.campaign import Campaign


class DashboardService:

    @staticmethod
    def summary(db: Session, current_user: User = None):
        if current_user and current_user.role in [UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER]:
            comp_id = current_user.company_id
            comp = db.query(Company).filter(Company.id == comp_id).first() if comp_id else None
            company_name = comp.name if comp else (current_user.full_name or "Company")

            total_hrs = db.query(func.count(User.id)).filter(
                User.role == UserRole.HR_MANAGER,
                User.company_id == comp_id,
                User.is_deleted == False
            ).scalar() or 0

            total_employees = db.query(func.count(Employee.id)).filter(
                Employee.company_id == comp_id,
                Employee.is_deleted == False
            ).scalar() or 0

            total_campaigns = db.query(func.count(Campaign.id)).filter(
                Campaign.company_id == comp_id,
                Campaign.is_deleted == False
            ).scalar() or 0

            total_orders = db.query(func.count(Order.id)).filter(
                Order.company_id == comp_id,
                Order.is_deleted == False
            ).scalar() or 0

            total_revenue = db.query(func.sum(Order.total_amount)).filter(
                Order.company_id == comp_id,
                Order.is_deleted == False
            ).scalar() or 0.0

            return {
                "is_company_scoped": True,
                "company_name": company_name,
                "total_hrs": total_hrs,
                "total_employees": total_employees,
                "total_campaigns": total_campaigns,
                "total_orders": total_orders,
                "total_revenue": total_revenue,
            }

        # Global Super Admin Summary
        total_companies = db.query(func.count(Company.id)).filter(Company.is_deleted == False).scalar() or 0
        total_employees = db.query(func.count(Employee.id)).filter(Employee.is_deleted == False).scalar() or 0
        total_orders = db.query(func.count(Order.id)).filter(Order.is_deleted == False).scalar() or 0
        total_revenue = db.query(func.sum(Order.total_amount)).filter(Order.is_deleted == False).scalar() or 0.0

        return {
            "is_company_scoped": False,
            "total_companies": total_companies,
            "total_employees": total_employees,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
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
