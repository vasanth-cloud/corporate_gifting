from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
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
):
    return OrderService.create(db, request)


@router.get("", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
):
    return OrderService.get_all(db)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    return OrderService.get_by_id(db, order_id)


@router.put("/{order_id}", response_model=OrderResponse)
def update_order(
    order_id: int,
    request: OrderUpdate,
    db: Session = Depends(get_db),
):
    return OrderService.update(db, order_id, request)


@router.delete("/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
):
    return OrderService.delete(db, order_id)