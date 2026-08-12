import os
import sys

# Ensure backend root is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, SessionLocal
from app.core.security import hash_password
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.employee import Employee
from app.models.gift_category import GiftCategory
from app.models.gift import Gift
from app.models.vendor import Vendor
from app.models.campaign import Campaign
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.voucher import Voucher
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.models.address import Address
from app.models.approval import Approval

def seed():
    print("Resetting database schema...")
    # Drop and recreate for a 100% clean baseline
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Seed ONLY the master Super Admin user
        admin = User(
            full_name="Super Admin",
            email="admin@corporate.com",
            phone="+1-800-555-0199",
            password_hash=hash_password("admin123"),
            role=UserRole.SUPER_ADMIN,
            is_active=True,
            is_verified=True,
        )
        db.add(admin)
        db.commit()
        print("Clean Database Initialized! Super Admin created: admin@corporate.com / admin123")
        print("All dummy companies, employees, vendors, gifts, campaigns, and orders have been wiped clean.")
    except Exception as e:
        print(f"Clean seed failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
