"""Orders storage. In memory, because this demo has no database."""

from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class OrderLine:
    """One product on an order."""

    sku: str
    name: str
    unit_price: Decimal
    quantity: int


@dataclass(frozen=True)
class Order:
    """An order and its lines."""

    id: int
    lines: tuple[OrderLine, ...]


_ORDERS = {
    1001: Order(
        id=1001,
        lines=(
            OrderLine("TEA-250", "Green tea 250 g", Decimal("10.00"), 2),
            OrderLine("MUG-01", "Ceramic mug", Decimal("14.50"), 1),
        ),
    ),
    1002: Order(id=1002, lines=()),
}


class OrdersRepository:
    """Reads orders."""

    def get(self, order_id: int) -> Order | None:
        """The order with this id, or None."""
        return _ORDERS.get(order_id)
