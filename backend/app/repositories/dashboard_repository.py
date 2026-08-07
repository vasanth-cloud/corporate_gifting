from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.employee import Employee
from app.models.vendor import Vendor
from app.models.gift_category import GiftCategory
from app.models.gift import Gift
from app.models.campaign import Campaign
from app.models.order import Order, OrderStatus
from app.models.gift import Gift
from app.models.order_item import OrderItem


class DashboardRepository:

    @staticmethod
    def get_stats(db: Session):

        total_companies = db.query(func.count(Company.id)).scalar() or 0

        total_employees = db.query(func.count(Employee.id)).scalar() or 0

        total_vendors = db.query(func.count(Vendor.id)).scalar() or 0

        total_categories = db.query(func.count(GiftCategory.id)).scalar() or 0

        total_gifts = db.query(func.count(Gift.id)).scalar() or 0

        total_campaigns = db.query(func.count(Campaign.id)).scalar() or 0

        total_orders = db.query(func.count(Order.id)).scalar() or 0

        pending_orders = (
            db.query(func.count(Order.id))
            .filter(Order.status == OrderStatus.PENDING)
            .scalar()
            or 0
        )

        delivered_orders = (
            db.query(func.count(Order.id))
            .filter(Order.status == OrderStatus.DELIVERED)
            .scalar()
            or 0
        )

        total_revenue = (
            db.query(func.sum(Order.total_amount))
            .scalar()
            or 0
        )

        return {
            "total_companies": total_companies,
            "total_employees": total_employees,
            "total_vendors": total_vendors,
            "total_categories": total_categories,
            "total_gifts": total_gifts,
            "total_campaigns": total_campaigns,
            "total_orders": total_orders,
            "pending_orders": pending_orders,
            "delivered_orders": delivered_orders,
            "total_revenue": float(total_revenue),
        }

    @staticmethod
    def monthly_orders(db: Session):

        data = (
            db.query(
                extract("month", Order.order_date).label("month"),
                func.count(Order.id).label("orders"),
            )
            .group_by(extract("month", Order.order_date))
            .order_by(extract("month", Order.order_date))
            .all()
        )

        months = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
        }

        return [
            {
                "month": months[int(row.month)],
                "orders": row.orders,
            }
            for row in data
        ]
        
    @staticmethod
    def monthly_revenue(db: Session):

        data = (
            db.query(
                extract("month", Order.order_date).label("month"),
                func.sum(Order.total_amount).label("revenue"),
            )
            .group_by(extract("month", Order.order_date))
            .order_by(extract("month", Order.order_date))
            .all()
        )

        months = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
        }

        return [
            {
                "month": months[int(row.month)],
                "revenue": float(row.revenue or 0),
            }
            for row in data
        ]
        
    @staticmethod
    def top_gifts(db: Session):

        data = (
            db.query(
                Gift.name,
                func.sum(OrderItem.quantity).label("total")
            )
            .join(OrderItem, Gift.id == OrderItem.gift_id)
            .group_by(Gift.name)
            .order_by(func.sum(OrderItem.quantity).desc())
            .limit(10)
            .all()
        )

        return [
            {
                "gift": row.name,
                "quantity": row.total
            }
            for row in data
        ]
        
    @staticmethod
    def top_companies(db: Session):

        data = (
            db.query(
                Company.name,
                func.count(Order.id).label("orders")
            )
            .join(Order, Company.id == Order.company_id)
            .group_by(Company.name)
            .order_by(func.count(Order.id).desc())
            .limit(10)
            .all()
        )

        return [
            {
                "company": row.name,
                "orders": row.orders
            }
            for row in data
        ]
        
    @staticmethod
    def order_status(db: Session):

        data = (
            db.query(
                Order.status,
                func.count(Order.id).label("count")
            )
            .group_by(Order.status)
            .all()
        )

        return [
            {
                "status": row.status.value,
                "count": row.count
            }
            for row in data
        ]
        
    