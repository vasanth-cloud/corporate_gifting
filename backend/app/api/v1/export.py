from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.repositories.order_repository import OrderRepository
from app.services.export_service import ExportService

router = APIRouter(
    prefix="/export",
    tags=["Export"],
)


@router.get("/orders/excel")
def export_orders_excel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    orders = OrderRepository.get_all(db)

    rows = []

    for o in orders:
        rows.append([
            o.order_number,
            o.order_date,
            o.total_amount,
            o.status,
        ])

    excel = ExportService.excel(
        rows,
        [
            "Order Number",
            "Order Date",
            "Amount",
            "Status",
        ],
    )

    return StreamingResponse(
        excel,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition":
            "attachment; filename=orders.xlsx"
        },
    )


@router.get("/orders/pdf")
def export_orders_pdf(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    orders = OrderRepository.get_all(db)

    rows = []

    for o in orders:
        rows.append([
            o.order_number,
            o.order_date,
            o.total_amount,
            o.status,
        ])

    pdf = ExportService.pdf(
        "Orders Report",
        rows,
        [
            "Order",
            "Date",
            "Amount",
            "Status",
        ],
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=orders.pdf"
        },
    )