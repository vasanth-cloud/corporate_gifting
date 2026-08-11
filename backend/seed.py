import os
import sys
from datetime import date, timedelta

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
from app.models.voucher import Voucher

def seed():
    print("Initializing Database schema...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Seed Multiple Companies
        comp_data = [
            {"name": "Google LLC", "email": "gifting@google.com", "phone": "+1-650-253-0000", "website": "https://google.com", "address": "1600 Amphitheatre Pkwy, Mountain View, CA", "gst_number": "06AAACG1234F1Z1"},
            {"name": "Tesla Motors Inc", "email": "hr@tesla.com", "phone": "+1-650-681-5000", "website": "https://tesla.com", "address": "1 Tesla Road, Austin, TX", "gst_number": "07AAACT5678K1Z2"},
            {"name": "Infosys Limited", "email": "rewards@infosys.com", "phone": "+91-80-2852-0261", "website": "https://infosys.com", "address": "Electronics City, Hosur Road, Bangalore", "gst_number": "29AAACI9988C1Z3"},
            {"name": "Acme Technology Corp", "email": "contact@acme.com", "phone": "+1-555-0144", "website": "https://acmetech.com", "address": "100 Innovation Way, Silicon Valley, CA", "gst_number": "27AAACA12341Z5"},
        ]

        companies = []
        for c in comp_data:
            comp = db.query(Company).filter(Company.name == c["name"]).first()
            if not comp:
                comp = Company(**c)
                db.add(comp)
                db.commit()
                db.refresh(comp)
            companies.append(comp)
        print(f"Seeded {len(companies)} Companies.")

        c_google, c_tesla, c_infosys, c_acme = companies[0], companies[1], companies[2], companies[3]

        # 2. Seed Dedicated Users for all Role Types linked to companies
        user_list = [
            {"full_name": "Super Admin", "email": "admin@corporate.com", "phone": "+1-800-555-0199", "password_hash": hash_password("admin123"), "role": UserRole.SUPER_ADMIN, "company_id": None},
            {"full_name": "Google Company Admin", "email": "companyadmin@google.com", "phone": "+1-650-253-0000", "password_hash": hash_password("google123"), "role": UserRole.COMPANY_ADMIN, "company_id": c_google.id},
            {"full_name": "Acme HR Manager", "email": "hr@acmetech.com", "phone": "+1-555-0144", "password_hash": hash_password("hr123"), "role": UserRole.HR_MANAGER, "company_id": c_acme.id},
            {"full_name": "Global Tech Vendor", "email": "vendor@globalsupplies.com", "phone": "+1-555-0199", "password_hash": hash_password("vendor123"), "role": UserRole.VENDOR, "company_id": None},
            {"full_name": "Sarah Jenkins (Employee)", "email": "sarah.jenkins@acmetech.com", "phone": "+1-555-0188", "password_hash": hash_password("emp123"), "role": UserRole.EMPLOYEE, "company_id": c_acme.id},
        ]

        for u in user_list:
            existing_u = db.query(User).filter(User.email == u["email"]).first()
            if not existing_u:
                db.add(User(**u, is_active=True, is_verified=True))
            else:
                existing_u.company_id = u["company_id"]
        db.commit()
        print("Created/Updated User Accounts for All 5 Roles with company IDs!")

        # 3. Seed Multiple Employees under different companies
        emp_data = [
            # Google Employees
            {"employee_code": "GOOG-001", "first_name": "Sundar", "last_name": "Pichai", "work_email": "sundar@google.com", "department": "Executive", "designation": "Chief Executive Officer", "joining_date": date(2015, 8, 10), "company_id": c_google.id},
            {"employee_code": "GOOG-002", "first_name": "Marissa", "last_name": "Mayer", "work_email": "marissa@google.com", "department": "Product", "designation": "VP of Search", "joining_date": date(2018, 5, 20), "company_id": c_google.id},
            
            # Tesla Employees
            {"employee_code": "TSLA-101", "first_name": "Elon", "last_name": "Musk", "work_email": "elon@tesla.com", "department": "Engineering", "designation": "Technoking / CEO", "joining_date": date(2008, 10, 1), "company_id": c_tesla.id},
            {"employee_code": "TSLA-102", "first_name": "Gwynne", "last_name": "Shotwell", "work_email": "gwynne@tesla.com", "department": "Operations", "designation": "President & COO", "joining_date": date(2012, 3, 15), "company_id": c_tesla.id},
            
            # Infosys Employees
            {"employee_code": "INFY-501", "first_name": "Nandan", "last_name": "Nilekani", "work_email": "nandan@infosys.com", "department": "Board", "designation": "Non-Executive Chairman", "joining_date": date(1981, 7, 2), "company_id": c_infosys.id},
            {"employee_code": "INFY-502", "first_name": "Salil", "last_name": "Parekh", "work_email": "salil@infosys.com", "department": "Executive", "designation": "CEO & Managing Director", "joining_date": date(2018, 1, 2), "company_id": c_infosys.id},
            
            # Acme Employees
            {"employee_code": "EMP-1001", "first_name": "Sarah", "last_name": "Jenkins", "work_email": "sarah.jenkins@acmetech.com", "department": "Engineering", "designation": "Senior Software Engineer", "joining_date": date(2022, 3, 15), "company_id": c_acme.id},
            {"employee_code": "EMP-1002", "first_name": "John", "last_name": "Doe", "work_email": "john.doe@acmetech.com", "department": "Sales", "designation": "Account Executive", "joining_date": date(2023, 1, 10), "company_id": c_acme.id},
        ]

        employees = []
        for e in emp_data:
            emp = db.query(Employee).filter(Employee.work_email == e["work_email"]).first()
            if not emp:
                emp = Employee(**e)
                db.add(emp)
                db.commit()
                db.refresh(emp)
            employees.append(emp)
        print(f"Seeded {len(employees)} Employees across companies.")

        # 4. Seed Categories
        cat_tech = db.query(GiftCategory).filter(GiftCategory.name == "Executive Tech & Gadgets").first()
        if not cat_tech:
            cat_tech = GiftCategory(name="Executive Tech & Gadgets", description="High-end headphones, smartwatches, and chargers.")
            cat_lifestyle = GiftCategory(name="Lifestyle & Gourmet Boxes", description="Artisanal food sets, coffee blends, and wellness hampers.")
            db.add_all([cat_tech, cat_lifestyle])
            db.commit()

        # 5. Seed Gifts
        gift1 = db.query(Gift).filter(Gift.sku == "GIFT-TECH-01").first()
        if not gift1:
            g1 = Gift(name="Premium Noise-Canceling Headphones", sku="GIFT-TECH-01", description="Studio-quality noise cancellation with 30hr battery.", brand="AudioPro", price=199.99, stock=100, category_id=1)
            g2 = Gift(name="Smart Health Fitness Watch", sku="GIFT-WATCH-02", description="Waterproof smartwatch with HR monitor & GPS.", brand="FitPulse", price=149.50, stock=80, category_id=1)
            g3 = Gift(name="Luxury Italian Leather Journal Set", sku="GIFT-LUX-03", description="Handcrafted journal paired with weighted rollerball pen.", brand="Artisan", price=49.99, stock=150, category_id=2)
            g4 = Gift(name="Gourmet Coffee & Insulated Tumbler Set", sku="GIFT-FOOD-04", description="Specialty organic coffee beans with stainless tumbler.", brand="RoastCo", price=39.99, stock=200, category_id=2)
            db.add_all([g1, g2, g3, g4])
            db.commit()

        # 6. Seed Campaigns for Companies
        camps = [
            {"title": "Google Annual Founder Rewards 2026", "description": "Global recognition drive for Google senior leads.", "budget": 50000.0, "start_date": date(2026, 9, 1), "end_date": date(2026, 12, 31), "status": CampaignStatus.ACTIVE, "company_id": c_google.id},
            {"title": "Tesla Innovation Excellence Awards", "description": "Gifting drive for top engineering inventors.", "budget": 30000.0, "start_date": date(2026, 8, 1), "end_date": date(2026, 11, 30), "status": CampaignStatus.ACTIVE, "company_id": c_tesla.id},
            {"title": "Infosys Diwali Festive Drive 2026", "description": "Mass employee festival reward program.", "budget": 25000.0, "start_date": date(2026, 10, 1), "end_date": date(2026, 11, 15), "status": CampaignStatus.ACTIVE, "company_id": c_infosys.id},
        ]
        for camp in camps:
            existing_c = db.query(Campaign).filter(Campaign.title == camp["title"]).first()
            if not existing_c:
                db.add(Campaign(**camp))
        db.commit()

        # 7. Seed Orders
        orders = [
            {"order_number": "ORD-GOOG-881", "company_id": c_google.id, "employee_id": employees[0].id, "campaign_id": 1, "order_date": date(2026, 8, 5), "total_amount": 199.99, "status": OrderStatus.APPROVED},
            {"order_number": "ORD-TSLA-992", "company_id": c_tesla.id, "employee_id": employees[2].id, "campaign_id": 2, "order_date": date(2026, 8, 6), "total_amount": 149.50, "status": OrderStatus.PROCESSING},
            {"order_number": "ORD-INFY-103", "company_id": c_infosys.id, "employee_id": employees[4].id, "campaign_id": 3, "order_date": date(2026, 8, 7), "total_amount": 49.99, "status": OrderStatus.SHIPPED},
        ]
        for ord_item in orders:
            existing_o = db.query(Order).filter(Order.order_number == ord_item["order_number"]).first()
            if not existing_o:
                db.add(Order(**ord_item))
        db.commit()

        # 8. Seed Vouchers for Google & Tesla & Infosys
        vouchers = [
            {"code": "GC-GOOGLE", "amount": 300.00, "recipient_email": "sundar@google.com", "recipient_name": "Sundar Pichai", "company_id": c_google.id},
            {"code": "GC-TESLA", "amount": 250.00, "recipient_email": "elon@tesla.com", "recipient_name": "Elon Musk", "company_id": c_tesla.id},
            {"code": "GC-INFOSYS", "amount": 200.00, "recipient_email": "salil@infosys.com", "recipient_name": "Salil Parekh", "company_id": c_infosys.id},
        ]
        for v in vouchers:
            ex_v = db.query(Voucher).filter(Voucher.code == v["code"]).first()
            if not ex_v:
                db.add(Voucher(code=v["code"], amount=v["amount"], recipient_email=v["recipient_email"], recipient_name=v["recipient_name"], expiry_date=date.today()+timedelta(days=60), is_redeemed=False, company_id=v["company_id"]))
        db.commit()

        print("Comprehensive Seeding Completed Successfully!")
    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
