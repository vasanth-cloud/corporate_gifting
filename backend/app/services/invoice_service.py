import os

from fastapi import HTTPException
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from app.repositories.company_repository import CompanyRepository
from app.repositories.employee_repository import EmployeeRepository
from app.repositories.order_item_repository import OrderItemRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.gift_repository import GiftRepository


class InvoiceService:

    @staticmethod
    def generate_invoice(db: Session, order_id: int):

        # Get order
        order = OrderRepository.get_by_id(db, order_id)

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

        # Get employee
        employee = EmployeeRepository.get_by_id(
            db,
            order.employee_id,
        )

        # Get company
        company = CompanyRepository.get_by_id(
            db,
            order.company_id,
        )

        # Get order items
        items = OrderItemRepository.get_by_order_id(
            db,
            order.id,
        )

        # Create invoices folder
        os.makedirs("invoices", exist_ok=True)

        pdf_path = f"invoices/invoice_{order.order_number}.pdf"

        pdf = canvas.Canvas(pdf_path)

        y = 800

        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(180, y, "Corporate Gifting Platform")

        y -= 40

        pdf.setFont("Helvetica-Bold", 14)
        pdf.drawString(240, y, "INVOICE")

        y -= 40

        pdf.setFont("Helvetica", 12)

        pdf.drawString(50, y, f"Order Number : {order.order_number}")
        y -= 20

        pdf.drawString(
            50,
            y,
            f"Order Date : {order.order_date}",
        )
        y -= 20

        pdf.drawString(
            50,
            y,
            f"Status : {order.status.value}",
        )
        y -= 30

        pdf.drawString(
            50,
            y,
            f"Employee : {employee.first_name} {employee.last_name}",
        )
        y -= 20

        pdf.drawString(
            50,
            y,
            f"Company : {company.name}",
        )

        y -= 40

        pdf.setFont("Helvetica-Bold", 12)

        pdf.drawString(50, y, "Gift")
        pdf.drawString(250, y, "Qty")
        pdf.drawString(320, y, "Price")

        y -= 20

        pdf.line(50, y, 520, y)

        y -= 20

        total = 0

        pdf.setFont("Helvetica", 11)

        for item in items:

            gift = GiftRepository.get_by_id(
                db,
                item.gift_id,
            )

            gift_name = gift.name if gift else "Unknown Gift"

            pdf.drawString(
                50,
                y,
                gift_name,
            )

            pdf.drawString(
                250,
                y,
                str(item.quantity),
            )

            pdf.drawString(
                320,
                y,
                f"₹ {item.price}",
            )

            total += float(item.price)

            y -= 20

            if y < 100:
                pdf.showPage()
                y = 800

        y -= 20

        pdf.line(50, y, 520, y)

        y -= 30

        pdf.setFont("Helvetica-Bold", 12)

        pdf.drawString(
            50,
            y,
            f"Total Amount : ₹ {total:.2f}",
        )

        y -= 40

        pdf.drawString(
            50,
            y,
            "Thank you for using Corporate Gifting Platform!",
        )

        pdf.save()

        return pdf_path