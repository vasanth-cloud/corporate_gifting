import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.order import Order, OrderStatus
from app.services.email_service import EmailService

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


class PaymentOrderRequest(BaseModel):
    order_id: int
    payment_method: str  # "CARD", "UPI", "NET_BANKING"


class PaymentVerifyRequest(BaseModel):
    payment_id: str
    order_id: int
    status: str = "SUCCESS"


@router.post("/create-order")
def create_payment_order(
    req: PaymentOrderRequest,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    gateway_payment_id = f"PAY-{uuid.uuid4().hex[:8].upper()}"

    return {
        "gateway_payment_id": gateway_payment_id,
        "amount": order.total_amount,
        "currency": "USD",
        "order_number": order.order_number,
        "status": "CREATED",
    }


@router.post("/verify")
def verify_payment(
    req: PaymentVerifyRequest,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == req.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if req.status == "SUCCESS":
        order.status = OrderStatus.APPROVED
        db.commit()

        # Send notification
        EmailService.send_order_status_update(
            recipient_email="finance@corporate.com",
            order_number=order.order_number,
            new_status="APPROVED (Paid via Gateway)",
        )

        return {
            "status": "SUCCESS",
            "message": "Payment verified and order approved successfully!",
            "payment_id": req.payment_id,
        }
    else:
        return {
            "status": "FAILED",
            "message": "Payment transaction failed.",
        }
