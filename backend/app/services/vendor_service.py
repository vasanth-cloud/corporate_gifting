from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.repositories.vendor_repository import VendorRepository
from app.schemas.vendor import VendorCreate, VendorUpdate


class VendorService:

    @staticmethod
    def create(db: Session, request: VendorCreate):

        if VendorRepository.get_by_email(db, request.email):
            raise HTTPException(
                status_code=400,
                detail="Vendor already exists",
            )

        vendor = Vendor(**request.model_dump())

        return VendorRepository.create(db, vendor)

    @staticmethod
    def get_all(
        db: Session,
        search: str | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        return VendorRepository.get_all(
            db=db,
            search=search,
            page=page,
            limit=limit,
        )

    @staticmethod
    def get_by_id(db: Session, vendor_id: int):

        vendor = VendorRepository.get_by_id(db, vendor_id)

        if not vendor:
            raise HTTPException(
                status_code=404,
                detail="Vendor not found",
            )

        return vendor

    @staticmethod
    def update(
        db: Session,
        vendor_id: int,
        request: VendorUpdate,
    ):

        vendor = VendorRepository.get_by_id(db, vendor_id)

        if not vendor:
            raise HTTPException(
                status_code=404,
                detail="Vendor not found",
            )

        update_data = request.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(vendor, key, value)

        return VendorRepository.update(db, vendor)

    @staticmethod
    def delete(db: Session, vendor_id: int):

        vendor = VendorRepository.get_by_id(db, vendor_id)

        if not vendor:
            raise HTTPException(
                status_code=404,
                detail="Vendor not found",
            )

        VendorRepository.delete(db, vendor)

        return {
            "message": "Vendor deleted successfully"
        }