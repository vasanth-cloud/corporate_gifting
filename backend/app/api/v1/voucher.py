import uuid
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import require_roles
from app.models.user import User, UserRole
from app.models.voucher import Voucher
from app.models.gift import Gift
from app.models.order import Order, OrderStatus
from app.models.employee import Employee
from app.models.campaign import Campaign
from app.schemas.voucher import VoucherCreate, VoucherClaimRequest, VoucherResponse
from app.services.email_service import EmailService

router = APIRouter(
    prefix="/vouchers",
    tags=["Digital Vouchers"],
)


@router.post("", response_model=VoucherResponse, status_code=201)
def generate_voucher(
    req: VoucherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.SUPER_ADMIN,
            UserRole.COMPANY_ADMIN,
            UserRole.HR_MANAGER,
        )
    ),
):
    code = f"GC-{uuid.uuid4().hex[:6].upper()}"
    expiry = date.today() + timedelta(days=req.days_valid)

    voucher = Voucher(
        code=code,
        amount=req.amount,
        recipient_email=req.recipient_email,
        recipient_name=req.recipient_name or req.recipient_email.split("@")[0],
        expiry_date=expiry,
        is_redeemed=False,
        company_id=req.company_id,
    )
    db.add(voucher)
    db.commit()
    db.refresh(voucher)

    EmailService.send_voucher_code(
        recipient_email=voucher.recipient_email,
        recipient_name=voucher.recipient_name or "Employee",
        code=voucher.code,
        amount=voucher.amount,
    )

    return voucher


@router.get("/validate/{code}")
def validate_voucher(code: str, db: Session = Depends(get_db)):
    voucher = db.query(Voucher).filter(Voucher.code == code.upper()).first()
    if not voucher:
        raise HTTPException(status_code=404, detail="Invalid voucher code.")
    if voucher.is_redeemed:
        raise HTTPException(status_code=400, detail="Voucher has already been redeemed.")
    if voucher.expiry_date and voucher.expiry_date < date.today():
        raise HTTPException(status_code=400, detail="Voucher code has expired.")

    return {
        "valid": True,
        "code": voucher.code,
        "amount": voucher.amount,
        "recipient_name": voucher.recipient_name,
        "recipient_email": voucher.recipient_email,
        "company_id": voucher.company_id,
    }


@router.post("/claim")
def claim_voucher(req: VoucherClaimRequest, db: Session = Depends(get_db)):
    voucher = db.query(Voucher).filter(Voucher.code == req.code.upper()).first()
    if not voucher or voucher.is_redeemed:
        raise HTTPException(status_code=400, detail="Voucher invalid or already claimed.")

    gift = db.query(Gift).filter(Gift.id == req.gift_id).first()
    if not gift:
        raise HTTPException(status_code=404, detail="Selected gift not found.")

    if gift.price > voucher.amount:
        raise HTTPException(
            status_code=400,
            detail=f"Gift price (${gift.price:.2f}) exceeds voucher value (${voucher.amount:.2f}).",
        )

    # Find valid employee & campaign for foreign key requirements
    emp = db.query(Employee).filter(Employee.company_id == voucher.company_id).first()
    if not emp:
        emp = db.query(Employee).first()

    camp = db.query(Campaign).filter(Campaign.company_id == voucher.company_id).first()
    if not camp:
        camp = db.query(Campaign).first()

    if not emp or not camp:
        raise HTTPException(status_code=400, detail="Database missing employee or campaign records.")

    voucher.is_redeemed = True
    voucher.redeemed_at = date.today()

    order = Order(
        order_number=f"VOUCH-{uuid.uuid4().hex[:6].upper()}",
        company_id=voucher.company_id,
        employee_id=emp.id,
        campaign_id=camp.id,
        order_date=date.today(),
        total_amount=gift.price,
        status=OrderStatus.PROCESSING,
    )
    db.add(order)
    db.commit()

    EmailService.send_order_status_update(
        recipient_email=voucher.recipient_email,
        order_number=order.order_number,
        new_status="PROCESSING (Voucher Claimed)",
    )

    return {
        "message": f"Successfully claimed {gift.name}!",
        "order_number": order.order_number,
        "gift_name": gift.name,
    }
