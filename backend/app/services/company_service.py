from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.company import Company
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyCreate, CompanyUpdate


class CompanyService:

    @staticmethod
    def create(db: Session, request: CompanyCreate):

        existing = CompanyRepository.get_by_email(
            db,
            request.email,
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Company email already exists",
            )

        company = Company(
            name=request.name,
            email=request.email,
            phone=request.phone,
            website=request.website,
            address=request.address,
            logo=request.logo,
            gst_number=request.gst_number,
        )

        return CompanyRepository.create(
            db,
            company,
        )

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        return CompanyRepository.get_all(
            db=db,
            search=search,
            page=page,
            limit=limit,
        )

    @staticmethod
    def get_by_id(
        db: Session,
        company_id: int,
    ):

        company = CompanyRepository.get_by_id(
            db,
            company_id,
        )

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company not found",
            )

        return company

    @staticmethod
    def update(
        db: Session,
        company_id: int,
        request: CompanyUpdate,
    ):

        company = CompanyRepository.get_by_id(
            db,
            company_id,
        )

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company not found",
            )

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(company, key, value)

        return CompanyRepository.update(
            db,
            company,
        )

    @staticmethod
    def delete(
        db: Session,
        company_id: int,
    ):

        company = CompanyRepository.get_by_id(
            db,
            company_id,
        )

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company not found",
            )

        CompanyRepository.delete(
            db,
            company,
        )

        return {
            "message": "Company deleted successfully"
        }