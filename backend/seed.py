import os
import sys
from datetime import date

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
from app.models.campaign import Campaign, CampaignStatus
from app.models.order import Order, OrderStatus

def seed():
    print("Initializing Database schema...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Seed Super Admin User
        admin = db.query(User).filter(User.email == "admin@corporate.com").first()
        if not admin:
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
            print("Created Admin User: admin@corporate.com / admin123")

        # 2. Seed Sample Company
        company = db.query(Company).first()
        if not company:
            company = Company(
                name="Acme Technology Corp",
                email="contact@acme.com",
                phone="+1-555-0144",
                website="https://acmetech.com",
                address="100 Innovation Way, Silicon Valley, CA",
                gst_number="27AAACA12341Z5",
            )
            db.add(company)
            db.commit()
            db.refresh(company)
            print(f"Created Company: {company.name}")

        # 3. Seed Sample Employee
        employee = db.query(Employee).first()
        if not employee:
            employee = Employee(
                employee_code="EMP-1001",
                first_name="Sarah",
                last_name="Jenkins",
                work_email="sarah.jenkins@acmetech.com",
                personal_email="sarah.j@gmail.com",
                phone="+1-555-0188",
                department="Engineering",
                designation="Senior Software Engineer",
                joining_date=date(2022, 3, 15),
                company_id=company.id,
            )
            db.add(employee)
            db.commit()
            db.refresh(employee)
            print(f"Created Employee: {employee.first_name} {employee.last_name}")

        # 4. Seed Gift Category
        category = db.query(GiftCategory).first()
        if not category:
            category = GiftCategory(
                name="Executive Tech & Electronics",
                description="High-end gadgets, noise-canceling headphones, and wireless accessories.",
            )
            db.add(category)
            db.commit()
            db.refresh(category)
            print(f"Created Category: {category.name}")

        # 5. Seed Vendors
        vendor = db.query(Vendor).first()
        if not vendor:
            v1 = Vendor(
                company_name="Global Tech Supplies Inc.",
                contact_person="David Miller",
                email="david@globalsupplies.com",
                phone="+1-555-0199",
                gst_number="29AAACG9988H1Z2",
                website="https://globalsupplies.com",
                address="500 Logistics Blvd, Chicago, IL",
                is_active=True,
            )
            v2 = Vendor(
                company_name="Apex Luxury Gifting Co.",
                contact_person="Elena Rostova",
                email="elena@apexgifting.com",
                phone="+1-555-0244",
                gst_number="33AAACA4433K1Z9",
                website="https://apexgifting.com",
                address="12 Premium Trade Center, New York, NY",
                is_active=True,
            )
            db.add_all([v1, v2])
            db.commit()
            print("Created Sample Vendors")

        # 6. Seed Gifts
        gift = db.query(Gift).first()
        if not gift:
            gift1 = Gift(
                name="Premium Wireless Noise-Canceling Headphones",
                sku="GIFT-TECH-01",
                description="Studio-quality audio with 30-hour battery life and custom engraving option.",
                brand="AudioPro",
                price=199.99,
                stock=50,
                category_id=category.id,
                is_active=True,
            )
            gift2 = Gift(
                name="Luxury Executive Leather Notebook & Pen Set",
                sku="GIFT-OFFICE-02",
                description="Handcrafted Italian leather journal paired with a weighted rollerball pen.",
                brand="Artisan",
                price=49.50,
                stock=120,
                category_id=category.id,
                is_active=True,
            )
            db.add_all([gift1, gift2])
            db.commit()
            print("Created Sample Gifts")

        # 7. Seed Campaign
        campaign = db.query(Campaign).first()
        if not campaign:
            campaign = Campaign(
                title="Diwali Celebration 2026",
                description="Annual festival employee gifting drive.",
                budget=15000.00,
                start_date=date(2026, 10, 1),
                end_date=date(2026, 11, 15),
                status=CampaignStatus.ACTIVE,
                company_id=company.id,
            )
            db.add(campaign)
            db.commit()
            db.refresh(campaign)
            print(f"Created Campaign: {campaign.title}")

        # 8. Seed Order
        order = db.query(Order).first()
        if not order:
            order = Order(
                order_number="ORD-88219",
                company_id=company.id,
                employee_id=employee.id,
                campaign_id=campaign.id,
                order_date=date(2026, 8, 1),
                total_amount=199.99,
                status=OrderStatus.APPROVED,
            )
            db.add(order)
            db.commit()
            print(f"Created Order: {order.order_number}")

        print("Database Seeding Completed Successfully!")
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
