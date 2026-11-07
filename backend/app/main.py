"""The orders demo API."""

from fastapi import FastAPI

from app.api.v1.routes import orders
from app.core.errors import register_error_handlers

app = FastAPI(title="Orders demo")
app.include_router(orders.router, prefix="/api/v1")
register_error_handlers(app)
