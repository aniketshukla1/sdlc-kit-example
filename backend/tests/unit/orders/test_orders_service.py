"""OrdersService, with the repository mocked."""

from decimal import Decimal
from unittest.mock import Mock

import pytest

from app.core.errors import OrderNotFoundError
from app.repositories.orders_repository import Order, OrderLine, OrdersRepository
from app.services.orders_service import OrdersService


def service_with(order: Order | None) -> OrdersService:
    """A service whose repository returns this order."""
    repository = Mock(spec=OrdersRepository)
    repository.get.return_value = order
    return OrdersService(repository)


def test_get_order_total_adds_up_the_lines() -> None:
    tea = OrderLine("TEA", "Tea", Decimal("10.00"), 1)
    mug = OrderLine("MUG", "Mug", Decimal("14.50"), 1)
    service = service_with(Order(id=7, lines=(tea, mug)))

    result = service.get_order(7)

    assert result.total == Decimal("24.50")


def test_get_order_without_lines_has_zero_total() -> None:
    service = service_with(Order(id=7, lines=()))

    result = service.get_order(7)

    assert result.total == Decimal("0.00")


def test_get_order_that_does_not_exist_raises_not_found() -> None:
    service = service_with(None)

    with pytest.raises(OrderNotFoundError, match="Order 7 not found"):
        service.get_order(7)
