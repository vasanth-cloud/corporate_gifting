from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.permissions import verify_company_access
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse
from app.services.order_service import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(
    request: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to place orders.",
        )

    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(request.company_id, current_user)

    return OrderService.create(db, request)


@router.get("", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    company_id = None
    employee_id = None
    vendor_id = None

    if current_user.role in [UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER]:
        company_id = current_user.company_id

    elif current_user.role == UserRole.VENDOR:
        vendor_id = getattr(current_user, "vendor_id", 1)

    elif current_user.role == UserRole.EMPLOYEE:
        emp = db.query(Employee).filter(Employee.work_email == current_user.email).first()
        employee_id = emp.id if emp else -1

    return OrderService.get_all(
        db,
        company_id=company_id,
        employee_id=employee_id,
        vendor_id=vendor_id,
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = OrderService.get_by_id(db, order_id)

    if current_user.role != UserRole.SUPER_ADMIN:
        if current_user.role in [UserRole.COMPANY_ADMIN, UserRole.HR_MANAGER]:
            verify_company_access(order.company_id, current_user)
        elif current_user.role == UserRole.EMPLOYEE:
            emp = db.query(Employee).filter(Employee.work_email == current_user.email).first()
            if not emp or order.employee_id != emp.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access Denied: You can only view your own orders.",
                )

    return order


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    request: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = OrderService.get_by_id(db, order_id)

    if current_user.role != UserRole.SUPER_ADMIN:
        verify_company_access(order.company_id, current_user)

    return OrderService.update(db, order_id, request)


@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = OrderService.get_by_id(db, order_id)

    if current_user.role != UserRole.SUPER_ADMIN:
        if current_user.role != UserRole.COMPANY_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only Company Admins or Super Admins can delete orders.",
            )
        verify_company_access(order.company_id, current_user)

    return OrderService.delete(db, order_id)