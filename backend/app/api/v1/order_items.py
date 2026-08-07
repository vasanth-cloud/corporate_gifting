from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.order_item import (
    OrderItemCreate,
    OrderItemUpdate,
    OrderItemResponse,
)
from app.services.order_item_service import OrderItemService

router = APIRouter(
    prefix="/order-items",
    tags=["Order Items"],
)


@router.post("", response_model=OrderItemResponse)
def create_item(
    request: OrderItemCreate,
    db: Session = Depends(get_db),
):
    return OrderItemService.create(db, request)


@router.get("", response_model=list[OrderItemResponse])
def get_items(db: Session = Depends(get_db)):
    return OrderItemService.get_all(db)


@router.get("/{item_id}", response_model=OrderItemResponse)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    return OrderItemService.get_by_id(db, item_id)


@router.put("/{item_id}", response_model=OrderItemResponse)
def update_item(
    item_id: int,
    request: OrderItemUpdate,
    db: Session = Depends(get_db),
):
    return OrderItemService.update(
        db,
        item_id,
        request,
    )


@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
):
    return OrderItemService.delete(
        db,
        item_id,
    )