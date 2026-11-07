"""Domain errors, and how the API reports them."""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse


class OrderNotFoundError(Exception):
    """No order has this id."""

    def __init__(self, order_id: int) -> None:
        super().__init__(f"Order {order_id} not found")


def register_error_handlers(app: FastAPI) -> None:
    """Turn domain errors into HTTP responses."""

    @app.exception_handler(OrderNotFoundError)
    async def order_not_found(_: Request, error: OrderNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"detail": str(error)})
