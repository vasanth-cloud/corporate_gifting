from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.campaign import Campaign
from app.models.employee import Employee
from app.models.order import Order, OrderStatus


class ReportRepository:

    @staticmethod
    def order_report(db: Session):

        total_orders = db.query(Order).count()

        pending = db.query(Order).filter(
            Order.status == OrderStatus.PENDING
        ).count()

        approved = db.query(Order).filter(
            Order.status == OrderStatus.APPROVED
        ).count()

        processing = db.query(Order).filter(
            Order.status == OrderStatus.PROCESSING
        ).count()

        shipped = db.query(Order).filter(
            Order.status == OrderStatus.SHIPPED
        ).count()

        delivered = db.query(Order).filter(
            Order.status == OrderStatus.DELIVERED
        ).count()

        cancelled = db.query(Order).filter(
            Order.status == OrderStatus.CANCELLED
        ).count()

        revenue = db.query(
            func.coalesce(func.sum(Order.total_amount), 0)
        ).scalar()

        return {
            "total_orders": total_orders,
            "pending_orders": pending,
            "approved_orders": approved,
            "processing_orders": processing,
            "shipped_orders": shipped,
            "delivered_orders": delivered,
            "cancelled_orders": cancelled,
            "total_revenue": revenue,
        }

    @staticmethod
    def campaign_report(db: Session):

        total = db.query(Campaign).count()

        active = db.query(Campaign).filter(
            Campaign.status == "ACTIVE"
        ).count()

        completed = db.query(Campaign).filter(
            Campaign.status == "COMPLETED"
        ).count()

        return {
            "total_campaigns": total,
            "active_campaigns": active,
            "completed_campaigns": completed,
        }

    @staticmethod
    def employee_report(db: Session):

        return {
            "total_employees": db.query(Employee).count()
        }

    @staticmethod
    def revenue_report(db: Session):

        revenue = db.query(
            func.coalesce(func.sum(Order.total_amount), 0)
        ).scalar()

        return {
            "total_revenue": revenue
        }