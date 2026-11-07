"""Orders API."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.repositories.orders_repository import OrdersRepository
from app.schemas.orders import OrderRead
from app.services.orders_service import OrdersService

router = APIRouter(prefix="/orders", tags=["orders"])


def get_orders_service() -> OrdersService:
    """The service, with its repository."""
    return OrdersService(OrdersRepository())


@router.get("/{order_id}", response_model=OrderRead, status_code=status.HTTP_200_OK)
def read_order(
    order_id: int, service: Annotated[OrdersService, Depends(get_orders_service)]
) -> OrderRead:
    """Read one order. Public on purpose: this demo only serves made-up data."""
    return service.get_order(order_id)
