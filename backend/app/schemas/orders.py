"""API shapes for orders."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class OrderLineRead(BaseModel):
    """One product on an order."""

    model_config = ConfigDict(from_attributes=True)

    sku: str
    name: str
    unit_price: Decimal
    quantity: int


class OrderRead(BaseModel):
    """An order with its lines and total."""

    id: int
    lines: list[OrderLineRead]
    total: Decimal
