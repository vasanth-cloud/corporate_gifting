from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.vendor import Vendor


class VendorRepository:

    @staticmethod
    def create(db: Session, vendor: Vendor):
        db.add(vendor)
        db.commit()
        db.refresh(vendor)
        return vendor

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        query = db.query(Vendor)

        if search:
            query = query.filter(
                or_(
                    Vendor.company_name.ilike(f"%{search}%"),
                    Vendor.contact_person.ilike(f"%{search}%"),
                    Vendor.email.ilike(f"%{search}%"),
                    Vendor.phone.ilike(f"%{search}%"),
                    Vendor.gst_number.ilike(f"%{search}%"),
                )
            )

        return (
            query.offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, vendor_id: int):
        return db.query(Vendor).filter(Vendor.id == vendor_id).first()

    @staticmethod
    def update(db: Session):
        db.commit()

    @staticmethod
    def delete(db: Session, vendor: Vendor):
        db.delete(vendor)
        db.commit()