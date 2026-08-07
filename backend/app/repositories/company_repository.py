from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.company import Company


class CompanyRepository:

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        query = db.query(Company)

        if search:
            query = query.filter(
                or_(
                    Company.name.ilike(f"%{search}%"),
                    Company.email.ilike(f"%{search}%"),
                    Company.gst_number.ilike(f"%{search}%"),
                )
            )

        return (
            query.offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, company_id: int):
        return (
            db.query(Company)
            .filter(Company.id == company_id)
            .first()
        )

    @staticmethod
    def get_by_email(db: Session, email: str):
        return (
            db.query(Company)
            .filter(Company.email == email)
            .first()
        )

    @staticmethod
    def create(db: Session, company: Company):
        db.add(company)
        db.commit()
        db.refresh(company)
        return company

    @staticmethod
    def update(db: Session, company: Company):
        db.commit()
        db.refresh(company)
        return company

    @staticmethod
    def delete(db: Session, company: Company):
        db.delete(company)
        db.commit()