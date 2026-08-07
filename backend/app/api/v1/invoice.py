from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.invoice_service import InvoiceService

router = APIRouter(
    prefix="/orders",
    tags=["Invoice"],
)


@router.get("/{order_id}/invoice")
def download_invoice(
    order_id: int,
    db: Session = Depends(get_db),
):
    pdf_path = InvoiceService.generate_invoice(
        db,
        order_id,
    )

    return FileResponse(
        path=pdf_path,
        filename=pdf_path.split("/")[-1],
        media_type="application/pdf",
    )