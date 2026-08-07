from datetime import date
from sqlalchemy import Boolean, String, Float, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Voucher(BaseModel):
    __tablename__ = "vouchers"

    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    recipient_email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    recipient_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    expiry_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    is_redeemed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    redeemed_at: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id"),
        nullable=False,
    )

    company = relationship(
        "Company",
    )
