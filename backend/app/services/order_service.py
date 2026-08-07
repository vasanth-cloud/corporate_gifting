from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order import Order
from app.repositories.order_repository import OrderRepository
from app.repositories.employee_repository import EmployeeRepository
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.email_service import EmailService
from app.services.invoice_service import InvoiceService


class OrderService:

    @staticmethod
    def create(db: Session, request: OrderCreate):

        # Create Order
        order = Order(**request.model_dump())
        order = OrderRepository.create(db, order)

        # Generate Invoice PDF
        pdf_path = InvoiceService.generate_invoice(
            db,
            order.id,
        )

        # Get Employee
        employee = EmployeeRepository.get_by_id(
            db,
            order.employee_id,
        )

        # Send Email + Invoice
        if employee:

            body = f"""
    Hello {employee.first_name},

    Your corporate gift order has been created successfully.

    Order Number : {order.order_number}
    Order Date   : {order.order_date}
    Status       : {order.status.value}
    Total Amount : ₹{order.total_amount}

    The invoice has been attached to this email.

    Thank you.

    Corporate Gifting Platform
    """

            EmailService.send_email_with_attachment(
                employee.work_email,
                "Corporate Gift Order Confirmation",
                body,
                pdf_path,
            )

        return order

    @staticmethod
    def get_all(db: Session):
        return OrderRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, order_id: int):

        order = OrderRepository.get_by_id(db, order_id)

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

        return order

    @staticmethod
    def update(db: Session, order_id: int, request: OrderUpdate):

        order = OrderRepository.get_by_id(db, order_id)

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

        for key, value in request.model_dump(exclude_unset=True).items():
            setattr(order, key, value)

        OrderRepository.update(db)

        return order

    @staticmethod
    def delete(db: Session, order_id: int):

        order = OrderRepository.get_by_id(db, order_id)

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found",
            )

        OrderRepository.delete(db, order)

        return {
            "message": "Order deleted successfully"
        }