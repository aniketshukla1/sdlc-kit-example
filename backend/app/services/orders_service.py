"""Order business rules."""

from decimal import Decimal

from app.core.errors import OrderNotFoundError
from app.repositories.orders_repository import OrdersRepository
from app.schemas.orders import OrderLineRead, OrderRead


class OrdersService:
    """Reads orders and works out their totals."""

    def __init__(self, repository: OrdersRepository) -> None:
        self._repository = repository

    def get_order(self, order_id: int) -> OrderRead:
        """The order with its total. Raises OrderNotFoundError when it doesn't exist."""
        order = self._repository.get(order_id)
        if order is None:
            raise OrderNotFoundError(order_id)
        total = sum((line.unit_price * line.quantity for line in order.lines), Decimal("0.00"))
        lines = [OrderLineRead.model_validate(line) for line in order.lines]
        return OrderRead(id=order.id, lines=lines, total=total)
